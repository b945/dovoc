const axios = require('axios');
require('dotenv').config({ path: '../.env' });

const seedCategories = async () => {
    const categories = [
        "Skincare",
        "Haircare",
        "Body Care",
        "Home Care",
        "Fragrance"
    ];

    try {
        // First get existing
        const existingRes = await axios.get('http://localhost:5000/api/categories');
        const existingNames = existingRes.data.map(c => c.name);

        for (const cat of categories) {
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
        console.log("Category seeding complete.");
    } catch (err) {
        console.error("Error seeding categories:", err.message);
    }
};

seedCategories();
