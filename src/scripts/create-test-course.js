const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

// Define Course model directly in this script
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

const Course = mongoose.model('Course', CourseSchema);

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/schulsport')
  .then(async () => {
    console.log('MongoDB connected');
    
    try {
      // Check if test course already exists
      const existingCourse = await Course.findOne({ title: 'Fußball für Anfänger' });
      
      if (existingCourse) {
        console.log('Test course already exists');
        mongoose.disconnect();
        return;
      }
      
      // Create a test course
      const newCourse = new Course({
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
      });
      
      await newCourse.save();
      console.log('Test course created successfully');
      
      // Create a second test course
      const secondCourse = new Course({
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
      });
      
      await secondCourse.save();
      console.log('Second test course created successfully');
      
    } catch (err) {
      console.error('Error creating test courses:', err);
    } finally {
      mongoose.disconnect();
      console.log('MongoDB disconnected');
    }
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  }); 