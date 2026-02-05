const fs = require('fs');
const path = require('path');

const logsFile = path.join(__dirname, '../data/security_logs.json');

const logAction = (action, user, details) => {
    try {
        let logs = [];
        if (fs.existsSync(logsFile)) {
            logs = JSON.parse(fs.readFileSync(logsFile, 'utf8'));
        }

        const newLog = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            action, // e.g., "LOGIN", "CREATE_USER", "UPDATE_PRODUCT"
            user,   // username or "System"
            details
        };

        logs.push(newLog);
        // data retention: keep last 1000 logs
        if (logs.length > 1000) logs = logs.slice(-1000);

        fs.writeFileSync(logsFile, JSON.stringify(logs, null, 2));
    } catch (err) {
        console.error("Failed to write security log:", err);
    }
};

module.exports = { logAction };
