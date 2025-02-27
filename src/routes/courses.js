const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const { authMiddleware } = require('../middleware/auth');

// Get all courses
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find().sort({ startDate: 1 });
    res.json(courses);
  } catch (err) {
    console.error('Error fetching courses:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a single course
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(course);
  } catch (err) {
    console.error('Error fetching course:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new course (protected)
router.post('/', authMiddleware, async (req, res) => {
  try {
    console.log('Creating course with data:', req.body);
    const newCourse = new Course(req.body);
    const course = await newCourse.save();
    res.status(201).json(course);
  } catch (err) {
    console.error('Error creating course:', err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', errors: err.errors });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a course (protected)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    console.log('Updating course with ID:', req.params.id);
    console.log('Update data:', req.body);
    
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    res.json(course);
  } catch (err) {
    console.error('Error updating course:', err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', errors: err.errors });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Update course status (protected)
router.patch('/:id', authMiddleware, async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    res.json(course);
  } catch (err) {
    console.error('Error updating course status:', err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', errors: err.errors });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a course (protected)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json({ message: 'Course deleted successfully' });
  } catch (err) {
    console.error('Error deleting course:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 