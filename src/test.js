// Simple test file for Vercel
module.exports = (req, res) => {
  res.status(200).json({
    message: 'Test endpoint is working',
    env: {
      NODE_ENV: process.env.NODE_ENV || 'not set',
      MONGODB_URI: process.env.MONGODB_URI ? 'set (hidden)' : 'not set',
      JWT_SECRET: process.env.JWT_SECRET ? 'set (hidden)' : 'not set'
    }
  });
}; 