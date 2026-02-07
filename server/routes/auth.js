const express = require('express');
const router = express.Router();
const { db } = require('../config/firebase');
const { logAction } = require('../utils/logger');

// Helper to check DB
const checkDb = (res) => {
    if (!db) {
        res.status(500).json({ message: "Database not connected" });
        return false;
    }
    return true;
};

// POST /register
router.post('/register', async (req, res) => {
    if (!checkDb(res)) return;
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        // Check if user exists
        const snapshot = await db.collection('users').where('email', '==', email).get();
        if (!snapshot.empty) {
            return res.status(400).json({ message: "Email already registered" });
        }

        // Create new user
        // Note: Password should be hashed in production!
        const newUser = {
            name,
            email,
            password,
            role: 'customer',
            createdAt: new Date().toISOString()
        };

        const docRef = await db.collection('users').add(newUser);

        // Return user info without password
        const { password: _, ...userProto } = newUser;
        res.status(201).json({ id: docRef.id, ...userProto });

        logAction('REGISTER_CUSTOMER', 'System', `New customer registered: ${email}`);

    } catch (err) {
        console.error("Registration Error:", err);
        res.status(500).json({ message: "Registration failed" });
    }
});

// POST /login
router.post('/login', async (req, res) => {
    if (!checkDb(res)) return;
    const { email, password } = req.body;

    try {
        const snapshot = await db.collection('users').where('email', '==', email).get();

        if (snapshot.empty) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const doc = snapshot.docs[0];
        const userData = doc.data();

        // Simple password check (should be bcrypt compare in prod)
        if (userData.password !== password) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Return user info
        const { password: _, ...userProto } = userData;
        res.json({ id: doc.id, ...userProto });

        logAction('LOGIN_CUSTOMER', 'System', `Customer logged in: ${email}`);
    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ message: "Login failed" });
    }
});

const crypto = require('crypto');
const { sendEmail } = require('../utils/emailService');

// POST /forgot-password
router.post('/forgot-password', async (req, res) => {
    if (!checkDb(res)) return;
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }

    try {
        const snapshot = await db.collection('users').where('email', '==', email).get();
        if (snapshot.empty) {
            // Security: Don't reveal if user exists
            return res.json({ message: "If an account exists, a reset link has been sent." });
        }

        const doc = snapshot.docs[0];
        const token = crypto.randomBytes(20).toString('hex');
        const expires = Date.now() + 3600000; // 1 hour

        await db.collection('users').doc(doc.id).update({
            resetPasswordToken: token,
            resetPasswordExpires: expires
        });

        // Construct Reset Link
        // Assuming client runs on port 5173 or inferred from referer/origin if needed, 
        // but hardcoding or using env is better. 
        // For this env: http://localhost:5173
        const resetLink = `http://localhost:5173/reset-password?token=${token}&email=${email}`;

        const html = `
            <h3>Password Reset Request</h3>
            <p>You requested a password reset. Click the link below to set a new password:</p>
            <a href="${resetLink}">Reset Password</a>
            <p>This link expires in 1 hour.</p>
        `;

        await sendEmail(email, "Password Reset - Dovoc Eco Life", html);

        logAction('FORGOT_PASSWORD_REQUEST', 'System', `Reset requested for ${email}`);
        res.json({ message: "If an account exists, a reset link has been sent." });

    } catch (err) {
        console.error("Forgot Password Error:", err);
        res.status(500).json({ message: "Error processing request" });
    }
});

// POST /reset-password
router.post('/reset-password', async (req, res) => {
    if (!checkDb(res)) return;
    const { token, email, newPassword } = req.body;

    if (!token || !email || !newPassword) {
        return res.status(400).json({ message: "Invalid request data" });
    }

    try {
        const snapshot = await db.collection('users')
            .where('email', '==', email)
            .where('resetPasswordToken', '==', token)
            .get();

        if (snapshot.empty) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        const doc = snapshot.docs[0];
        const userData = doc.data();

        if (userData.resetPasswordExpires < Date.now()) {
            return res.status(400).json({ message: "Token has expired" });
        }

        // Update Password and Clear Token
        await db.collection('users').doc(doc.id).update({
            password: newPassword, // Hash in production!
            resetPasswordToken: null,
            resetPasswordExpires: null
        });

        logAction('PASSWORD_RESET_SUCCESS', 'System', `Password reset for ${email}`);
        res.json({ message: "Password updated successfully" });

    } catch (err) {
        console.error("Reset Password Error:", err);
        res.status(500).json({ message: "Error resetting password" });
    }
});

module.exports = router;
