require('dotenv').config();
const nodemailer = require('nodemailer');

async function test() {
    console.log("Testing email with PORT 465 and SECURE=true...");
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: 465,
        secure: true,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    try {
        const info = await transporter.sendMail({
            from: '"Dovoc Test" <' + process.env.SMTP_USER + '>',
            to: process.env.SMTP_USER, // Send to self
            subject: "Test Email from Port 465",
            html: "<p>It works!</p>"
        });
        console.log("Message sent: %s", info.messageId);
    } catch (error) {
        console.error("Test failed:", error);
    }
}

test();
