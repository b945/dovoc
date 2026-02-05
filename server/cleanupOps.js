const { db } = require('./config/firebase');

async function clearSeedProducts() {
    console.log("Cleaning up seed products...");
    const idsToDelete = ["1", "2", "3"];

    for (const id of idsToDelete) {
        try {
            await db.collection('products').doc(id).delete();
            console.log(`Deleted product ${id}`);
        } catch (e) {
            console.error(`Failed to delete ${id}`, e);
        }
    }
    console.log("Cleanup complete.");
    process.exit(0);
}

clearSeedProducts();
