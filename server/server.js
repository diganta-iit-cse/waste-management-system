require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { connectDB } = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Route imports
const authRoutes = require('./routes/authRoutes');
const classificationRoutes = require('./routes/classificationRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const pickupRoutes = require('./routes/pickupRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

// Models & Seeder
const RecyclingService = require('./models/RecyclingService');
const seedData = require('./seed/seeder');

const app = express();

// Middlewares
app.use(morgan('dev'));
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Root health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'WasteWise AI Waste Management & Recycling Services API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    features: ['STT', 'TTS', 'AI Classification', 'Kabadiwala Directory', 'Voice Assistant'],
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/classifications', classificationRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/pickups', pickupRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    // Auto seed if empty
    const serviceCount = await RecyclingService.countDocuments();
    if (serviceCount === 0) {
      console.log('[WasteWise] Database is empty. Running initial database seeder...');
      await seedData(false);
      console.log('[WasteWise] Initial seed finished successfully.');
    }

    app.listen(PORT, () => {
      console.log(`\n======================================================`);
      console.log(`  🌱 WasteWise Server running on port ${PORT}`);
      console.log(`  🌐 Base API URL: http://localhost:${PORT}/api`);
      console.log(`  📋 Health Check: http://localhost:${PORT}/api/health`);
      console.log(`======================================================\n`);
    });
  } catch (error) {
    console.error('Failed to start WasteWise server:', error);
    process.exit(1);
  }
};

startServer();
