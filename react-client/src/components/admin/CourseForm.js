import React, { useState, useEffect } from 'react';
import './CourseForm.css';

function CourseForm({ course, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    emoji: '🏃‍♂️',
    targetGroup: '',
    schedule: '',
    startDate: '',
    location: '',
    instructor: '',
    maxParticipants: '',
    notes: '',
    isActive: true
  });

  useEffect(() => {
    // If editing an existing course, populate the form
    if (course) {
      // Format the date for the date input (YYYY-MM-DD)
      const formattedDate = course.startDate 
        ? new Date(course.startDate).toISOString().split('T')[0]
        : '';
        
      setFormData({
        title: course.title || '',
        emoji: course.emoji || '🏃‍♂️',
        targetGroup: course.targetGroup || '',
        schedule: course.schedule || '',
        startDate: formattedDate,
        location: course.location || '',
        instructor: course.instructor || '',
        maxParticipants: course.maxParticipants || '',
        notes: course.notes || '',
        isActive: course.isActive !== undefined ? course.isActive : true
      });
    }
  }, [course]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Convert maxParticipants to a number
    const submissionData = {
      ...formData,
      maxParticipants: parseInt(formData.maxParticipants, 10)
    };
    
    onSubmit(submissionData);
  };

  // Common emojis for sports
  const emojiOptions = [
    '🏃‍♂️', '🏃‍♀️', '🏀', '⚽', '🏈', '⚾', '🎾', '🏐', '🏉', '🎱', 
    '🏓', '🏸', '🏒', '🏑', '🏏', '⛳', '🏹', '🎣', '🥊', '🥋',
    '🚴‍♂️', '🚴‍♀️', '🏊‍♂️', '🏊‍♀️', '🤸‍♂️', '🤸‍♀️', '⛷️', '🏂', '🏄‍♂️', '🏄‍♀️',
    '🚣‍♂️', '🚣‍♀️', '🧗‍♂️', '🧗‍♀️', '🤼‍♂️', '🤼‍♀️', '🤺', '🏇', '🧘‍♂️', '🧘‍♀️'
  ];

  return (
    <div className="course-form-container">
      <h2>{course ? 'Kurs bearbeiten' : 'Neuen Kurs erstellen'}</h2>
      
      <form onSubmit={handleSubmit} className="course-form">
        <div className="form-group">
          <label htmlFor="title">Titel*</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="emoji">Emoji</label>
          <div className="emoji-selector">
            <select
              id="emoji"
              name="emoji"
              value={formData.emoji}
              onChange={handleChange}
            >
              {emojiOptions.map(emoji => (
                <option key={emoji} value={emoji}>{emoji}</option>
              ))}
            </select>
            <span className="selected-emoji">{formData.emoji}</span>
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="targetGroup">Zielgruppe*</label>
            <input
              type="text"
              id="targetGroup"
              name="targetGroup"
              value={formData.targetGroup}
              onChange={handleChange}
              placeholder="z.B. 4.-9. Klasse"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="maxParticipants">Max. Teilnehmer*</label>
            <input
              type="number"
              id="maxParticipants"
              name="maxParticipants"
              value={formData.maxParticipants}
              onChange={handleChange}
              min="1"
              required
            />
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="schedule">Zeitplan*</label>
            <input
              type="text"
              id="schedule"
              name="schedule"
              value={formData.schedule}
              onChange={handleChange}
              placeholder="z.B. MO 16.00 - 17.00"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="startDate">Startdatum*</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="location">Ort*</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="instructor">Leitung*</label>
            <input
              type="text"
              id="instructor"
              name="instructor"
              value={formData.instructor}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="notes">Hinweise</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="3"
          ></textarea>
        </div>
        
        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
            />
            Kurs ist aktiv
          </label>
        </div>
        
        <div className="form-actions">
          <button type="button" className="cancel-button" onClick={onCancel}>
            Abbrechen
          </button>
          <button type="submit" className="submit-button">
            {course ? 'Speichern' : 'Kurs erstellen'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CourseForm; 