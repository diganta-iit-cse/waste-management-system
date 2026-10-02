const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

let mongoServerInstance = null;

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/wastewise';

    // 1. If Atlas or remote URI provided, attempt remote connection first
    if (mongoUri.includes('mongodb+srv://') || mongoUri.includes('cluster0')) {
      try {
        console.log(`[MongoDB] Attempting connection to MongoDB Atlas cluster...`);
        const conn = await mongoose.connect(mongoUri, {
          serverSelectionTimeoutMS: 5000,
        });
        console.log(`[MongoDB]  Connected successfully to MongoDB Atlas: ${conn.connection.host}/${conn.connection.name}`);
        return conn;
      } catch (atlasErr) {
        console.warn(`[MongoDB]  MongoDB Atlas connection failed (${atlasErr.message}).`);
        console.log('[MongoDB] Falling back to persistent local WiredTiger MongoDB instance...');
      }
    }

    // 2. Check if a local MongoDB server is already listening on port 27017
    try {
      console.log(`[MongoDB] Checking for existing MongoDB instance on ${mongoUri}...`);
      const conn = await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 2000,
      });
      console.log(`[MongoDB]  Connected to active MongoDB service: ${conn.connection.host}:${conn.connection.port}/${conn.connection.name}`);
      return conn;
    } catch (localListenErr) {
      console.log(`[MongoDB] No standalone MongoDB daemon listening (${localListenErr.message}).`);
    }

    // 3. Launch persistent MongoDB engine with WiredTiger persistent storage in server/data/db
    console.log('[MongoDB] 🚀 Launching persistent MongoDB database engine (WiredTiger Storage)...');
    const dataDir = path.resolve(__dirname, '../data/db');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    const { MongoMemoryServer } = require('mongodb-memory-server');
    mongoServerInstance = await MongoMemoryServer.create({
      instance: {
        dbPath: dataDir,
        port: 27017,
        storageEngine: 'wiredTiger',
      },
    });

    const activeUri = mongoServerInstance.getUri();
    const conn = await mongoose.connect(activeUri, {
      dbName: 'wastewise',
    });

    console.log(`[MongoDB]  Persistent WiredTiger MongoDB Engine running on: ${activeUri}`);
    console.log(`[MongoDB] 💾 Physical data storage directory: ${dataDir}`);
    console.log(`[MongoDB]  Database Name: ${conn.connection.name}`);

    return conn;
  } catch (error) {
    console.error(`[MongoDB] Critical Database Initialization Error: ${error.message}`);
    process.exit(1);
  }
};

const closeDB = async () => {
  try {
    await mongoose.connection.close();
    if (mongoServerInstance) {
      await mongoServerInstance.stop();
    }
  } catch (err) {
    console.error('[MongoDB] Error closing database connection:', err);
  }
};

module.exports = { connectDB, closeDB };
