const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

// Define Course model directly in this script
const CourseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  emoji: { type: String, default: '🏃‍♂️' },
  targetGroup: { type: String, required: true },
  schedule: { type: String, required: true },
  startDate: { type: Date, required: true },
  location: { type: String, required: true },
  instructor: { type: String, required: true },
  maxParticipants: { type: Number, required: true },
  notes: { type: String },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

const Course = mongoose.model('Course', CourseSchema);

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/schulsport')
  .then(async () => {
    console.log('MongoDB connected');
    
    try {
      // Delete existing courses
      await Course.deleteMany({});
      console.log('Deleted existing courses');
      
      // Sample courses based on your table
      const sampleCourses = [
        {
          title: 'TENNIS',
          emoji: '🎾',
          targetGroup: '4.-9.Klasse',
          schedule: 'MI 13.00 - 14.00, MI 14.00 - 15.00, MI 15.00 - 16.00, MI 16.00 - 17.00',
          startDate: new Date('2025-02-12'),
          location: 'Tennisplatz Muri',
          instructor: 'Hubert Anderhub, Nicole Egli',
          maxParticipants: 48,
          notes: 'Die Einteilung erfolgt nach Anmeldeschluss und wird per Klapp kommuniziert',
          isActive: true
        },
        {
          title: 'TISCHTENNIS',
          emoji: '🏓',
          targetGroup: '4.-9. Klasse',
          schedule: 'DO 17.00 - 18.00',
          startDate: new Date('2025-02-13'),
          location: 'Badweiher',
          instructor: 'Martin Schneider',
          maxParticipants: 14,
          notes: '',
          isActive: true
        },
        {
          title: 'SCHWINGEN',
          emoji: '🤼',
          targetGroup: '1.-9. Klasse',
          schedule: 'DO 18.00 - 19.00',
          startDate: new Date('2025-02-13'),
          location: 'Schwinghalle Aristau',
          instructor: 'Yanick Klausner',
          maxParticipants: 12,
          notes: '',
          isActive: false
        },
        {
          title: 'RINGEN',
          emoji: '🤼‍♂️',
          targetGroup: '1.-9. Klasse',
          schedule: 'MO 16.00 - 17.00',
          startDate: new Date('2025-02-10'),
          location: 'Turnhalle Rösslimatt',
          instructor: 'Adi Bucher',
          maxParticipants: 16,
          notes: '',
          isActive: true
        },
        {
          title: 'VOLLEYBALL',
          emoji: '🏐',
          targetGroup: '7.-9. Klasse',
          schedule: 'MO 12.15 - 13.15',
          startDate: new Date('2025-02-17'),
          location: 'Bachmatten',
          instructor: 'Nathanael Schärer',
          maxParticipants: 24,
          notes: '',
          isActive: false
        },
        {
          title: 'MOUNTAINBIKE',
          emoji: '🚵‍♂️',
          targetGroup: '7.-9. Klasse',
          schedule: 'MI 15.30 - 16.30',
          startDate: new Date('2025-04-23'),
          location: 'Bachmatten',
          instructor: 'Nathanael Schärer',
          maxParticipants: 12,
          notes: 'Kurs von Frühlings- bis Herbstferien, eigenes Bike mitbringen',
          isActive: true
        },
        {
          title: 'BMX (Einsteiger:innen)',
          emoji: '🚲',
          targetGroup: '3.-9. Klasse (ab 10 Jahren)',
          schedule: 'DO 16.00 - 17.00',
          startDate: new Date('2025-04-24'),
          location: 'Pumptrack Bachmatten',
          instructor: 'Stephanie Rohr',
          maxParticipants: 8,
          notes: 'Kurs von Frühlings- bis Herbstferien, eigenes Bike mitbringen',
          isActive: true
        },
        {
          title: 'BMX (Fortgeschrittene)',
          emoji: '🚲',
          targetGroup: '3.-9. Klasse (ab 10 Jahren)',
          schedule: 'DO 17.00 - 18.00',
          startDate: new Date('2025-04-24'),
          location: 'Pumptrack Bachmatten',
          instructor: 'Stephanie Rohr',
          maxParticipants: 8,
          notes: 'Kurs von Frühlings- bis Herbstferien, eigenes Bike mitbringen',
          isActive: true
        }
      ];
      
      await Course.insertMany(sampleCourses);
      console.log(`${sampleCourses.length} sample courses created successfully`);
      
    } catch (err) {
      console.error('Error creating sample courses:', err);
    } finally {
      mongoose.disconnect();
      console.log('MongoDB disconnected');
    }
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  }); 