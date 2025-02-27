import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './RegistrationForm.css';

interface Course {
  _id: string;
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
}

interface FormData {
  studentName: string;
  class: string;
  parentName: string;
  email: string;
  phone: string;
}

const RegistrationForm: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    studentName: '',
    class: '',
    parentName: '',
    email: '',
    phone: ''
  });
  const [submitStatus, setSubmitStatus] = useState<{
    submitting: boolean;
    success: boolean;
    message: string | null;
  }>({
    submitting: false,
    success: false,
    message: null
  });

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/courses/${courseId}`);
        setCourse(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch course details');
        setLoading(false);
      }
    };

    if (courseId) {
      fetchCourseDetails();
    }
  }, [courseId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!courseId) return;
    
    setSubmitStatus({
      submitting: true,
      success: false,
      message: null
    });
    
    try {
      // If you have authentication, include the token here
      await axios.post('http://localhost:5000/api/registrations', {
        courseId,
        ...formData
      });
      
      setSubmitStatus({
        submitting: false,
        success: true,
        message: 'Anmeldung erfolgreich eingereicht!'
      });
      
      // Redirect after successful submission
      setTimeout(() => {
        navigate('/registration-success');
      }, 2000);
      
    } catch (err: any) {
      setSubmitStatus({
        submitting: false,
        success: false,
        message: err.response?.data?.message || 'Fehler bei der Anmeldung'
      });
    }
  };

  if (loading) return <div className="loading">Loading course details...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!course) return <div className="error">Course not found</div>;

  return (
    <div className="registration-container">
      <h2>Anmeldung: {course.name}</h2>
      
      <div className="course-summary">
        <div className="course-detail">
          <span className="label">Zielgruppe:</span>
          <span className="value">{course.targetGroup}</span>
        </div>
        <div className="course-detail">
          <span className="label">Zeit:</span>
          <span className="value">{course.schedule.day} {course.schedule.time}</span>
        </div>
        <div className="course-detail">
          <span className="label">Beginn:</span>
          <span className="value">{new Date(course.startDate).toLocaleDateString('de-CH')}</span>
        </div>
        <div className="course-detail">
          <span className="label">Ort:</span>
          <span className="value">{course.location}</span>
        </div>
        <div className="course-detail">
          <span className="label">Leitung:</span>
          <span className="value">{course.instructors.join(', ')}</span>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="registration-form">
        <div className="form-group">
          <label htmlFor="studentName">Name des Kindes</label>
          <input 
            type="text" 
            id="studentName"
            name="studentName"
            value={formData.studentName}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="class">Klasse</label>
          <select 
            id="class"
            name="class"
            value={formData.class}
            onChange={handleChange}
            required
          >
            <option value="">Bitte wählen</option>
            <option value="1. Klasse">1. Klasse</option>
            <option value="2. Klasse">2. Klasse</option>
            <option value="3. Klasse">3. Klasse</option>
            <option value="4. Klasse">4. Klasse</option>
            <option value="5. Klasse">5. Klasse</option>
            <option value="6. Klasse">6. Klasse</option>
            <option value="7. Klasse">7. Klasse</option>
            <option value="8. Klasse">8. Klasse</option>
            <option value="9. Klasse">9. Klasse</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="parentName">Name der Eltern</label>
          <input 
            type="text" 
            id="parentName"
            name="parentName"
            value={formData.parentName}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="email">E-Mail</label>
          <input 
            type="email" 
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="phone">Telefon</label>
          <input 
            type="tel" 
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-note">
          <p>Mit der Anmeldung bestätige ich, dass ich die Informationen zum freiwilligen Schulsport gelesen habe und damit einverstanden bin.</p>
        </div>
        
        <div className="form-actions">
          <button 
            type="submit" 
            className="btn-submit"
            disabled={submitStatus.submitting}
          >
            {submitStatus.submitting ? 'Wird gesendet...' : 'Anmelden'}
          </button>
        </div>
        
        {submitStatus.message && (
          <div className={`submit-message ${submitStatus.success ? 'success' : 'error'}`}>
            {submitStatus.message}
          </div>
        )}
      </form>
    </div>
  );
};

export default RegistrationForm; 