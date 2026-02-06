require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 5000;

// Middleware
// Log all requests (Moved to top)
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.use(express.json());

// Health Check
app.get('/', (req, res) => {
    res.status(200).send('API is running');
});

// Connect to Firebase
const { db } = require('./config/firebase');

// Ensure data directory exists (Legacy/Backup)
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
}

// Routes
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/users', require('./routes/users'));
app.use('/api/logs', require('./routes/logs'));
app.use('/api/newsletter', require('./routes/newsletter'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/contact', require('./routes/contact'));

// Seeding Logic
const seedDatabase = async () => {
    if (!db) return;
    try {
        const userSnap = await db.collection('users').limit(1).get();
        if (userSnap.empty) {
            console.log('Seeding default admin...');
            await db.collection('users').add({
                username: "dovoc",
                password: "dovoc@123",
                role: "super_admin",
                name: "Dovoc Admin",
                email: "admin@dovoc.com",
                createdAt: new Date().toISOString()
            });
            console.log('Default admin created.');
        }

        /*
        const productSnap = await db.collection('products').limit(1).get();
        if (productSnap.empty) {
            console.log('Seeding initial products...');
            const initialProducts = [
                {
                    id: 1,
                    name: "Lavender Bliss Soap",
                    category: "Personal Care",
                    price: 15.00,
                    image: "/assets/product-soap.png",
                    rating: 5,
                    organic: true,
                    handmade: true,
                    description: "A calming lavender soap handmade with organic ingredients."
                },
                {
                    id: 2,
                    name: "Bamboo Essentials Set",
                    category: "Personal Care",
                    price: 24.50,
                    image: "/assets/product-toothbrush.png",
                    rating: 4.8,
                    organic: true,
                    handmade: false,
                    description: "Biodegradable bamboo toothbrushes for the whole family."
                },
                {
                    id: 3,
                    name: "Organic Cotton Mesh Bag",
                    category: "Bags",
                    price: 12.00,
                    image: "/assets/product-bag.png",
                    rating: 4.9,
                    organic: true,
                    handmade: true,
                    description: "Reusable grocery bag made from 100% organic cotton."
                }
            ];

            const batch = db.batch();
            initialProducts.forEach(p => {
                const docRef = db.collection('products').doc(String(p.id));
                batch.set(docRef, p);
            });
            await batch.commit();
            console.log('Initial products created.');
        } 
        */
    } catch (e) {
        console.error("Seeding error:", e);
    }
};

// Check DB and Seed on startup
if (db) {
    // seedDatabase(); // logic exists but commented out
}

// Global Error Handler
app.use((err, req, res, next) => {
    console.error("Unhandled Error:", err);
    res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
});


// Export for Vercel
module.exports = app;

// Only listen if running directly (not required by Vercel)
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
        if (!db) {
            console.log("⚠️  WARNING: Firebase DB not connected. Check serviceAccountKey.json.");
        }
    });
}
