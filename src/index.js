const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configure CORS
app.use(cors());
app.use(express.json());

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/schulsport';
console.log('Attempting to connect to MongoDB...');
mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });

// Define routes directly in this file for now
// Simple test route
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
      MONGODB_URI: process.env.MONGODB_URI ? 'Set (hidden for security)' : 'Not set'
    }
  });
});

// Courses routes
app.get('/api/courses', async (req, res) => {
  try {
    // Define Course model inline for testing
    const CourseSchema = new mongoose.Schema({
      title: String,
      description: String,
      teacher: String,
      location: String,
      startDate: Date,
      endDate: Date,
      dayOfWeek: String,
      timeStart: String,
      timeEnd: String,
      targetClasses: String,
      maxParticipants: Number,
      isActive: { type: Boolean, default: true }
    });
    
    // Check if model is already registered
    const Course = mongoose.models.Course || mongoose.model('Course', CourseSchema);
    
    const courses = await Course.find().sort({ startDate: 1 });
    res.json(courses);
  } catch (err) {
    console.error('Error fetching courses:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Create test data route
app.get('/api/test-data', async (req, res) => {
  try {
    // Define Course model inline
    const CourseSchema = new mongoose.Schema({
      title: String,
      description: String,
      teacher: String,
      location: String,
      startDate: Date,
      endDate: Date,
      dayOfWeek: String,
      timeStart: String,
      timeEnd: String,
      targetClasses: String,
      maxParticipants: Number,
      isActive: { type: Boolean, default: true }
    });
    
    // Check if model is already registered
    const Course = mongoose.models.Course || mongoose.model('Course', CourseSchema);
    
    // Check if courses exist
    const courseCount = await Course.countDocuments();
    
    if (courseCount === 0) {
      console.log('No courses found, creating test data...');
      
      // Create test courses
      const testCourses = [
        {
          title: 'Fußball für Anfänger',
          description: 'Ein Kurs für Schüler, die Fußball lernen möchten. Grundlegende Techniken und Regeln werden vermittelt.',
          teacher: 'Max Mustermann',
          location: 'Sporthalle A',
          startDate: new Date('2023-09-01'),
          endDate: new Date('2023-12-20'),
          dayOfWeek: 'Montag',
          timeStart: '15:00',
          timeEnd: '16:30',
          targetClasses: '5-7',
          maxParticipants: 20,
          isActive: true
        },
        {
          title: 'Basketball Training',
          description: 'Intensives Basketball-Training für fortgeschrittene Spieler. Fokus auf Teamspiel und Taktik.',
          teacher: 'Anna Schmidt',
          location: 'Sporthalle B',
          startDate: new Date('2023-09-05'),
          endDate: new Date('2023-12-15'),
          dayOfWeek: 'Mittwoch',
          timeStart: '16:00',
          timeEnd: '17:30',
          targetClasses: '8-10',
          maxParticipants: 15,
          isActive: true
        }
      ];
      
      await Course.insertMany(testCourses);
      res.json({ message: 'Test courses created successfully', count: testCourses.length });
    } else {
      res.json({ message: `Found ${courseCount} existing courses` });
    }
  } catch (err) {
    console.error('Error creating test data:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Registration route
app.post('/api/registrations', async (req, res) => {
  try {
    // Define Registration model inline
    const RegistrationSchema = new mongoose.Schema({
      course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
      firstName: String,
      lastName: String,
      email: String,
      phone: String,
      class: String,
      parentName: String,
      comments: String,
      status: { type: String, default: 'pending' },
      registeredAt: { type: Date, default: Date.now }
    });
    
    // Check if model is already registered
    const Registration = mongoose.models.Registration || 
                         mongoose.model('Registration', RegistrationSchema);
    
    // Create new registration
    const newRegistration = new Registration(req.body);
    const registration = await newRegistration.save();
    
    res.status(201).json(registration);
  } catch (err) {
    console.error('Error creating registration:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
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