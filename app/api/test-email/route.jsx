import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Check if environment variables are set
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Email configuration missing',
          message: 'Please set EMAIL_USER and EMAIL_PASSWORD in your .env.local file'
        },
        { status: 400 }
      );
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    // Test email
    const mailOptions = {
      from: `"Vivecruit Test" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // Send to yourself for testing
      subject: 'Vivecruit Email Test - Interview System',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                .container { max-width: 600px; margin: 0 auto; }
                .header { background: #6b46c1; color: white; padding: 20px; text-align: center; }
                .content { padding: 20px; background: #f8f9fa; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🎉 Email Test Successful!</h1>
                </div>
                <div class="content">
                    <h2>Vivecruit Interview System</h2>
                    <p>This is a test email to verify that your email configuration is working properly.</p>
                    <p><strong>Status:</strong> ✅ Email system is configured and working!</p>
                    <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
                    <hr>
                    <p><em>You can now delete this test endpoint once you confirm emails are working.</em></p>
                </div>
            </div>
        </body>
        </html>
      `
    };

    // Send test email
    const info = await transporter.sendMail(mailOptions);
    
    return NextResponse.json({ 
      success: true, 
      messageId: info.messageId,
      message: 'Test email sent successfully! Check your inbox.',
      config: {
        emailUser: process.env.EMAIL_USER,
        hasPassword: !!process.env.EMAIL_PASSWORD
      }
    });

  } catch (error) {
    console.error('Error sending test email:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to send test email',
        details: error.message,
        config: {
          emailUser: process.env.EMAIL_USER,
          hasPassword: !!process.env.EMAIL_PASSWORD
        }
      },
      { status: 500 }
    );
  }
}
