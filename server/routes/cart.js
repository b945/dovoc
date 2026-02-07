const express = require('express');
const router = express.Router();
const { db } = require('../config/firebase');

// Helper to check DB connection
const checkDb = (res) => {
    if (!db) {
        res.status(500).json({ message: "Database not connected" });
        return false;
    }
    return true;
};

// GET /:userId - Get cart for user
router.get('/:userId', async (req, res) => {
    if (!checkDb(res)) return;
    try {
        const { userId } = req.params;
        const docRef = db.collection('carts').doc(String(userId));
        const doc = await docRef.get();

        if (!doc.exists) {
            return res.json({ items: [] });
        }

        res.json(doc.data());
    } catch (err) {
        console.error("Error fetching cart:", err);
        res.status(500).json({ message: "Error fetching cart" });
    }
});

// POST /:userId - Update cart for user
router.post('/:userId', async (req, res) => {
    if (!checkDb(res)) return;
    try {
        const { userId } = req.params;
        const { items } = req.body; // Array of cart items

        if (!Array.isArray(items)) {
            return res.status(400).json({ message: "Items must be an array" });
        }

        const docRef = db.collection('carts').doc(String(userId));
        await docRef.set({
            items,
            updatedAt: new Date().toISOString()
        });

        res.json({ message: "Cart updated", items });
    } catch (err) {
        console.error("Error updating cart:", err);
        res.status(500).json({ message: "Error updating cart" });
    }
});

module.exports = router;
