const express = require('express');
const router = express.Router();
const { db } = require('../config/firebase');
const { sendEmail } = require('../utils/emailService');

// Subscribe Route
router.post('/subscribe', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        const subscribersRef = db.collection('subscribers');
        const snapshot = await subscribersRef.where('email', '==', email).get();

        if (!snapshot.empty) {
            return res.status(409).json({ message: 'Email already subscribed' });
        }

        await subscribersRef.add({
            email,
            subscribedAt: new Date().toISOString()
        });

        // Send Notification to Admin
        const adminEmail = process.env.SMTP_USER || 'dovochandcrafts@gmail.com';
        const adminHtml = `
            <h3>New Newsletter Subscriber 🌟</h3>
            <p>A new user has just subscribed to the newsletter:</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
        `;
        await sendEmail(adminEmail, 'New Newsletter Subscriber 🌟', adminHtml);

        // Send Welcome Email to Subscriber
        const welcomeHtml = `
            <h3>Welcome to Dovoc Eco Life! 🌿</h3>
            <p>Thank you for subscribing! We're thrilled to have you with us.</p>
            <p>We'll keep you updated on our latest eco-friendly products, exclusive discounts, and when our next sale starts.</p>
            <p>Stay tuned!</p>
        `;
        await sendEmail(email, 'Welcome to Dovoc Eco Life! 🌿', welcomeHtml);

        res.status(201).json({ message: 'Successfully subscribed to newsletter' });
    } catch (error) {
        console.error("Error subscribing:", error);
        res.status(500).json({ message: "Failed to subscribe" });
    }
});

// Broadcast Route (For Discounts/News)
router.post('/broadcast', async (req, res) => {
    try {
        const { subject, message, discountCode } = req.body;

        // 1. Get all subscribers
        const snapshot = await db.collection('subscribers').get();
        if (snapshot.empty) {
            return res.status(200).json({ message: "No subscribers to send to." });
        }

        const subscribers = snapshot.docs.map(doc => doc.data().email);
        console.log(`Sending broadcast "${subject}" to ${subscribers.length} subscribers.`);

        // 2. Send emails via Nodemailer
        let successCount = 0;
        let failCount = 0;

        // Construct generic parts of the email
        const baseHtml = `
            <h3>Update from Dovoc Eco Life</h3>
            <p>${message.replace(/\n/g, '<br>')}</p>
            ${discountCode ? `<p><strong>Use Code: <span style="font-size: 1.2em; color: green;">${discountCode}</span></strong></p>` : ''}
            <hr>
            <small>You are receiving this email because you subscribed to our newsletter.</small>
        `;

        // Send sequentially to avoid overwhelming SMTP limits (or could use Promise.all for speed if limit allows)
        for (const email of subscribers) {
            try {
                await sendEmail(email, subject || "Update from Dovoc Eco Life", baseHtml);
                successCount++;
            } catch (err) {
                console.error(`Failed to send to ${email}:`, err);
                failCount++;
            }
        }

        res.json({ success: true, message: `Broadcast sent: ${successCount} success, ${failCount} failed.` });

    } catch (error) {
        console.error("Error broadcasting:", error);
        res.status(500).json({ message: "Failed to broadcast message" });
    }
});

module.exports = router;
