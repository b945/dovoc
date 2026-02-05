const express = require('express');
const router = express.Router();
const { db } = require('../config/firebase');

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!db) {
        return res.status(500).json({ success: false, message: "Database not connected" });
    }

    try {
        const snapshot = await db.collection('users')
            .where('username', '==', username)
            .where('password', '==', password) // In production, hash check!
            .get();

        if (!snapshot.empty) {
            const doc = snapshot.docs[0];
            const user = doc.data();

            const { logAction } = require('../utils/logger');
            logAction('LOGIN', user.username, 'Admin logged in successfully');

            // Return token and user info (role, name)
            res.json({
                success: true,
                token: "mock-jwt-token-" + doc.id,
                user: {
                    id: doc.id,
                    username: user.username,
                    role: user.role,
                    name: user.name
                }
            });
        } else {
            res.status(401).json({ success: false, message: "Invalid credentials" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

module.exports = router;
