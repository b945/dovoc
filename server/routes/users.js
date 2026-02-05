const express = require('express');
const router = express.Router();
const { db } = require('../config/firebase');
const { logAction } = require('../utils/logger');

// Helper to check DB connection
const checkDb = (res) => {
    if (!db) {
        res.status(500).json({ message: "Database not connected" });
        return false;
    }
    return true;
};

// GET all users
router.get('/', async (req, res) => {
    if (!checkDb(res)) return;
    try {
        const snapshot = await db.collection('users').get();
        const users = snapshot.docs.map(doc => {
            const data = doc.data();
            delete data.password; // Safety
            return { id: doc.id, ...data };
        });
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching users" });
    }
});

// POST add new user
router.post('/', async (req, res) => {
    if (!checkDb(res)) return;
    const { username, password, role, name, email } = req.body;

    try {
        // Check existence
        const snapshot = await db.collection('users').where('username', '==', username).get();
        if (!snapshot.empty) {
            return res.status(400).json({ message: "Username already exists" });
        }

        const newUser = {
            username,
            password, // In production, hash this!
            role,
            name,
            email,
            createdAt: new Date().toISOString()
        };

        const docRef = await db.collection('users').add(newUser);

        logAction('CREATE_USER', 'Super Admin', `Created user: ${username} (${role})`);

        const { password: _, ...safeUser } = newUser;
        res.status(201).json({ id: docRef.id, ...safeUser });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error creating user" });
    }
});

// DELETE user
router.delete('/:id', async (req, res) => {
    if (!checkDb(res)) return;
    try {
        const { id } = req.params;
        const docRef = db.collection('users').doc(id);
        const doc = await docRef.get();

        if (!doc.exists) {
            return res.status(404).json({ message: "User not found" });
        }

        await docRef.delete();
        logAction('DELETE_USER', 'Super Admin', `Deleted user ID: ${id}`);
        res.json({ message: "User deleted" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error deleting user" });
    }
});

// PATCH change password
router.patch('/:id/password', async (req, res) => {
    if (!checkDb(res)) return;
    const { newPassword } = req.body;
    const { id } = req.params;

    try {
        const docRef = db.collection('users').doc(id);
        const doc = await docRef.get();

        if (!doc.exists) {
            return res.status(404).json({ message: "User not found" });
        }

        await docRef.update({ password: newPassword }); // Hash in production!
        res.json({ message: "Password updated successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error updating password" });
    }
});

module.exports = router;
