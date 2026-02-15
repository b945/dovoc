require('dotenv').config();
const { sendEmail } = require('./utils/emailService');

async function test() {
    console.log("----------------------------------------");
    console.log("Testing email service...");
    console.log("SMTP Config:", {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: process.env.SMTP_SECURE,
        user: process.env.SMTP_USER,
        passLength: process.env.SMTP_PASS ? process.env.SMTP_PASS.length : 0
    });

    try {
        await sendEmail(process.env.SMTP_USER, "Test Email", "<p>This is a test email.</p>");
        console.log("Test email command finished (check logs above for actual send status).");
    } catch (e) {
        console.error("Test failed with error:", JSON.stringify(e, null, 2));
        console.error(e);
    }
    console.log("----------------------------------------");
}

test();
