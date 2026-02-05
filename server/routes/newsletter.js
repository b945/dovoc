const express = require('express');
const router = express.Router();
const { db } = require('../config/firebase');
const axios = require('axios');

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

        // 2. Send emails via EmailJS (Iterating intentionally to support individual addressing if needed later)
        // Note: For production with many users, batching or a dedicated email service is better.
        const emailPromises = subscribers.map(email => {
            const templateParams = {
                service_id: process.env.EMAILJS_SERVICE_ID,
                template_id: process.env.EMAILJS_TEMPLATE_ID,
                user_id: process.env.EMAILJS_PUBLIC_KEY,
                accessToken: process.env.EMAILJS_PRIVATE_KEY,
                template_params: {
                    to_email: email,
                    subject: subject || "Update from Dovoc Eco Life",
                    message: message,
                    discount_code: discountCode || "",
                    admin_email: 'dovochandcrafts@gmail.com'
                }
            };
            return axios.post('https://api.emailjs.com/api/v1.0/email/send', templateParams);
        });

        await Promise.allSettled(emailPromises);

        res.json({ success: true, message: `Broadcast sent to ${subscribers.length} subscribers.` });

    } catch (error) {
        console.error("Error broadcasting:", error);
        res.status(500).json({ message: "Failed to broadcast message" });
    }
});

module.exports = router;
