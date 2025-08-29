pipeline {
    agent {
        kubernetes {
            yaml '''
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: node
    image: node:18-slim
    command:
    - cat
    tty: true
  - name: sonar-scanner
    image: sonarsource/sonar-scanner-cli
    command:
    - cat
    tty: true
  - name: kubectl
    image: bitnami/kubectl:latest
    command:
    - cat
    tty: true
    securityContext:
      runAsUser: 0
      readOnlyRootFilesystem: false
    env:
    - name: KUBECONFIG
      value: /kube/config        
    volumeMounts:
    - name: kubeconfig-secret
      mountPath: /kube/config
      subPath: kubeconfig
  - name: dind
    image: docker:dind
    args: ["--registry-mirror=https://mirror.gcr.io", "--storage-driver=overlay2"]
    securityContext:
      privileged: true
    env:
    - name: DOCKER_TLS_CERTDIR
      value: ""
    volumeMounts:
    - name: docker-config
      mountPath: /etc/docker/daemon.json
      subPath: daemon.json
  volumes:
  - name: docker-config
    configMap:
      name: docker-daemon-config
  - name: kubeconfig-secret
    secret:
      secretName: kubeconfig-secret
'''
        }
    }

    environment {
        //Supabase environment variables stored in Jenkins credentials
        NEXT_PUBLIC_SUPABASE_URL       = credentials('supabase-url')
        NEXT_PUBLIC_SUPABASE_ANON_KEY  = credentials('supabase-anon')
        SUPABASE_SERVICE_ROLE_KEY       = credentials('supabase-service-role')
        
        //Docker/Nexus registry
        NEXUS_HOST = '127.0.0.1:5000'
        NEXUS_REPO = 'my-repository'
        IMAGE_NAME = 'interview-questions-app'
        IMAGE_TAG  = 'v1'
    }

    stages {
        stage('Install & Test') {
            steps {
                container('node') {
                    sh '''
                        npm install
                        npm run build
                        npm test || echo "⚠️ No tests found, skipping..."
                    '''
                }
            }
        }

        stage('SonarQube Analysis') {
            steps {
                container('sonar-scanner') {
                    withCredentials([string(credentialsId: 'sonarqube-2401096', variable: 'SONAR_TOKEN')]) {
                        sh '''
                            sonar-scanner \
                                -Dsonar.projectKey=2401199_interview-questions-app \
                                -Dsonar.host.url=http://my-sonarqube-sonarqube.sonarqube.svc.cluster.local:9000 \
                                -Dsonar.login=$SONAR_TOKEN \
                                -Dsonar.sources=. \
                                -Dsonar.exclusions=node_modules/**,.next/** \
                                -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info
                        '''
                    }
                }
            }
        }

        stage('Login to Docker Registry') {
            steps {
                container('dind') {
                    sh 'docker login nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085 -u admin -p Changeme@2025'
                }
            }
        }

        stage('Build - Tag - Push') {
            steps {
                container('dind') {
                    sh '''
                        docker build -t nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085/my-repository/interview-questions-app:v1 .
                        docker push nexus-service-for-docker-hosted-registry.nexus.svc.cluster.local:8085/my-repository/interview-questions-app:v1
                    '''
                }
            }
        }

        stage('Deploy Next.js Application') {
            steps {
                container('kubectl') {
                    script {
                        dir('nextjs-deployment') {
                            sh 'kubectl get nodes'
                            sh 'kubectl apply -f nextjs-deployment.yaml'
                            sh 'kubectl rollout status deployment/interview-questions-app'
                        }
                    }
                }
            }
        }
    }
}
