import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import './CourseForm.css';

function CourseForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [course, setCourse] = useState({
    title: '',
    description: '',
    teacher: '',
    location: '',
    startDate: '',
    endDate: '',
    dayOfWeek: '',
    timeStart: '',
    timeEnd: '',
    targetClasses: '',
    maxParticipants: 0,
    isActive: true,
    status: 'Angebot findet statt',
    notes: ''
  });

  useEffect(() => {
    if (id) {
      fetchCourse();
    }
  }, [id]);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000';
      const response = await axios.get(`${apiUrl}/api/courses/${id}`);
      
      // Format dates for the form inputs
      const courseData = response.data;
      if (courseData.startDate) {
        courseData.startDate = new Date(courseData.startDate).toISOString().split('T')[0];
      }
      if (courseData.endDate) {
        courseData.endDate = new Date(courseData.endDate).toISOString().split('T')[0];
      }
      
      setCourse(courseData);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch course');
      setLoading(false);
      console.error(err);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCourse({
      ...course,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000';
      if (id) {
        await axios.put(`${apiUrl}/api/courses/${id}`, course);
      } else {
        await axios.post(`${apiUrl}/api/courses`, course);
      }
      setLoading(false);
      navigate('/admin/courses');
    } catch (err) {
      setLoading(false);
      setError('Failed to save course. Please try again.');
      console.error(err);
    }
  };

  // Common emojis for sports
  const emojiOptions = [
    '🏃‍♂️', '🏃‍♀️', '🏀', '⚽', '🏈', '⚾', '🎾', '🏐', '🏉', '🎱', 
    '🏓', '🏸', '🏒', '🏑', '🏏', '⛳', '🏹', '🎣', '🥊', '🥋',
    '🚴‍♂️', '🚴‍♀️', '🏊‍♂️', '🏊‍♀️', '🤸‍♂️', '🤸‍♀️', '⛷️', '🏂', '🏄‍♂️', '🏄‍♀️',
    '🚣‍♂️', '🚣‍♀️', '🧗‍♂️', '🧗‍♀️', '🤼‍♂️', '🤼‍♀️', '🤺', '🏇', '🧘‍♂️', '🧘‍♀️'
  ];

  return (
    <div className="container mt-4">
      <h2>{id ? 'Kurs bearbeiten' : 'Neuen Kurs erstellen'}</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">Titel *</label>
          <input
            type="text"
            className="form-control"
            id="title"
            name="title"
            value={course.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="description" className="form-label">Beschreibung</label>
          <textarea
            className="form-control"
            id="description"
            name="description"
            rows="3"
            value={course.description}
            onChange={handleChange}
          ></textarea>
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label htmlFor="teacher" className="form-label">Leitung</label>
            <input
              type="text"
              className="form-control"
              id="teacher"
              name="teacher"
              value={course.teacher}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-6 mb-3">
            <label htmlFor="location" className="form-label">Ort</label>
            <input
              type="text"
              className="form-control"
              id="location"
              name="location"
              value={course.location}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label htmlFor="startDate" className="form-label">Anfangsdatum *</label>
            <input
              type="date"
              className="form-control"
              id="startDate"
              name="startDate"
              value={course.startDate}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6 mb-3">
            <label htmlFor="endDate" className="form-label">Enddatum *</label>
            <input
              type="date"
              className="form-control"
              id="endDate"
              name="endDate"
              value={course.endDate}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="row">
          <div className="col-md-4 mb-3">
            <label htmlFor="dayOfWeek" className="form-label">Wochentag</label>
            <select
              className="form-select"
              id="dayOfWeek"
              name="dayOfWeek"
              value={course.dayOfWeek}
              onChange={handleChange}
            >
              <option value="">Wählen...</option>
              <option value="Montag">Montag</option>
              <option value="Dienstag">Dienstag</option>
              <option value="Mittwoch">Mittwoch</option>
              <option value="Donnerstag">Donnerstag</option>
              <option value="Freitag">Freitag</option>
            </select>
          </div>
          <div className="col-md-4 mb-3">
            <label htmlFor="timeStart" className="form-label">Startzeit</label>
            <input
              type="time"
              className="form-control"
              id="timeStart"
              name="timeStart"
              value={course.timeStart}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-4 mb-3">
            <label htmlFor="timeEnd" className="form-label">Endzeit</label>
            <input
              type="time"
              className="form-control"
              id="timeEnd"
              name="timeEnd"
              value={course.timeEnd}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label htmlFor="targetClasses" className="form-label">Zielgruppe</label>
            <input
              type="text"
              className="form-control"
              id="targetClasses"
              name="targetClasses"
              value={course.targetClasses}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-6 mb-3">
            <label htmlFor="maxParticipants" className="form-label">Max. Teilnehmer</label>
            <input
              type="number"
              className="form-control"
              id="maxParticipants"
              name="maxParticipants"
              value={course.maxParticipants}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label htmlFor="status" className="form-label">Status</label>
            <select
              className="form-select"
              id="status"
              name="status"
              value={course.status}
              onChange={handleChange}
            >
              <option value="Angebot findet statt">Angebot findet statt</option>
              <option value="Angebot findet nicht statt">Angebot findet nicht statt</option>
              <option value="Nachmeldung offen bis Ende März">Nachmeldung offen bis Ende März</option>
            </select>
          </div>
          <div className="col-md-6 mb-3">
            <div className="form-check mt-4">
              <input
                className="form-check-input"
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={course.isActive}
                onChange={handleChange}
              />
              <label className="form-check-label" htmlFor="isActive">
                Aktiv
              </label>
            </div>
          </div>
        </div>

        <div className="mb-3">
          <label htmlFor="notes" className="form-label">Bemerkungen</label>
          <textarea
            className="form-control"
            id="notes"
            name="notes"
            rows="3"
            value={course.notes}
            onChange={handleChange}
          ></textarea>
        </div>

        <div className="d-grid gap-2 d-md-flex justify-content-md-end">
          <button
            type="button"
            className="btn btn-secondary me-md-2"
            onClick={() => navigate('/admin/courses')}
          >
            Abbrechen
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Speichern...' : 'Speichern'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CourseForm; 