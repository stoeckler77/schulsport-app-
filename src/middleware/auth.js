const jwt = require('jsonwebtoken');

// Authentication middleware
const authMiddleware = function(req, res, next) {
  // Get token from header
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  // Check if no token
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }
  
  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    
    // Add user from payload
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Role-based authorization middleware
const isTeacherOrAdmin = function(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  
  // Assuming user roles are stored in the user object
  if (req.user.role === 'admin' || req.user.role === 'teacher') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Not authorized.' });
  }
};

module.exports = { authMiddleware, isTeacherOrAdmin }; 