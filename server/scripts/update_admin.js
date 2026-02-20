const { db } = require('../config/firebase');

async function updateAdmin() {
    // Wait for connection
    await new Promise(resolve => setTimeout(resolve, 2000));

    if (!db) {
        console.error("Database not connected");
        return;
    }

    try {
        const snapshot = await db.collection('users').limit(10).get();
        if (snapshot.empty) {
            console.log("No users found to update.");
            return;
        }

        const batch = db.batch();
        let count = 0;

        snapshot.forEach(doc => {
            const user = doc.data();
            // Update checking for old admin or just enforce the single admin rule if applied
            if (user.username === 'admin' || user.role === 'super_admin') {
                console.log(`Updating user ${doc.id} (${user.username})...`);
                batch.update(doc.ref, {
                    username: 'dovoc',
                    password: 'dovoc@123',
                    name: 'Dovoc Admin'
                });
                count++;
            }
        });

        if (count > 0) {
            await batch.commit();
            console.log(`Successfully updated ${count} admin user(s).`);
        } else {
            console.log("No admin user found to update.");
        }

    } catch (error) {
        console.error("Error updating admin:", error);
    }
}

updateAdmin();
