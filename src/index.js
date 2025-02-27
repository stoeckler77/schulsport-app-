const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/courses');
const registrationRoutes = require('./routes/registrations');

// Load environment variables
dotenv.config();

// Check for required environment variables
if (!process.env.MONGODB_URI) {
  console.error('FATAL ERROR: MONGODB_URI environment variable is not defined');
  // In production, we'll let the process exit with an error
  // In development, we'll use a fallback for convenience
  if (process.env.NODE_ENV === 'production') {
    process.exit(1);
  } else {
    console.warn('Using fallback local MongoDB URI for development');
    process.env.MONGODB_URI = 'mongodb://localhost:27017/schulsport';
  }
}

const app = express();
// Use environment variable for port with fallback
const PORT = process.env.PORT || 3000;

console.log('Attempting to start server on port:', PORT);
console.log('MongoDB URI is defined:', !!process.env.MONGODB_URI);

// Configure CORS to allow requests from anywhere (you can restrict this later)
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Connect to MongoDB using environment variable
console.log('Attempting to connect to MongoDB...');
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    console.error('Connection string (first 10 chars):', 
      process.env.MONGODB_URI ? process.env.MONGODB_URI.substring(0, 10) + '...' : 'Not set');
  });

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/registrations', registrationRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('API is running');
});

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok',
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    env: {
      NODE_ENV: process.env.NODE_ENV || 'not set',
      PORT: process.env.PORT || 'not set',
      MONGODB_URI: process.env.MONGODB_URI ? 'Set (hidden for security)' : 'Not set',
      JWT_SECRET: process.env.JWT_SECRET ? 'Set (hidden for security)' : 'Not set'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  console.error('Stack:', err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// For local development
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export for Vercel
module.exports = app;