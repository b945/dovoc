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

        // Send Notification to Admin
        try {
            await axios.post('https://api.emailjs.com/api/v1.0/email/send', {
                service_id: process.env.EMAILJS_SERVICE_ID,
                template_id: process.env.EMAILJS_TEMPLATE_ID,
                user_id: process.env.EMAILJS_PUBLIC_KEY,
                accessToken: process.env.EMAILJS_PRIVATE_KEY,
                template_params: {
                    to_email: 'dovochandcrafts@gmail.com',
                    subject: 'New Newsletter Subscriber 🌟',
                    message: `A new user has just subscribed to the newsletter:\n\nEmail: ${email}\n\nDate: ${new Date().toLocaleString()}`,
                    admin_email: 'dovochandcrafts@gmail.com'
                }
            });
            console.log(`Admin notification sent for new subscriber: ${email}`);
        } catch (emailError) {
            console.error("Failed to send admin notification:", emailError.message);
        }

        // Send Welcome Email to Subscriber
        try {
            await axios.post('https://api.emailjs.com/api/v1.0/email/send', {
                service_id: process.env.EMAILJS_SERVICE_ID,
                template_id: process.env.EMAILJS_TEMPLATE_ID,
                user_id: process.env.EMAILJS_PUBLIC_KEY,
                accessToken: process.env.EMAILJS_PRIVATE_KEY,
                template_params: {
                    to_email: email,
                    subject: 'Welcome to Dovoc Eco Life! 🌿',
                    message: "Thank you for subscribing! We're thrilled to have you with us.\n\nWe'll keep you updated on our latest eco-friendly products, exclusive discounts, and when our next sale starts.\n\nStay tuned!",
                    admin_email: 'dovochandcrafts@gmail.com'
                }
            });
            console.log(`Welcome email sent to subscriber: ${email}`);
        } catch (welcomeError) {
            console.error("Failed to send welcome email:", welcomeError.message);
        }

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

        const results = await Promise.allSettled(emailPromises);
        const successful = results.filter(r => r.status === 'fulfilled').length;
        const failed = results.filter(r => r.status === 'rejected');

        if (failed.length > 0) {
            console.error("Some emails failed to send:");
            failed.forEach(f => console.error(" - Reason:", f.reason.response ? f.reason.response.data : f.reason.message));
        }

        res.json({ success: true, message: `Broadcast sent: ${successful} success, ${failed.length} failed.` });

    } catch (error) {
        console.error("Error broadcasting:", error);
        res.status(500).json({ message: "Failed to broadcast message" });
    }
});

module.exports = router;
