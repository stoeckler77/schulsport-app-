const express = require('express');
const router = express.Router();
const Registration = require('../models/Registration');
const Course = require('../models/Course');
const auth = require('../middleware/auth');

// Get all registrations (admin only)
router.get('/', auth, async (req, res) => {
  try {
    const registrations = await Registration.find().populate('course', 'title');
    res.json(registrations);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get registrations for a specific course (admin only)
router.get('/course/:courseId', auth, async (req, res) => {
  try {
    const registrations = await Registration.find({ course: req.params.courseId });
    res.json(registrations);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Create a new registration
router.post('/', async (req, res) => {
  try {
    const {
      course,
      firstName,
      lastName,
      email,
      phone,
      class: studentClass,
      parentName,
      comments
    } = req.body;
    
    // Check if course exists and is active
    const courseData = await Course.findById(course);
    if (!courseData) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    if (!courseData.isActive) {
      return res.status(400).json({ message: 'Course is not active' });
    }
    
    // Check if course is full
    const registrationCount = await Registration.countDocuments({ course });
    if (registrationCount >= courseData.maxParticipants) {
      return res.status(400).json({ message: 'Course is full' });
    }
    
    // Create new registration
    const newRegistration = new Registration({
      course,
      firstName,
      lastName,
      email,
      phone,
      class: studentClass,
      parentName,
      comments
    });
    
    const registration = await newRegistration.save();
    
    res.json(registration);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Update registration status (admin only)
router.put('/:id', auth, async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id);
    
    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }
    
    const { status } = req.body;
    
    if (status) {
      registration.status = status;
    }
    
    await registration.save();
    
    res.json(registration);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Registration not found' });
    }
    res.status(500).send('Server error');
  }
});

// Delete a registration (admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id);
    
    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }
    
    await registration.remove();
    
    res.json({ message: 'Registration removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Registration not found' });
    }
    res.status(500).send('Server error');
  }
});

module.exports = router; 