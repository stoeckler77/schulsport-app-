import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Course from '../models/Course';
import User from '../models/User';

dotenv.config();

mongoose.connect(process.env.MONGODB_URI as string)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const seedCourses = [
  {
    name: 'TENNIS',
    targetGroup: '4.-9. Klasse',
    schedule: {
      day: 'MI',
      time: '13.00 - 14.00'
    },
    startDate: new Date('2025-02-12'),
    location: 'Tennisplatz Muri',
    instructors: ['Hubert Anderhub', 'Nicole Egli'],
    maxCapacity: 48,
    notes: 'Die Einteilung erfolgt nach Anmeldeschluss und wird per Klapp kommuniziert',
    status: 'Angebot findet statt',
    registrationDeadline: new Date('2025-01-24'),
    semester: '2024/2025'
  },
  {
    name: 'TISCHTENNIS',
    targetGroup: '4.-9. Klasse',
    schedule: {
      day: 'DO',
      time: '17.00 - 18.00'
    },
    startDate: new Date('2025-02-13'),
    location: 'Badweiher',
    instructors: ['Martin Schneider'],
    maxCapacity: 14,
    status: 'Angebot findet statt',
    registrationDeadline: new Date('2025-01-24'),
    semester: '2024/2025'
  }
];

const seedUsers = [
  {
    email: 'teacher@example.com',
    password: 'password123',
    role: 'teacher',
    firstName: 'Martin',
    lastName: 'Schneider'
  },
  {
    email: 'parent@example.com',
    password: 'password123',
    role: 'parent',
    firstName: 'Parent',
    lastName: 'User',
    children: [
      {
        firstName: 'Child',
        lastName: 'User',
        class: '5. Klasse'
      }
    ]
  }
];

async function seedDatabase() {
  try {
    // Clear existing data
    await Course.deleteMany({});
    await User.deleteMany({});
    
    // Insert new data
    await Course.insertMany(seedCourses);
    await User.create(seedUsers);
    
    console.log('Database seeded successfully');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding database:', error);
    mongoose.connection.close();
  }
}

seedDatabase(); 