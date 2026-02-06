const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('../config/cloudinary');

// Configure Multer (Memory Storage)
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// POST /api/upload
router.post('/', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        // Upload to Cloudinary via stream
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: "dovoc-products", // Optional folder
            },
            (error, result) => {
                if (error) {
                    console.error("Cloudinary Upload Error:", error);
                    return res.status(500).json({ message: "Upload failed", error: error.message });
                }
                res.json({
                    message: "Upload successful",
                    url: result.secure_url,
                    public_id: result.public_id
                });
            }
        );

        stream.end(req.file.buffer);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error during upload" });
    }
});

module.exports = router;
