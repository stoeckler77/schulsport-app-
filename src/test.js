// Simple test file for Vercel
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

// Define Course model
const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  teacher: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  dayOfWeek: {
    type: String,
    required: true
  },
  timeStart: {
    type: String,
    required: true
  },
  timeEnd: {
    type: String,
    required: true
  },
  targetClasses: {
    type: String,
    required: true
  },
  maxParticipants: {
    type: Number,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

// Create test data function
async function createTestData() {
  try {
    // Connect to MongoDB
    if (!mongoose.connection.readyState) {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('Connected to MongoDB for test data creation');
    }
    
    const Course = mongoose.model('Course', CourseSchema);
    
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
      console.log('Test courses created successfully');
      return 'Created test courses';
    } else {
      console.log(`Found ${courseCount} existing courses`);
      return `Found ${courseCount} existing courses`;
    }
  } catch (err) {
    console.error('Error creating test data:', err);
    return `Error: ${err.message}`;
  }
}

// Export the handler function
module.exports = async (req, res) => {
  let testDataResult = 'Test data not initialized';
  
  // Only create test data if explicitly requested
  if (req.query.createTestData === 'true') {
    testDataResult = await createTestData();
  }
  
  res.status(200).json({
    message: 'Test endpoint is working',
    env: {
      NODE_ENV: process.env.NODE_ENV || 'not set',
      MONGODB_URI: process.env.MONGODB_URI ? 'set (hidden)' : 'not set',
      JWT_SECRET: process.env.JWT_SECRET ? 'set (hidden)' : 'not set'
    },
    testData: testDataResult,
    mongodbStatus: mongoose.connection.readyState ? 'connected' : 'disconnected'
  });
}; 