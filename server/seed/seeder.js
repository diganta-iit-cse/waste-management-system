require('dotenv').config();
const { connectDB, closeDB } = require('../config/db');
const User = require('../models/User');
const RecyclingService = require('../models/RecyclingService');
const Classification = require('../models/Classification');
const PickupRequest = require('../models/PickupRequest');
const {
  users,
  recyclingServices,
  classifications,
  pickupRequests,
} = require('./seedData');

const seedData = async (shouldExit = true) => {
  try {
    console.log('[Seeder] Starting WasteWise Database Seeding...');

    // Clear existing collections
    await Promise.all([
      User.deleteMany(),
      RecyclingService.deleteMany(),
      Classification.deleteMany(),
      PickupRequest.deleteMany(),
    ]);
    console.log('[Seeder] Cleared previous collections.');

    // 1. Seed Users
    const createdUsers = [];
    for (const u of users) {
      const userDoc = new User(u);
      await userDoc.save();
      createdUsers.push(userDoc);
    }
    const citizenUser = createdUsers.find((u) => u.role === 'user') || createdUsers[0];
    console.log(`[Seeder] Seeded ${createdUsers.length} users (Admin & Citizen).`);

    // 2. Seed Recycling Services
    const createdServices = await RecyclingService.insertMany(recyclingServices);
    console.log(`[Seeder] Seeded ${createdServices.length} recycling services & Kabadiwalas.`);

    // 3. Seed Classifications (attach citizen user id)
    const classificationsWithUser = classifications.map((c) => ({
      ...c,
      user: citizenUser._id,
    }));
    const createdClassifications = await Classification.insertMany(classificationsWithUser);
    console.log(`[Seeder] Seeded ${createdClassifications.length} waste classifications (15 recyclable, 5 organic, 3 e-waste, 2 hazardous).`);

    // 4. Seed Pickups
    const pickupsWithRelations = pickupRequests.map((p, idx) => ({
      ...p,
      user: citizenUser._id,
      assignedService: createdServices[idx % createdServices.length]._id,
    }));
    const createdPickups = await PickupRequest.insertMany(pickupsWithRelations);
    console.log(`[Seeder] Seeded ${createdPickups.length} pickup requests.`);

    console.log('[Seeder] WasteWise database successfully seeded!');
    if (shouldExit) {
      process.exit(0);
    }
  } catch (error) {
    console.error('[Seeder] Seeding failed with error:', error);
    if (shouldExit) {
      process.exit(1);
    }
    throw error;
  }
};

if (require.main === module) {
  connectDB().then(() => seedData(true));
}

module.exports = seedData;
