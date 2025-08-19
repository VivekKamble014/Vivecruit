import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';

// Load environment variables
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;

export async function POST(request) {
  try {
    console.log('📧 Interview invitation API called');
    
    const {
      candidateName,
      candidateEmail,
      subject,
      message,
      interviewLink,
      scheduledDate,
      scheduledTime,
      jobPosition
    } = await request.json();

    console.log('📋 Received data:', {
      candidateName,
      candidateEmail,
      subject,
      scheduledDate,
      scheduledTime,
      jobPosition
    });

    // Validate required fields
    if (!candidateName || !candidateEmail || !subject || !message) {
      console.error('❌ Missing required fields');
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(candidateEmail)) {
      console.error('❌ Invalid email format:', candidateEmail);
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Check environment variables
    if (!EMAIL_USER || !EMAIL_PASSWORD) {
      console.error('❌ Email credentials not configured');
      console.error('EMAIL_USER:', EMAIL_USER ? 'Set' : 'Not set');
      console.error('EMAIL_PASSWORD:', EMAIL_PASSWORD ? 'Set' : 'Not set');
      return NextResponse.json(
        { error: 'Email configuration missing. Please check EMAIL_USER and EMAIL_PASSWORD environment variables.' },
        { status: 500 }
      );
    }

    console.log('🔧 Creating email transporter...');

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASSWORD,
      },
    });

    // Verify transporter configuration
    try {
      console.log('🔍 Verifying email configuration...');
      await transporter.verify();
      console.log('✅ Email configuration verified successfully');
    } catch (verifyError) {
      console.error('❌ Email configuration verification failed:', verifyError);
      return NextResponse.json(
        { error: 'Email configuration verification failed. Please check your Gmail credentials.' },
        { status: 500 }
      );
    }

    // Format the scheduled date
    const formattedDate = new Date(scheduledDate).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    console.log('📅 Formatted date:', formattedDate);

    // Professional HTML email template
    const htmlTemplate = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Interview Invitation</title>
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
            padding-bottom: 20px;
            border-bottom: 2px solid #8b5cf6;
          }
          .logo {
            font-size: 28px;
            font-weight: bold;
            color: #8b5cf6;
            margin-bottom: 10px;
          }
          .subtitle {
            color: #6b7280;
            font-size: 16px;
          }
          .content {
            margin-bottom: 30px;
          }
          .greeting {
            font-size: 18px;
            margin-bottom: 20px;
            color: #1f2937;
          }
          .details {
            background-color: #f3f4f6;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #8b5cf6;
          }
          .detail-item {
            margin-bottom: 10px;
            display: flex;
            align-items: center;
          }
          .detail-label {
            font-weight: 600;
            color: #374151;
            min-width: 120px;
          }
          .detail-value {
            color: #6b7280;
          }
          .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
            color: white;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            margin: 20px 0;
            text-align: center;
            box-shadow: 0 4px 6px rgba(139, 92, 246, 0.3);
            transition: all 0.3s ease;
          }
          .cta-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 12px rgba(139, 92, 246, 0.4);
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            color: #6b7280;
            font-size: 14px;
          }
          .social-links {
            margin-top: 15px;
          }
          .social-links a {
            color: #8b5cf6;
            text-decoration: none;
            margin: 0 10px;
          }
          .important-note {
            background-color: #fef3c7;
            border: 1px solid #f59e0b;
            border-radius: 8px;
            padding: 15px;
            margin: 20px 0;
          }
          .important-note h4 {
            color: #92400e;
            margin: 0 0 10px 0;
            font-size: 16px;
          }
          .important-note p {
            color: #92400e;
            margin: 0;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">ViveCruit</div>
            <div class="subtitle">AI-Powered Interview Platform</div>
          </div>
          
          <div class="content">
            <div class="greeting">Dear ${candidateName},</div>
            
            <p>We are excited to invite you to participate in an AI-powered interview for the position of <strong>${jobPosition}</strong>.</p>
            
            <div class="details">
              <div class="detail-item">
                <span class="detail-label">Position:</span>
                <span class="detail-value">${jobPosition}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Date:</span>
                <span class="detail-value">${formattedDate}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Time:</span>
                <span class="detail-value">${scheduledTime}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Duration:</span>
                <span class="detail-value">30-45 minutes</span>
              </div>
            </div>
            
            <div class="important-note">
              <h4>📋 What to Expect:</h4>
              <p>• This is an AI-powered interview that will ask you relevant questions about your experience and skills</p>
              <p>• You'll need a quiet environment with a working microphone</p>
              <p>• The interview will be recorded for review purposes</p>
              <p>• You can take the interview at any time before the scheduled date</p>
            </div>
            
            <p>Please click the button below to start your interview when you're ready:</p>
            
            <div style="text-align: center;">
              <a href="${interviewLink}" class="cta-button">
                🎤 Start Your Interview
              </a>
            </div>
            
            <p style="font-size: 14px; color: #6b7280; text-align: center;">
              Or copy this link: <a href="${interviewLink}" style="color: #8b5cf6;">${interviewLink}</a>
            </p>
            
            <p>If you have any questions or need to reschedule, please don't hesitate to reach out to us.</p>
            
            <p>Best regards,<br>
            <strong>The ViveCruit Team</strong></p>
          </div>
          
          <div class="footer">
            <p>This email was sent from ViveCruit - AI-Powered Interview Platform</p>
            <div class="social-links">
              <a href="#">Website</a> |
              <a href="#">Support</a> |
              <a href="#">Privacy Policy</a>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    console.log('📧 Sending email...');

    // Send email
    const mailOptions = {
      from: `"ViveCruit" <${process.env.EMAIL_USER}>`,
      to: candidateEmail,
      subject: subject,
      html: htmlTemplate,
      text: message, // Plain text fallback
    };

    console.log('📨 Mail options:', {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject
    });

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', info.messageId);

    return NextResponse.json(
      { 
        message: 'Interview invitation sent successfully',
        messageId: info.messageId,
        to: candidateEmail
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('❌ Error in send-interview-invitation API:', error);
    
    // Handle specific nodemailer errors
    if (error.code === 'EAUTH') {
      return NextResponse.json(
        { error: 'Email authentication failed. Please check your Gmail credentials.' },
        { status: 500 }
      );
    }
    
    if (error.code === 'ECONNECTION') {
      return NextResponse.json(
        { error: 'Email connection failed. Please check your internet connection.' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: `Failed to send interview invitation: ${error.message}` },
      { status: 500 }
    );
  }
}

// Test endpoint
export async function GET() {
      return NextResponse.json(
      { 
        message: 'Interview invitation API is working',
        emailConfigured: !!(EMAIL_USER && EMAIL_PASSWORD),
        emailUser: EMAIL_USER ? 'Set' : 'Not set'
      },
      { status: 200 }
    );
}
