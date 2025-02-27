import express from 'express';

const router = express.Router();

// Sample course data for testing
const sampleCourses = [
  {
    _id: '1',
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
    _id: '2',
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

// Get all courses
router.get('/', function(req, res) {
  res.json(sampleCourses);
});

// Get course by ID
router.get('/:id', function(req, res) {
  const course = sampleCourses.find(c => c._id === req.params.id);
  
  if (!course) {
    return res.status(404).json({ message: 'Course not found' });
  }
  
  res.json(course);
});

// Get courses for teacher (simplified for testing)
router.get('/teacher', function(req, res) {
  res.json(sampleCourses);
});

export default router;
