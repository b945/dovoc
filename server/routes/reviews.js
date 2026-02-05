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

// GET /product/:productId - Get reviews for a product
router.get('/product/:productId', async (req, res) => {
    if (!checkDb(res)) return;
    try {
        const productId = req.params.productId;
        // Firestore filtering
        const snapshot = await db.collection('reviews').where('productId', '==', parseInt(productId)).get();
        // Fallback if productId is string in DB?
        // Let's assume consistent types. If Mongoose saved numbers, Firestore might want numbers if we didn't force string.
        // But query parameters are strings.

        // Actually, if we just migrated, we start fresh. New post will send number or string based on frontend.
        // Frontend sends JSON numbers.

        let reviews = snapshot.docs.map(doc => doc.data());

        // If empty, try string comparison just in case (robustness)
        if (reviews.length === 0) {
            const snapshotStr = await db.collection('reviews').where('productId', '==', String(productId)).get();
            if (!snapshotStr.empty) {
                reviews = snapshotStr.docs.map(doc => doc.data());
            }
        }

        res.json(reviews);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching reviews" });
    }
});

// GET /featured - Get featured reviews for Home page
router.get('/featured', async (req, res) => {
    if (!checkDb(res)) return;
    try {
        const snapshot = await db.collection('reviews').where('isFeatured', '==', true).get();
        const featured = snapshot.docs.map(doc => doc.data());
        res.json(featured);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching featured reviews" });
    }
});

// GET /all - Get all reviews (Admin)
router.get('/all', async (req, res) => {
    if (!checkDb(res)) return;
    try {
        const snapshot = await db.collection('reviews').orderBy('date', 'desc').get();
        // Again, if index missing, might fail. Fallback to unsorted get().
        // For dev velocity, I'll allow fail/catch or just simple get if problematic.
        // But let's try get() then sort in JS for safety.
        // const snapshot = await db.collection('reviews').get();
        const reviews = snapshot.docs.map(doc => doc.data());
        res.json(reviews);
    } catch (err) {
        // Retry without order
        try {
            const snapshot = await db.collection('reviews').get();
            const reviews = snapshot.docs.map(doc => doc.data());
            res.json(reviews);
        } catch (e) {
            console.error(e);
            res.status(500).json({ message: "Error fetching all reviews" });
        }
    }
});

// POST / - Create a new review
router.post('/', async (req, res) => {
    if (!checkDb(res)) return;
    const { productId, customerName, rating, comment } = req.body;
    if (!productId || !customerName || !rating || !comment) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const newReview = {
            id: Date.now(),
            productId: parseInt(productId), // Store as number to match product ID type usually
            customerName,
            rating: Number(rating),
            comment,
            isFeatured: false,
            date: new Date().toISOString()
        };

        await db.collection('reviews').doc(String(newReview.id)).set(newReview);
        res.status(201).json(newReview);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error creating review" });
    }
});

// PATCH /:id/feature - Toggle featured status (Admin)
router.patch('/:id/feature', async (req, res) => {
    if (!checkDb(res)) return;
    try {
        const docRef = db.collection('reviews').doc(String(req.params.id));
        const doc = await docRef.get();

        if (!doc.exists) {
            return res.status(404).json({ message: "Review not found" });
        }

        const review = doc.data();
        const newStatus = !review.isFeatured;

        await docRef.update({ isFeatured: newStatus });

        res.json({ ...review, isFeatured: newStatus });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error updating review" });
    }
});

module.exports = router;
