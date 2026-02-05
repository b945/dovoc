const express = require('express');
const router = express.Router();
const multer = require('multer');
const { bucket } = require('../config/firebase');

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

        if (!bucket) {
            return res.status(500).json({ message: "Storage bucket not configured" });
        }

        // Create a unique filename
        const filename = `products/${Date.now()}_${req.file.originalname}`;
        const file = bucket.file(filename);

        // Prepare stream
        const stream = file.createWriteStream({
            metadata: {
                contentType: req.file.mimetype
            }
        });

        stream.on('error', (err) => {
            console.error(err);
            res.status(500).json({ message: "Upload failed" });
        });

        stream.on('finish', async () => {
            // Make public
            await file.makePublic();

            // Get Public URL
            // Format: https://storage.googleapis.com/BUCKET_NAME/FILE_PATH
            const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`;

            res.json({
                message: "Upload successful",
                url: publicUrl
            });
        });

        stream.end(req.file.buffer);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error during upload" });
    }
});

module.exports = router;
