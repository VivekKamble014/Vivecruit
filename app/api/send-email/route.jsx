import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { candidateName, candidateEmail, jobPosition, interviewId } = await request.json();

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // Your Gmail address
        pass: process.env.EMAIL_PASSWORD // Your Gmail app password
      }
    });

    
    // Email template
    const mailOptions = {
      from: `"Vivecruit" <${process.env.EMAIL_USER}>`,
      to: candidateEmail,
      subject: `Interview Completed Successfully - ${jobPosition} Position`,
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Interview Completed - Vivecruit</title>
            <style>
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: #f8f9fa;
                }
                .container {
                    background-color: #ffffff;
                    border-radius: 10px;
                    padding: 40px;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                }
                .header {
                    text-align: center;
                    margin-bottom: 30px;
                }
                .logo {
                    width: 60px;
                    height: 60px;
                    margin-bottom: 20px;
                }
                .title {
                    color: #6b46c1;
                    font-size: 28px;
                    font-weight: bold;
                    margin-bottom: 10px;
                }
                .success-icon {
                    font-size: 48px;
                    margin-bottom: 20px;
                }
                .subtitle {
                    color: #666;
                    font-size: 16px;
                    margin-bottom: 30px;
                }
                .content {
                    margin-bottom: 30px;
                }
                .greeting {
                    font-size: 18px;
                    margin-bottom: 20px;
                    color: #333;
                }
                .message {
                    font-size: 16px;
                    margin-bottom: 20px;
                    color: #555;
                }
                .highlight-box {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 25px;
                    border-radius: 8px;
                    margin: 25px 0;
                    text-align: center;
                }
                .next-steps {
                    background-color: #f8f9fa;
                    padding: 25px;
                    border-radius: 8px;
                    margin: 25px 0;
                    border-left: 4px solid #6b46c1;
                }
                .step {
                    margin-bottom: 15px;
                    display: flex;
                    align-items: flex-start;
                }
                .step-number {
                    background-color: #6b46c1;
                    color: white;
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 12px;
                    font-weight: bold;
                    margin-right: 15px;
                    flex-shrink: 0;
                }
                .contact-info {
                    background-color: #e8f4fd;
                    padding: 20px;
                    border-radius: 8px;
                    margin: 25px 0;
                    border-left: 4px solid #2196f3;
                }
                .contact-item {
                    display: flex;
                    align-items: center;
                    margin-bottom: 10px;
                }
                .contact-icon {
                    width: 20px;
                    margin-right: 10px;
                    color: #2196f3;
                }
                .footer {
                    text-align: center;
                    margin-top: 30px;
                    padding-top: 20px;
                    border-top: 1px solid #eee;
                    color: #666;
                    font-size: 14px;
                }
                .social-links {
                    margin-top: 15px;
                }
                .social-links a {
                    color: #6b46c1;
                    text-decoration: none;
                    margin: 0 10px;
                }
                .social-links a:hover {
                    text-decoration: underline;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <div class="success-icon">🎉</div>
                    <div class="title">Interview Completed Successfully!</div>
                    <div class="subtitle">Thank you for your time and effort</div>
                </div>

                <div class="content">
                    <div class="greeting">Dear ${candidateName},</div>
                    
                    <div class="message">
                        We are pleased to confirm that you have successfully completed your interview for the <strong>${jobPosition}</strong> position with Vivecruit. Your participation and professionalism throughout the interview process have been greatly appreciated.
                    </div>

                    <div class="highlight-box">
                        <h3 style="margin: 0 0 10px 0;">🎉 Interview Status: Completed</h3>
                        <p style="margin: 0; opacity: 0.9;">Your interview has been recorded and is now being processed by our AI system.</p>
                    </div>

                    <div class="message">
                        Our advanced AI system is currently analyzing your responses, evaluating your technical skills, communication abilities, and overall fit for the position. This comprehensive analysis will be reviewed by our recruitment team to make an informed decision.
                    </div>

                    <div class="next-steps">
                        <h3 style="margin: 0 0 20px 0; color: #6b46c1;">What Happens Next?</h3>
                        
                        <div class="step">
                            <div class="step-number">1</div>
                            <div>
                                <strong>AI Analysis (24-48 hours)</strong><br>
                                Our AI system will analyze your interview responses and generate detailed feedback.
                            </div>
                        </div>
                        
                        <div class="step">
                            <div class="step-number">2</div>
                            <div>
                                <strong>Human Review (2-3 days)</strong><br>
                                Our recruitment team will review the AI feedback and your overall performance.
                            </div>
                        </div>
                        
                        <div class="step">
                            <div class="step-number">3</div>
                            <div>
                                <strong>Final Decision (3-5 business days)</strong><br>
                                You will receive a comprehensive response with next steps in the hiring process.
                            </div>
                        </div>
                    </div>

                    <div class="contact-info">
                        <h3 style="margin: 0 0 15px 0; color: #2196f3;">Need to Contact Us?</h3>
                        
                        <div class="contact-item">
                            <span class="contact-icon">📧</span>
                            <strong>Email:</strong> support@vivecruit.com
                        </div>
                        
                        <div class="contact-item">
                            <span class="contact-icon">📞</span>
                            <strong>Phone:</strong> +1 (555) 123-4567
                        </div>
                        
                        <div class="contact-item">
                            <span class="contact-icon">🌐</span>
                            <strong>Website:</strong> www.vivecruit.com
                        </div>
                        
                        <div class="contact-item">
                            <span class="contact-icon">💼</span>
                            <strong>LinkedIn:</strong> @vivecruit
                        </div>
                    </div>

                    <div class="message">
                        <strong>Interview Reference ID:</strong> ${interviewId}<br>
                        Please keep this reference ID for any future communications regarding your application.
                    </div>
                </div>

                <div class="footer">
                    <p>Thank you for choosing Vivecruit for your career journey!</p>
                    <p>We appreciate your time and effort in completing this interview.</p>
                    
                    <div class="social-links">
                        <a href="https://linkedin.com/company/vivecruit">LinkedIn</a> |
                        <a href="https://twitter.com/vivecruit">Twitter</a> |
                        <a href="https://vivecruit.com">Website</a>
                    </div>
                    
                    <p style="margin-top: 20px; font-size: 12px; color: #999;">
                        © 2024 Vivecruit. All rights reserved.<br>
                        This email was sent to ${candidateEmail}
                    </p>
                </div>
            </div>
        </body>
        </html>
      `
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    
    console.log('Email sent successfully:', info.messageId);
    
    return NextResponse.json({ 
      success: true, 
      messageId: info.messageId,
      message: 'Interview completion email sent successfully' 
    });

  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to send email',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
