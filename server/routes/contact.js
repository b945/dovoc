const express = require('express');
const router = express.Router();
const { db } = require('../config/firebase');

// POST /api/contact
router.post('/', async (req, res) => {
    try {
        const { firstName, lastName, email, message } = req.body;

        if (!firstName || !email || !message) {
            return res.status(400).json({ message: "Please fill in all required fields." });
        }

        const newMessage = {
            firstName,
            lastName: lastName || '',
            email,
            message,
            createdAt: new Date().toISOString(),
            status: 'NEW' // NEW, READ, REPLIED
        };

        const docRef = await db.collection('messages').add(newMessage);

        res.status(201).json({
            success: true,
            message: "Message sent successfully!",
            id: docRef.id
        });

    } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({
            success: false,
            message: "Failed to send message. Please try again later."
        });
    }
});

module.exports = router;
