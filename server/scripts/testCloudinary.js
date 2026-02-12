const cloudinary = require('../config/cloudinary');
require('dotenv').config({ path: '../.env' });

console.log("Checking Cloudinary Config...");
console.log("Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("API Key:", process.env.CLOUDINARY_API_KEY ? `Set (Length: ${process.env.CLOUDINARY_API_KEY.length})` : "Missing");
console.log("API Secret:", process.env.CLOUDINARY_API_SECRET ? `Set (Length: ${process.env.CLOUDINARY_API_SECRET.length})` : "Missing");

cloudinary.api.ping((error, result) => {
    if (error) {
        console.error("Cloudinary Connection Failed:", error);
    } else {
        console.log("Cloudinary Connection Successful:", result);
    }
});
