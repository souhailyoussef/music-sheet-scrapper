const mongoose = require('mongoose');

async function connectToDatabase(dbName = 'sheets') {
    const connectionString = `mongodb://localhost:27017/${dbName}`;
	try {
		await mongoose.connect(connectionString, {});
		console.log('✅ Connected to MongoDB');
        await clearCollections();
	} catch (err) {
		console.error('❌ MongoDB connection error:', err.message);
		process.exit(1);
	}
}

async function clearCollections() {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        await collections[key].deleteMany({});
    }
    console.log('🧹 Cleared all collections');
}



module.exports = {mongoose, connectToDatabase};