import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Login route (simplified for testing)
router.post('/login', function(req, res) {
  const { email, password } = req.body;
  
  // For testing purposes, accept any login with these credentials
  if (email === 'teacher@example.com' && password === 'password123') {
    const token = jwt.sign(
      { userId: '123', role: 'teacher' },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '7d' }
    );
    
    return res.json({
      token,
      user: {
        id: '123',
        email,
        firstName: 'Test',
        lastName: 'Teacher',
        role: 'teacher'
      }
    });
  }
  
  return res.status(401).json({ message: 'Invalid credentials' });
});

// Get current user
router.get('/me', function(req, res) {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    res.json({
      id: '123',
      email: 'teacher@example.com',
      firstName: 'Test',
      lastName: 'Teacher',
      role: 'teacher'
    });
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

export default router;
