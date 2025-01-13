// config/db.js
require('dotenv').config();

const { MongoClient } = require('mongodb');

let db;

const connectDB = async () => {
    const url = process.env.MONGO_URI;
    const client = new MongoClient(url);

    try {
        await client.connect();
        db = client.db('Contacts_api');
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection failed:', error.message);
        process.exit(1);
    }
};

const getCollection = (collectionName) => {
    if (!db) {
        throw new Error('Database not connected');
    }
    return db.collection(collectionName);
};

module.exports = { connectDB, getCollection };
