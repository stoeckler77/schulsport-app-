import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import './RegistrationForm.css';

const RegistrationForm = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    childFirstName: '',
    childLastName: '',
    childClass: '',
    notes: ''
  });
  const [submitStatus, setSubmitStatus] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await api.get(`/courses/${courseId}`);
        setCourse(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch course details');
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus('submitting');
    
    try {
      await api.post('/registrations', {
        courseId,
        ...formData
      });
      
      setSubmitStatus('success');
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (err) {
      setSubmitStatus('error');
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  if (loading) return <div className="loading">Loading course details...</div>;
  if (error && !submitStatus) return <div className="error">{error}</div>;
  if (!course) return <div className="error">Course not found</div>;

  return (
    <div className="registration-container">
      <h1>Anmeldung: {course.name}</h1>
      
      <div className="course-summary">
        <p><strong>Zielgruppe:</strong> {course.targetGroup}</p>
        <p><strong>Zeitplan:</strong> {course.schedule.day} {course.schedule.time}</p>
        <p><strong>Ort:</strong> {course.location}</p>
        <p><strong>Leitung:</strong> {course.instructors.join(', ')}</p>
      </div>
      
      {submitStatus === 'success' ? (
        <div className="success-message">
          <h2>Anmeldung erfolgreich!</h2>
          <p>Vielen Dank für Ihre Anmeldung. Sie werden in Kürze zur Startseite weitergeleitet.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="registration-form">
          <h2>Eltern/Erziehungsberechtigte</h2>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">Vorname</label>
              <input 
                type="text" 
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="lastName">Nachname</label>
              <input 
                type="text" 
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="form-row">
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
          </div>
          
          <h2>Kind</h2>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="childFirstName">Vorname</label>
              <input 
                type="text" 
                id="childFirstName"
                name="childFirstName"
                value={formData.childFirstName}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="childLastName">Nachname</label>
              <input 
                type="text" 
                id="childLastName"
                name="childLastName"
                value={formData.childLastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="childClass">Klasse</label>
            <select 
              id="childClass"
              name="childClass"
              value={formData.childClass}
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
            <label htmlFor="notes">Bemerkungen</label>
            <textarea 
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="4"
            ></textarea>
          </div>
          
          {submitStatus === 'error' && (
            <div className="error-message">{error}</div>
          )}
          
          <div className="form-actions">
            <button 
              type="button" 
              className="btn-cancel"
              onClick={() => navigate('/')}
            >
              Abbrechen
            </button>
            <button 
              type="submit" 
              className="btn-submit"
              disabled={submitStatus === 'submitting'}
            >
              {submitStatus === 'submitting' ? 'Wird gesendet...' : 'Anmelden'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default RegistrationForm; 