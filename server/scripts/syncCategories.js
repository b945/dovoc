const axios = require('axios');
require('dotenv').config({ path: '../.env' });

const syncCategories = async () => {
    // Categories found in client/src/data/products.js
    const targetCategories = [
        "Personal Care",
        "Bags",
        "Accessories"
    ];

    try {
        // First get existing
        const existingRes = await axios.get('http://localhost:5000/api/categories');
        const existingNames = existingRes.data.map(c => c.name);

        for (const cat of targetCategories) {
            if (!existingNames.includes(cat)) {
                console.log(`Adding category: ${cat}`);
                await axios.post('http://localhost:5000/api/categories', {
                    name: cat,
                    id: Date.now().toString() + Math.random().toString(36).substr(2, 5)
                });
            } else {
                console.log(`Category exists: ${cat}`);
            }
        }
        console.log("Category sync complete.");
    } catch (err) {
        console.error("Error syncing categories:", err.message);
    }
};

syncCategories();
