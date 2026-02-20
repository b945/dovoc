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

// Get all categories
router.get('/', async (req, res) => {
    if (!checkDb(res)) return;
    try {
        const snapshot = await db.collection('categories').get();
        if (snapshot.empty) {
            return res.json([]);
        }
        const categories = snapshot.docs.map(doc => doc.data());
        res.json(categories);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error reading categories" });
    }
});

// Create new category
router.post('/', async (req, res) => {
    if (!checkDb(res)) return;
    try {
        const newCategory = req.body;
        // Ensure ID
        if (!newCategory.id) newCategory.id = Date.now().toString();

        await db.collection('categories').doc(String(newCategory.id)).set(newCategory);

        logAction('CREATE_CATEGORY', 'Admin', `Created category: ${newCategory.name}`);
        res.status(201).json(newCategory);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error creating category" });
    }
});

// Delete category
router.delete('/:id', async (req, res) => {
    if (!checkDb(res)) return;
    try {
        const { id } = req.params;
        const docRef = db.collection('categories').doc(String(id));
        const doc = await docRef.get();

        if (!doc.exists) {
            return res.status(404).json({ message: "Category not found" });
        }

        await docRef.delete();

        logAction('DELETE_CATEGORY', 'Admin', `Deleted category ID: ${id}`);
        res.json({ message: "Category deleted" });
    } catch (err) {
        console.error("Error deleting category:", err);
        res.status(500).json({ message: "Error deleting category" });
    }
});

module.exports = router;
