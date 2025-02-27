const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Create Express app
const app = express();

// Configure middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/schulsport';
let isConnected = false;

const connectToDatabase = async () => {
  if (isConnected) {
    console.log('Using existing database connection');
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI);
    isConnected = true;
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

// Define Course schema
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
  isActive: { type: Boolean, default: true },
  status: String
});

// Define Registration schema
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

// Define routes
app.get('/', async (req, res) => {
  try {
    await connectToDatabase();
    res.status(200).json({ message: 'API is running' });
  } catch (error) {
    res.status(500).json({ error: 'Connection to database failed' });
  }
});

app.get('/health', async (req, res) => {
  try {
    await connectToDatabase();
    res.status(200).json({ 
      status: 'ok',
      mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
      env: {
        NODE_ENV: process.env.NODE_ENV || 'not set',
        MONGODB_URI: process.env.MONGODB_URI ? 'Set (hidden for security)' : 'Not set'
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Health check failed' });
  }
});

app.get('/api/courses', async (req, res) => {
  try {
    await connectToDatabase();
    const Course = mongoose.models.Course || mongoose.model('Course', CourseSchema);
    const courses = await Course.find().sort({ startDate: 1 });
    res.status(200).json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

app.get('/api/test-data', async (req, res) => {
  try {
    await connectToDatabase();
    const Course = mongoose.models.Course || mongoose.model('Course', CourseSchema);
    
    // Check if courses exist
    const courseCount = await Course.countDocuments();
    
    if (courseCount === 0) {
      console.log('No courses found, creating test data...');
      
      // Create test courses
      const testCourses = [
        {
          title: 'Fußball für Anfänger',
          description: 'Ein Kurs für Schüler, die Fußball lernen möchten.',
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
          description: 'Intensives Basketball-Training für fortgeschrittene Spieler.',
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
      res.status(200).json({ message: 'Test courses created successfully', count: testCourses.length });
    } else {
      res.status(200).json({ message: `Found ${courseCount} existing courses` });
    }
  } catch (error) {
    console.error('Error creating test data:', error);
    res.status(500).json({ error: 'Failed to create test data' });
  }
});

app.get('/api/create-courses', async (req, res) => {
  try {
    await connectToDatabase();
    const Course = mongoose.models.Course || mongoose.model('Course', CourseSchema);
    
    // Check if courses exist
    const courseCount = await Course.countDocuments();
    
    if (courseCount === 0) {
      console.log('No courses found, creating courses from data...');
      
      // Create courses based on the image data
      const courses = [
        {
          title: 'TENNIS',
          description: 'Tenniskurs für Schüler der 4.-9. Klasse',
          teacher: 'Hubert Anderhub, Nicole Egli',
          location: 'Tennisplatz Muri',
          startDate: new Date('2025-02-12'),
          endDate: new Date('2025-06-30'),
          dayOfWeek: 'Mittwoch',
          timeStart: '13:00',
          timeEnd: '17:00',
          targetClasses: '4.-9. Klasse',
          maxParticipants: 48,
          isActive: true,
          status: 'Angebot findet statt'
        },
        {
          title: 'TISCHTENNIS',
          description: 'Tischtenniskurs für Schüler der 4.-9. Klasse',
          teacher: 'Martin Schneider',
          location: 'Badweiher',
          startDate: new Date('2025-02-13'),
          endDate: new Date('2025-06-30'),
          dayOfWeek: 'Donnerstag',
          timeStart: '17:00',
          timeEnd: '18:00',
          targetClasses: '4.-9. Klasse',
          maxParticipants: 14,
          isActive: true,
          status: 'Angebot findet statt'
        },
        {
          title: 'SCHWINGEN',
          description: 'Schwingkurs für Schüler der 1.-9. Klasse',
          teacher: 'Yanick Klausner',
          location: 'Schwinghalle Aristau',
          startDate: new Date('2025-02-13'),
          endDate: new Date('2025-06-30'),
          dayOfWeek: 'Donnerstag',
          timeStart: '18:00',
          timeEnd: '19:00',
          targetClasses: '1.-9. Klasse',
          maxParticipants: 12,
          isActive: false,
          status: 'Angebot findet nicht statt'
        },
        {
          title: 'RINGEN',
          description: 'Ringkurs für Schüler der 1.-9. Klasse',
          teacher: 'Adi Bucher',
          location: 'Turnhalle Rösslimatt',
          startDate: new Date('2025-02-10'),
          endDate: new Date('2025-06-30'),
          dayOfWeek: 'Montag',
          timeStart: '16:00',
          timeEnd: '17:00',
          targetClasses: '1.-9. Klasse',
          maxParticipants: 16,
          isActive: true,
          status: 'Angebot findet statt'
        },
        {
          title: 'VOLLEYBALL',
          description: 'Volleyballkurs für Schüler der 7.-9. Klasse',
          teacher: 'Nathanael Schärer',
          location: 'Bachmatten',
          startDate: new Date('2025-02-17'),
          endDate: new Date('2025-06-30'),
          dayOfWeek: 'Montag',
          timeStart: '12:15',
          timeEnd: '13:15',
          targetClasses: '7.-9. Klasse',
          maxParticipants: 24,
          isActive: false,
          status: 'Angebot findet nicht statt'
        },
        {
          title: 'MOUNTAINBIKE',
          description: 'Kurs von Frühlings- bis Herbstferien, eigenes Bike mitbringen',
          teacher: 'Nathanael Schärer',
          location: 'Bachmatten',
          startDate: new Date('2025-04-23'),
          endDate: new Date('2025-10-30'),
          dayOfWeek: 'Mittwoch',
          timeStart: '15:30',
          timeEnd: '16:30',
          targetClasses: '7.-9. Klasse',
          maxParticipants: 12,
          isActive: true,
          status: 'Nachmeldung offen bis Ende März'
        },
        {
          title: 'BMX (Einsteigerinnen)',
          description: 'Kurs von Frühlings- bis Herbstferien, eigenes Bike mitbringen',
          teacher: 'Stephanie Rohr',
          location: 'Pumptrack Bachmatten',
          startDate: new Date('2025-04-24'),
          endDate: new Date('2025-10-30'),
          dayOfWeek: 'Donnerstag',
          timeStart: '16:00',
          timeEnd: '17:00',
          targetClasses: '3.-9. Klasse (ab 10 Jahren)',
          maxParticipants: 8,
          isActive: true,
          status: 'Angebot findet statt'
        },
        {
          title: 'BMX (Fortgeschrittene)',
          description: 'Kurs von Frühlings- bis Herbstferien, eigenes Bike mitbringen',
          teacher: 'Stephanie Rohr',
          location: 'Pumptrack Bachmatten',
          startDate: new Date('2025-04-24'),
          endDate: new Date('2025-10-30'),
          dayOfWeek: 'Donnerstag',
          timeStart: '17:00',
          timeEnd: '18:00',
          targetClasses: '3.-9. Klasse (ab 10 Jahren)',
          maxParticipants: 8,
          isActive: true,
          status: 'Nachmeldung offen bis Ende März'
        }
      ];
      
      await Course.insertMany(courses);
      res.json({ message: 'Courses created successfully', count: courses.length });
    } else {
      res.json({ message: `Found ${courseCount} existing courses` });
    }
  } catch (err) {
    console.error('Error creating courses:', err);
    res.status(500).json({ error: 'Failed to create courses' });
  }
});

app.post('/api/registrations', async (req, res) => {
  try {
    await connectToDatabase();
    const Registration = mongoose.models.Registration || 
                         mongoose.model('Registration', RegistrationSchema);
    
    // Create new registration
    const newRegistration = new Registration(req.body);
    const registration = await newRegistration.save();
    
    res.status(201).json(registration);
  } catch (error) {
    console.error('Error creating registration:', error);
    res.status(500).json({ error: 'Failed to create registration' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Something went wrong' });
});

// Export the Express API
module.exports = app; 