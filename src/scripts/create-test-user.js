const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

// Define User model directly in this script
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model('User', UserSchema);

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/schulsport')
  .then(async () => {
    console.log('MongoDB connected');
    
    try {
      // Check if test user already exists
      const existingUser = await User.findOne({ email: 'admin@example.com' });
      
      if (existingUser) {
        console.log('Test user already exists');
        mongoose.disconnect();
        return;
      }
      
      // Create a test user
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('password123', salt);
      
      const newUser = new User({
        name: 'Admin User',
        email: 'admin@example.com',
        password: hashedPassword
      });
      
      await newUser.save();
      console.log('Test user created successfully');
      
    } catch (err) {
      console.error('Error creating test user:', err);
    } finally {
      mongoose.disconnect();
      console.log('MongoDB disconnected');
    }
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  }); 