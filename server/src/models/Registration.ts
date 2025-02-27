import mongoose, { Schema, Document } from 'mongoose';

export interface IRegistration extends Document {
  courseId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  studentId?: mongoose.Types.ObjectId;
  registrationDate: Date;
  status: string;
  attendance: Array<{
    date: Date;
    present: boolean;
    notes?: string;
  }>;
}

const RegistrationSchema: Schema = new Schema({
  courseId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Course',
    required: true 
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  studentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User'
  },
  registrationDate: { 
    type: Date, 
    default: Date.now 
  },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'rejected'],
    default: 'pending'
  },
  attendance: [{
    date: { type: Date },
    present: { type: Boolean, default: false },
    notes: { type: String }
  }]
}, { timestamps: true });

export default mongoose.model<IRegistration>('Registration', RegistrationSchema); 