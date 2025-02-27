const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

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

// Check if route files exist before importing
const routeFiles = {
  auth: path.join(__dirname, 'routes', 'auth.js'),
  courses: path.join(__dirname, 'routes', 'courses.js'),
  registrations: path.join(__dirname, 'routes', 'registrations.js')
};

// Simple route for testing
app.get('/', (req, res) => {
  res.send('API is running');
});

// Health check route
app.get('/health', (req, res) => {
  const routeStatus = {};
  
  for (const [name, filePath] of Object.entries(routeFiles)) {
    routeStatus[name] = fs.existsSync(filePath) ? 'File exists' : 'File missing';
  }
  
  res.status(200).json({ 
    status: 'ok',
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    routes: routeStatus,
    env: {
      NODE_ENV: process.env.NODE_ENV || 'not set',
      PORT: process.env.PORT || 'not set',
      MONGODB_URI: process.env.MONGODB_URI ? 'Set (hidden for security)' : 'Not set',
      JWT_SECRET: process.env.JWT_SECRET ? 'Set (hidden for security)' : 'Not set'
    }
  });
});

// Safely import and use routes
try {
  console.log('Checking if auth routes file exists:', fs.existsSync(routeFiles.auth));
  if (fs.existsSync(routeFiles.auth)) {
    const authRoutes = require('./routes/auth');
    console.log('Auth routes type:', typeof authRoutes);
    if (typeof authRoutes === 'function') {
      app.use('/api/auth', authRoutes);
      console.log('Auth routes mounted successfully');
    } else {
      console.error('Auth routes is not a function:', authRoutes);
    }
  } else {
    console.error('Auth routes file does not exist');
  }
  
  console.log('Checking if courses routes file exists:', fs.existsSync(routeFiles.courses));
  if (fs.existsSync(routeFiles.courses)) {
    const courseRoutes = require('./routes/courses');
    console.log('Course routes type:', typeof courseRoutes);
    if (typeof courseRoutes === 'function') {
      app.use('/api/courses', courseRoutes);
      console.log('Course routes mounted successfully');
    } else {
      console.error('Course routes is not a function:', courseRoutes);
    }
  } else {
    console.error('Courses routes file does not exist');
  }
  
  console.log('Checking if registrations routes file exists:', fs.existsSync(routeFiles.registrations));
  if (fs.existsSync(routeFiles.registrations)) {
    const registrationRoutes = require('./routes/registrations');
    console.log('Registration routes type:', typeof registrationRoutes);
    if (typeof registrationRoutes === 'function') {
      app.use('/api/registrations', registrationRoutes);
      console.log('Registration routes mounted successfully');
    } else {
      console.error('Registration routes is not a function:', registrationRoutes);
    }
  } else {
    console.error('Registrations routes file does not exist');
  }
} catch (err) {
  console.error('Error importing routes:', err);
}

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