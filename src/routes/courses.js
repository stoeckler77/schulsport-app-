const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const auth = require('../middleware/auth');

// Get all courses
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find().sort({ startDate: 1 });
    res.json(courses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get a specific course
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    res.json(course);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.status(500).send('Server error');
  }
});

// Create a new course (admin only)
router.post('/', auth, async (req, res) => {
  try {
    const {
      title,
      description,
      teacher,
      location,
      startDate,
      endDate,
      dayOfWeek,
      timeStart,
      timeEnd,
      targetClasses,
      maxParticipants,
      isActive
    } = req.body;
    
    const newCourse = new Course({
      title,
      description,
      teacher,
      location,
      startDate,
      endDate,
      dayOfWeek,
      timeStart,
      timeEnd,
      targetClasses,
      maxParticipants,
      isActive
    });
    
    const course = await newCourse.save();
    
    res.json(course);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Update a course (admin only)
router.put('/:id', auth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    const {
      title,
      description,
      teacher,
      location,
      startDate,
      endDate,
      dayOfWeek,
      timeStart,
      timeEnd,
      targetClasses,
      maxParticipants,
      isActive
    } = req.body;
    
    // Update fields
    if (title) course.title = title;
    if (description) course.description = description;
    if (teacher) course.teacher = teacher;
    if (location) course.location = location;
    if (startDate) course.startDate = startDate;
    if (endDate) course.endDate = endDate;
    if (dayOfWeek) course.dayOfWeek = dayOfWeek;
    if (timeStart) course.timeStart = timeStart;
    if (timeEnd) course.timeEnd = timeEnd;
    if (targetClasses) course.targetClasses = targetClasses;
    if (maxParticipants) course.maxParticipants = maxParticipants;
    if (isActive !== undefined) course.isActive = isActive;
    
    await course.save();
    
    res.json(course);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.status(500).send('Server error');
  }
});

// Delete a course (admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    await course.remove();
    
    res.json({ message: 'Course removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.status(500).send('Server error');
  }
});

module.exports = router; 