const axios = require('axios');
require('dotenv').config({ path: '../.env' });

const testFetch = async () => {
    try {
        const url = 'http://localhost:5000/api/categories';
        console.log(`Fetching from ${url}...`);
        const res = await axios.get(url);
        console.log("Categories:", JSON.stringify(res.data, null, 2));
    } catch (err) {
        console.error("Error:", err.message);
    }
};

testFetch();
