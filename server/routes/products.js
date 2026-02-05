const express = require('express');
const router = express.Router();
const axios = require('axios');
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

// Get all products
router.get('/', async (req, res) => {
    if (!checkDb(res)) return;
    try {
        const snapshot = await db.collection('products').get();
        const products = snapshot.docs.map(doc => doc.data());
        res.json(products);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error reading products data" });
    }
});

// Create new product
router.post('/', async (req, res) => {
    if (!checkDb(res)) return;
    try {
        const newProduct = req.body;
        // Ensure ID
        if (!newProduct.id) newProduct.id = Date.now();

        // Use ID as document key for easy lookup
        await db.collection('products').doc(String(newProduct.id)).set(newProduct);

        logAction('CREATE_PRODUCT', 'Admin', `Created product: ${newProduct.name}`);

        // Notify Subscribers
        try {
            const subscribersSnapshot = await db.collection('subscribers').get();
            if (!subscribersSnapshot.empty) {
                const subscribers = subscribersSnapshot.docs.map(doc => doc.data().email);
                console.log(`Notifying ${subscribers.length} subscribers about new product: ${newProduct.name}`);

                const emailPromises = subscribers.map(email => {
                    const templateParams = {
                        service_id: process.env.EMAILJS_SERVICE_ID,
                        template_id: process.env.EMAILJS_TEMPLATE_ID,
                        user_id: process.env.EMAILJS_PUBLIC_KEY,
                        accessToken: process.env.EMAILJS_PRIVATE_KEY,
                        template_params: {
                            to_email: email,
                            subject: `New Arrival: ${newProduct.name} 🌿`,
                            message: `We're excited to announce a new addition to our collection! Check out the ${newProduct.name}.`,
                            product_name: newProduct.name,
                            product_price: newProduct.price,
                            product_link: `http://localhost:5173/product/${newProduct.id}`,
                            admin_email: 'dovochandcrafts@gmail.com'
                        }
                    };
                    return axios.post('https://api.emailjs.com/api/v1.0/email/send', templateParams);
                });

                // Don't await strictly to avoid blocking response
                Promise.allSettled(emailPromises).then(results => {
                    console.log("Product notification emails sent.");
                });
            }
        } catch (emailErr) {
            console.error("Error sending product notifications:", emailErr);
        }

        res.status(201).json(newProduct);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error creating product" });
    }
});

// Update product
router.put('/:id', async (req, res) => {
    if (!checkDb(res)) return;
    try {
        const { id } = req.params;
        const docRef = db.collection('products').doc(String(id));
        const doc = await docRef.get();

        if (!doc.exists) {
            return res.status(404).json({ message: "Product not found" });
        }

        await docRef.update(req.body);
        const updatedDoc = await docRef.get();
        res.json(updatedDoc.data());
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error updating product" });
    }
});

// Delete product
router.delete('/:id', async (req, res) => {
    if (!checkDb(res)) return;
    try {
        const { id } = req.params;
        const docRef = db.collection('products').doc(String(id));
        const doc = await docRef.get();

        if (!doc.exists) {
            return res.status(404).json({ message: "Product not found" });
        }

        await docRef.delete();

        logAction('DELETE_PRODUCT', 'Admin', `Deleted product ID: ${id}`);
        res.json({ message: "Product deleted" });
    } catch (err) {
        console.error("Error deleting product:", err);
        res.status(500).json({ message: "Error deleting product" });
    }
});

module.exports = router;
