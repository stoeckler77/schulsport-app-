import mongoose, { Schema, Document } from 'mongoose';

export interface ICourse extends Document {
  name: string;
  targetGroup: string;
  schedule: {
    day: string;
    time: string;
  };
  startDate: Date;
  location: string;
  instructors: string[];
  maxCapacity: number;
  notes: string;
  status: string;
  registrationDeadline: Date;
  semester: string;
}

const CourseSchema: Schema = new Schema({
  name: { type: String, required: true },
  targetGroup: { type: String, required: true },
  schedule: {
    day: { type: String, required: true },
    time: { type: String, required: true }
  },
  startDate: { type: Date, required: true },
  location: { type: String, required: true },
  instructors: [{ type: String, required: true }],
  maxCapacity: { type: Number, required: true },
  notes: { type: String },
  status: { 
    type: String, 
    enum: ['Angebot findet statt', 'Angebot findet nicht statt'],
    default: 'Angebot findet statt'
  },
  registrationDeadline: { type: Date, required: true },
  semester: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model<ICourse>('Course', CourseSchema); 