const express = require('express');
const router = express.Router();
const Registration = require('../models/Registration');
const Course = require('../models/Course');
const { authMiddleware } = require('../middleware/auth');

// Create a new registration
router.post('/', async (req, res) => {
  try {
    const { course: courseId, firstName, lastName, email, phone, class: className, parentName, comments } = req.body;
    
    // Check if the course exists and is active
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    if (!course.isActive) {
      return res.status(400).json({ message: 'Cannot register for an inactive course' });
    }
    
    // Create new registration
    const newRegistration = new Registration({
      course: courseId,
      firstName,
      lastName,
      email,
      phone,
      class: className,
      parentName,
      comments
    });
    
    const registration = await newRegistration.save();
    
    // In a real application, you would send a confirmation email here
    
    res.status(201).json(registration);
  } catch (err) {
    console.error('Error creating registration:', err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', errors: err.errors });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all registrations (protected)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const registrations = await Registration.find().populate('course', 'title');
    res.json(registrations);
  } catch (err) {
    console.error('Error fetching registrations:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get registrations for a specific course (protected)
router.get('/course/:courseId', authMiddleware, async (req, res) => {
  try {
    const registrations = await Registration.find({ course: req.params.courseId });
    res.json(registrations);
  } catch (err) {
    console.error('Error fetching course registrations:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update registration status (protected)
router.patch('/:id', authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    const registration = await Registration.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    
    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }
    
    res.json(registration);
  } catch (err) {
    console.error('Error updating registration:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a registration (protected)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const registration = await Registration.findByIdAndDelete(req.params.id);
    
    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }
    
    res.json({ message: 'Registration deleted successfully' });
  } catch (err) {
    console.error('Error deleting registration:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 