const axios = require('axios');

async function triggerReset() {
    try {
        console.log("Registering test user...");
        try {
            await axios.post('http://localhost:5000/api/auth/register', {
                name: "Test User",
                email: "test_reset@example.com",
                password: "password123"
            });
        } catch (e) {
            console.log("User might already exist, continuing...");
        }

        console.log("Requesting password reset...");
        const res = await axios.post('http://localhost:5000/api/auth/forgot-password', {
            email: "test_reset@example.com"
        });
        console.log("Response:", res.data);
    } catch (err) {
        console.error("Error:", err.message);
        if (err.response) console.error(err.response.data);
    }
}

triggerReset();
