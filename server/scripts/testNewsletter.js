const axios = require('axios');

const testSubscription = async () => {
    try {
        console.log("Testing Newsletter Subscription...");
        const response = await axios.post('http://127.0.0.1:5000/api/newsletter/subscribe', {
            email: 'test_subscriber_' + Date.now() + '@example.com'
        });
        console.log("Success:", response.data);
    } catch (error) {
        console.error("Full Error:", error);
    }
};

testSubscription();
