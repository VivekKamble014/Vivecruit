# Vivecruit - Workflow Documentation
## Comprehensive System Workflow Analysis

---

## Table of Contents
1. [System Overview](#system-overview)
2. [User Workflows](#user-workflows)
3. [System Processes](#system-processes)
4. [Business Logic](#business-logic)
5. [Error Handling](#error-handling)
6. [Integration Workflows](#integration-workflows)
7. [Security Workflows](#security-workflows)
8. [Performance Workflows](#performance-workflows)
9. [Monitoring & Analytics](#monitoring--analytics)
10. [Maintenance Workflows](#maintenance-workflows)

---

## System Overview

### Vivecruit Platform Architecture
Vivecruit is an AI-powered recruitment platform that automates the interview process through intelligent voice interactions, dynamic question generation, and comprehensive candidate evaluation.

### Core Workflow Components
1. **User Management**: Authentication, authorization, and profile management
2. **Interview Creation**: Dynamic interview setup with AI-generated questions
3. **Interview Execution**: Real-time voice interviews using VAPI.ai
4. **Feedback Generation**: AI-powered candidate evaluation and scoring
5. **Results Management**: Comprehensive reporting and analytics

---

## User Workflows

### 1. Recruiter Workflow

#### 1.1 Authentication & Onboarding
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Landing Page  │───►│   Google OAuth  │───►│   User Profile  │
│                 │    │   Login         │    │   Creation      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Dashboard     │◄───│   Session       │◄───│   Profile       │
│   Access        │    │   Creation      │    │   Validation    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

**Process Steps**:
1. **Landing Page Access**: User visits Vivecruit platform
2. **Google OAuth**: Clicks "Login with Google" button
3. **Authentication**: Google OAuth flow completes
4. **Profile Creation**: System creates/updates user profile in database
5. **Session Management**: JWT token created and stored
6. **Dashboard Redirect**: User redirected to main dashboard

**Business Rules**:
- Users must authenticate via Google OAuth
- New users are automatically created in the system
- Existing users are updated with latest profile information
- Sessions expire after 24 hours of inactivity

#### 1.2 Interview Creation Workflow
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Dashboard     │───►│   Create        │───►│   Form          │
│   "Create New"  │    │   Interview     │    │   Step 1        │
│   Button        │    │   Button        │    │   (Job Details) │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Form          │───►│   Validation    │───►│   AI Question   │
│   Step 2        │    │   & Processing  │    │   Generation    │
│   (Interview    │    │                 │    │                 │
│   Type)         │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Question      │───►│   Review &      │───►│   Interview     │
│   List          │    │   Save          │    │   Link          │
│   Display       │    │   Interview     │    │   Generation    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Share Link    │───►│   Copy to       │───►│   Dashboard     │
│   with          │    │   Clipboard     │    │   Return        │
│   Candidate     │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

**Process Steps**:
1. **Form Step 1**: Enter job position, description, duration
2. **Form Step 2**: Select interview type (Technical, Behavioral, etc.)
3. **Validation**: System validates all required fields
4. **AI Generation**: OpenAI generates questions based on inputs
5. **Question Review**: Recruiter reviews generated questions
6. **Interview Save**: Interview data saved to database
7. **Link Generation**: Unique interview URL created
8. **Link Sharing**: Recruiter copies and shares link

**Business Rules**:
- All form fields are required
- Interview type must be selected from predefined list
- Questions are generated using AI based on job requirements
- Interview links are valid for 30 days
- Each interview has a unique identifier

#### 1.3 Interview Monitoring Workflow
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Dashboard     │───►│   Interview     │───►│   Status        │
│   Interview     │    │   List          │    │   Monitoring    │
│   Management    │    │   View          │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Real-time     │───►│   Candidate     │───►│   Progress      │
│   Status        │    │   Progress      │    │   Tracking      │
│   Updates       │    │   Updates       │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Interview     │───►│   Results       │───►│   Feedback      │
│   Completion    │    │   Generation    │    │   Review        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

**Process Steps**:
1. **Interview List**: View all created interviews
2. **Status Monitoring**: Track interview status (active, completed, expired)
3. **Real-time Updates**: Receive live updates on candidate progress
4. **Completion Notification**: Get notified when interview completes
5. **Results Review**: Review AI-generated feedback and ratings

**Business Rules**:
- Only interview creators can view their interviews
- Real-time updates are provided during active interviews
- Results are generated automatically upon completion
- Feedback includes ratings and recommendations

### 2. Candidate Workflow

#### 2.1 Interview Access Workflow
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Interview     │───►│   Link          │───►│   Interview     │
│   Link          │    │   Validation    │    │   Landing       │
│   Received      │    │                 │    │   Page          │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Job Details   │───►│   Candidate     │───►│   Information   │
│   Display       │    │   Information   │    │   Validation    │
│                 │    │   Form          │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Interview     │───►│   Voice         │───►│   Interview     │
│   Room          │    │   Connection    │    │   Start         │
│   Entry         │    │   Setup         │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

**Process Steps**:
1. **Link Access**: Candidate clicks interview link
2. **Link Validation**: System validates interview link and expiry
3. **Job Details**: Display job position and requirements
4. **Information Collection**: Collect candidate name and email
5. **Validation**: Validate candidate information
6. **Interview Room**: Redirect to interview interface
7. **Voice Setup**: Initialize voice connection
8. **Interview Start**: Begin AI-powered interview

**Business Rules**:
- Interview links must be valid and not expired
- Candidate information is required (name, email)
- Voice permissions must be granted
- Interview can only be accessed once per candidate

#### 2.2 Interview Execution Workflow
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   AI            │───►│   Question      │───►│   Candidate     │
│   Introduction  │    │   Presentation  │    │   Response      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Voice         │───►│   Real-time     │───►│   Conversation  │
│   Processing    │    │   Interaction   │    │   Tracking      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Question      │───►│   Interview     │───►│   Completion    │
│   Progression   │    │   Conclusion    │    │   Confirmation  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

**Process Steps**:
1. **AI Introduction**: AI assistant introduces interview
2. **Question Presentation**: AI presents questions one by one
3. **Candidate Response**: Candidate provides verbal responses
4. **Voice Processing**: System processes and records responses
5. **Real-time Interaction**: Natural conversation flow
6. **Question Progression**: AI moves to next question
7. **Interview Conclusion**: AI concludes interview
8. **Completion Confirmation**: System confirms completion

**Business Rules**:
- Questions are presented sequentially
- AI adapts based on candidate responses
- Voice quality is monitored throughout
- Interview duration is tracked
- Conversation is recorded for analysis

#### 2.3 Interview Completion Workflow
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Interview     │───►│   Voice         │───►│   Data          │
│   End           │    │   Disconnection │    │   Processing    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Conversation  │───►│   AI Feedback   │───►│   Results       │
│   Analysis      │    │   Generation    │    │   Storage       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Completion    │───►│   Thank You     │───►│   Exit          │
│   Confirmation  │    │   Message       │    │   Interview     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

**Process Steps**:
1. **Interview End**: AI concludes interview session
2. **Voice Disconnection**: Terminate voice connection
3. **Data Processing**: Process conversation data
4. **AI Analysis**: Generate feedback using AI
5. **Results Storage**: Save results to database
6. **Completion Message**: Display thank you message
7. **Exit**: Redirect candidate away from interview

**Business Rules**:
- Interview cannot be restarted once completed
- Results are generated automatically
- Candidate receives confirmation of completion
- Data is securely stored for recruiter review

---

## System Processes

### 1. AI Question Generation Process
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Job Details   │───►│   Prompt        │───►│   OpenAI API    │
│   Input         │    │   Formatting    │    │   Request       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   AI Response   │───►│   JSON          │───►│   Question      │
│   Processing    │    │   Parsing       │    │   Validation    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Question      │───►│   Database      │───►│   Interview     │
│   Storage       │    │   Save          │    │   Configuration │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

**Technical Details**:
- **Input Processing**: Job position, description, duration, type
- **Prompt Engineering**: Structured prompts for consistent output
- **API Integration**: OpenAI via OpenRouter.ai
- **Response Parsing**: JSON extraction and validation
- **Error Handling**: Fallback questions if AI fails

### 2. Voice Interview Process
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   VAPI          │───►│   Voice         │───►│   Real-time     │
│   Initialization│    │   Connection    │    │   Processing    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Conversation  │───►│   Event         │───►│   State         │
│   Management    │    │   Handling      │    │   Management    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Data          │───►│   Conversation  │───►│   Session       │
│   Recording     │    │   Logging       │    │   Termination   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

**Technical Details**:
- **VAPI Setup**: Initialize VAPI.ai instance with configuration
- **Event Handling**: Manage call-start, speech-start, speech-end, call-end events
- **State Management**: Track interview progress and user states
- **Data Recording**: Log conversation data for analysis
- **Error Recovery**: Handle connection issues and timeouts

### 3. Feedback Generation Process
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Conversation  │───►│   Data          │───►│   AI Analysis   │
│   Data          │    │   Preprocessing │    │   Request       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   AI Response   │───►│   Feedback      │───►│   Rating        │
│   Processing    │    │   Parsing       │    │   Calculation   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Results       │───►│   Database      │───►│   Notification  │
│   Storage       │    │   Save          │    │   Generation    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

**Technical Details**:
- **Data Preprocessing**: Clean and format conversation data
- **AI Analysis**: Send to OpenAI for comprehensive evaluation
- **Rating Calculation**: Extract numerical ratings (1-10 scale)
- **Recommendation Generation**: Generate hire/no-hire recommendation
- **Results Storage**: Save structured feedback to database

---

## Business Logic

### 1. Interview Creation Rules
- **Job Position**: Required, max 255 characters
- **Job Description**: Required, detailed description
- **Duration**: Required, must be valid time format
- **Interview Type**: Must be selected from predefined list
- **Question Count**: Based on interview duration (5-15 questions)
- **Link Validity**: 30 days from creation date

### 2. Interview Execution Rules
- **Single Access**: Each candidate can access interview once
- **Voice Requirements**: Microphone access required
- **Time Limits**: Interview duration enforced
- **Question Flow**: Sequential question presentation
- **Completion Criteria**: All questions must be addressed

### 3. Feedback Generation Rules
- **Rating Scale**: 1-10 for all evaluation criteria
- **Evaluation Criteria**: Technical skills, communication, problem solving, experience
- **Recommendation**: Hire, Consider, or Do Not Hire
- **Confidence Score**: Based on conversation quality
- **Summary Length**: 3-line summary of interview

### 4. Security Rules
- **Authentication**: Google OAuth required for recruiters
- **Link Security**: Unique, non-guessable interview IDs
- **Data Privacy**: Candidate data encrypted and secured
- **Access Control**: Recruiters can only access their interviews
- **Session Management**: Secure JWT token handling

---

## Error Handling

### 1. Authentication Errors
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   OAuth Error   │───►│   Error         │───►│   User          │
│   Detection     │    │   Logging       │    │   Notification  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Retry         │───►│   Fallback      │───►│   Error Page    │
│   Mechanism     │    │   Authentication│    │   Display       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### 2. AI Service Errors
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   API Error     │───►│   Retry Logic   │───►│   Fallback      │
│   Detection     │    │                 │    │   Questions     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Error         │───►│   User          │───►│   Manual        │
│   Logging       │    │   Notification  │    │   Intervention  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### 3. Voice Connection Errors
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Connection    │───►│   Automatic     │───►│   Reconnection  │
│   Failure       │    │   Retry         │    │   Attempt       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Max Retries   │───►│   Error         │───►│   Interview     │
│   Exceeded      │    │   Notification  │    │   Termination   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

---

## Integration Workflows

### 1. Supabase Integration
- **Authentication**: User management and session handling
- **Database Operations**: CRUD operations for all entities
- **Real-time Updates**: Live data synchronization
- **File Storage**: Document and media storage

### 2. VAPI.ai Integration
- **Voice Setup**: Initialize voice assistant
- **Event Handling**: Manage voice conversation events
- **Data Streaming**: Real-time audio processing
- **Session Management**: Voice session lifecycle

### 3. OpenAI Integration
- **Question Generation**: Dynamic interview questions
- **Feedback Analysis**: Candidate evaluation
- **Prompt Engineering**: Structured AI interactions
- **Response Processing**: JSON parsing and validation

---

## Security Workflows

### 1. Authentication Flow
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   User Login    │───►│   Google OAuth  │───►│   Token         │
│   Request       │    │   Validation    │    │   Generation    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Session       │───►│   Access        │───►│   Resource      │
│   Creation      │    │   Control       │    │   Authorization │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### 2. Data Protection
- **Encryption**: All sensitive data encrypted at rest and in transit
- **Access Control**: Role-based access control (RBAC)
- **Audit Logging**: Complete audit trail of all operations
- **Data Retention**: Configurable data retention policies

---

## Performance Workflows

### 1. Caching Strategy
- **Static Assets**: CDN caching for images and static files
- **API Responses**: Redis caching for frequently accessed data
- **Database Queries**: Query result caching for performance
- **Session Data**: In-memory session storage

### 2. Load Balancing
- **Traffic Distribution**: Multiple server instances
- **Health Checks**: Automatic failover mechanisms
- **Scaling**: Auto-scaling based on demand
- **Monitoring**: Real-time performance monitoring

---

## Monitoring & Analytics

### 1. System Monitoring
- **Application Metrics**: Response times, error rates
- **Database Performance**: Query performance, connection pools
- **External Services**: API response times and availability
- **User Experience**: Page load times, interaction metrics

### 2. Business Analytics
- **Interview Metrics**: Completion rates, average duration
- **Candidate Analytics**: Performance trends, success rates
- **User Engagement**: Feature usage, user retention
- **Quality Metrics**: Feedback accuracy, AI performance

---

## Maintenance Workflows

### 1. Regular Maintenance
- **Database Optimization**: Index maintenance, query optimization
- **Security Updates**: Dependency updates, security patches
- **Performance Tuning**: Configuration optimization
- **Backup Management**: Automated backup and recovery

### 2. Incident Response
- **Issue Detection**: Automated monitoring and alerting
- **Escalation**: Tiered response system
- **Resolution**: Standardized troubleshooting procedures
- **Post-Incident**: Analysis and improvement planning

---

*This workflow documentation provides a comprehensive view of all system processes and should be updated as the platform evolves.*
