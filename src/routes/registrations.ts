import express from 'express';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// Get all registrations (admin only)
router.get('/', authMiddleware, function(req, res) {
  // Implementation will be added later
  res.json({ message: 'Registrations route working' });
});

// Get registrations for a specific course
router.get('/course/:courseId', authMiddleware, function(req, res) {
  // Implementation will be added later
  res.json({ message: `Registrations for course ${req.params.courseId}` });
});

// Create a new registration
router.post('/', function(req, res) {
  // Implementation will be added later
  res.json({ message: 'Registration created' });
});

export default router;
