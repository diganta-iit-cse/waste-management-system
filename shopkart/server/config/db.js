const mongoose = require('mongoose');

let mongoMemoryServer = null;

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/shopkart';
    
    // First attempt to connect to the specified MONGO_URI with a short timeout
    try {
      const conn = await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 2000, // 2s quick check for local/Atlas MongoDB
      });
      console.log(`[MongoDB] Connected successfully to: ${conn.connection.host}/${conn.connection.name}`);
      return conn;
    } catch (directErr) {
      console.warn(`[MongoDB] Direct connection to ${mongoUri} failed (${directErr.message}).`);
      console.log('[MongoDB] Initializing embedded MongoDB server for instant zero-configuration development (launch timeout 120s)...');
      
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongoMemoryServer = await MongoMemoryServer.create({
        instance: {
          launchTimeout: 120000 // Allow up to 2 minutes for binary download & startup
        }
      });
      const inMemoryUri = mongoMemoryServer.getUri();
      
      const conn = await mongoose.connect(inMemoryUri);
      console.log(`[MongoDB] Connected to Embedded MongoDB Instance at: ${inMemoryUri}`);
      return conn;
    }
  } catch (error) {
    console.error(`[MongoDB] Critical Connection Error: ${error.message}`);
    process.exit(1);
  }
};

const closeDB = async () => {
  try {
    await mongoose.connection.close();
    if (mongoMemoryServer) {
      await mongoMemoryServer.stop();
    }
  } catch (err) {
    console.error('[MongoDB] Error closing connection:', err);
  }
};

module.exports = { connectDB, closeDB };
