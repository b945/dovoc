const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

const serviceAccountPath = path.join(__dirname, '../serviceAccountKey.json');

const initFirebase = () => {
    if (!fs.existsSync(serviceAccountPath)) {
        console.error("❌ ERROR: serviceAccountKey.json not found in server directory.");
        console.error("Please download it from Firebase Console > Project Settings > Service Accounts and place it in 'server/' folder.");
        return null; // Return null to indicate failure
    }

    try {
        const serviceAccount = require(serviceAccountPath);
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            storageBucket: "dovoc-50f8d.firebasestorage.app"
        });
        console.log("✅ Firebase Admin Initialized");
        return admin.firestore();
    } catch (error) {
        console.error("❌ Firebase Initialization Error:", error);
        return null;
    }
};

const db = initFirebase();
const bucket = admin.storage().bucket();

module.exports = { admin, db, bucket };
