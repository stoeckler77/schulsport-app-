import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser extends Document {
  email: string;
  password: string;
  role: string;
  firstName: string;
  lastName: string;
  class?: string;
  children?: Array<{
    firstName: string;
    lastName: string;
    class: string;
  }>;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['student', 'parent', 'teacher', 'admin'],
    required: true 
  },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  class: { type: String },
  children: [{
    firstName: { type: String },
    lastName: { type: String },
    class: { type: String }
  }]
}, { timestamps: true });

// Password hashing middleware
UserSchema.pre<IUser>('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser>('User', UserSchema); 