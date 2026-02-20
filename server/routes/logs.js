const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const logsFile = path.join(__dirname, '../data/security_logs.json');

// Get all logs
router.get('/', (req, res) => {
    try {
        if (!fs.existsSync(logsFile)) {
            return res.json([]);
        }
        const data = fs.readFileSync(logsFile, 'utf8');
        res.json(JSON.parse(data).reverse()); // Newest first
    } catch (err) {
        res.status(500).json({ message: "Error reading logs" });
    }
});

module.exports = router;
