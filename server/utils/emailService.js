const nodemailer = require('nodemailer');

let transporter = null;

const initEmailService = async () => {
    if (transporter) return;

    if (process.env.SMTP_HOST) {
        // Real SMTP configuration
        transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
        console.log("Email Service: configured with provided SMTP settings.");
    } else {
        // Test Account (Ethereal)
        try {
            const testAccount = await nodemailer.createTestAccount();
            transporter = nodemailer.createTransport({
                host: "smtp.ethereal.email",
                port: 587,
                secure: false,
                auth: {
                    user: testAccount.user,
                    pass: testAccount.pass,
                },
            });
            console.log("Email Service: using Ethereal test account.");
            console.log(`Preview URL will be available in console.`);
        } catch (err) {
            console.error("Failed to create test account", err);
        }
    }
};

const sendEmail = async (to, subject, html) => {
    if (!transporter) await initEmailService();

    if (!transporter) {
        console.log("Email Service not available. Logging email instead:");
        console.log(`To: ${to}, Subject: ${subject}`);
        return;
    }

    try {
        const info = await transporter.sendMail({
            from: '"Dovoc Eco Life" <noreply@dovcc.com>',
            to: to,
            subject: subject,
            html: html,
        });

        console.log("Message sent: %s", info.messageId);
        // If using Ethereal, log the preview URL
        if (nodemailer.getTestMessageUrl(info)) {
            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        }
    } catch (error) {
        console.error("Error sending email:", error);
        // Fallback: Log the link so development can continue
        console.log("--------------- EMAIL FALLBACK ---------------");
        console.log(`To: ${to}`);
        console.log(`Subject: ${subject}`);
        console.log("Body:", html);
        console.log("----------------------------------------------");
    }
};

module.exports = { sendEmail };
