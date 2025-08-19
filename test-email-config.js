// Test email configuration
require('dotenv').config({ path: '.env.local' });

console.log('📧 Testing Email Configuration...');
console.log('EMAIL_USER:', process.env.EMAIL_USER ? '✅ Set' : '❌ Not set');
console.log('EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? '✅ Set' : '❌ Not set');

if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
  console.log('✅ Email configuration looks good!');
  console.log('📧 Email will be sent from:', process.env.EMAIL_USER);
} else {
  console.log('❌ Email configuration is missing!');
  console.log('📝 Please check your .env.local file contains:');
  console.log('EMAIL_USER=your-email@gmail.com');
  console.log('EMAIL_PASSWORD=your-app-password');
}
