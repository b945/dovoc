require('dotenv').config({ path: '../.env' });
const { sendEmail } = require('../utils/emailService');

const testEmail = async () => {
    console.log('Testing email service...');
    console.log('SMTP Config:', {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        user: process.env.SMTP_USER,
        secure: process.env.SMTP_SECURE
    });

    if (!process.env.SMTP_USER || process.env.SMTP_USER.includes('your-email')) {
        console.error('ERROR: SMTP_USER is not configured in .env');
        console.log('Please update server/.env with your Gmail address and App Password.');
        return;
    }

    try {
        await sendEmail(
            process.env.SMTP_USER, // Send to self
            'SMTP Configuration Test',
            '<h1>It Works!</h1><p>Your SMTP configuration for Dovoc Eco Life is working correctly.</p>'
        );
        console.log('Test email sent successfully! Check your inbox.');
    } catch (error) {
        console.error('Failed to send test email:', error);
    }
};

testEmail();
