const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

const serviceAccountPath = path.join(__dirname, '../serviceAccountKey.json');

const initFirebase = () => {
    let serviceAccount;

    // 1. Try Environment Variable (Production/Vercel)
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        try {
            serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
            // Handle newlines in private key if they are escaped
            if (serviceAccount.private_key) {
                serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
            }
        } catch (e) {
            console.error("❌ Failed to parse FIREBASE_SERVICE_ACCOUNT env var");
            return null;
        }
    }
    // 2. Try Local File (Development)
    else if (fs.existsSync(serviceAccountPath)) {
        serviceAccount = require(serviceAccountPath);
    }
    else {
        console.error("❌ ERROR: No Firebase credentials found (Env or File).");
        return null;
    }

    try {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            storageBucket: "dovoc-50f8d.firebasestorage.app"
        });
        console.log("✅ Firebase Admin Initialized");
        return admin.firestore();
    } catch (error) {
        // If already initialized (Vercel hot reload), ensure we return db
        if (error.code === 'app/duplicate-app') {
            return admin.firestore();
        }
        console.error("❌ Firebase Initialization Error:", error);
        return null;
    }
};

const db = initFirebase();
const bucket = admin.storage().bucket();

module.exports = { admin, db, bucket };
