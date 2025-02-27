import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import './CourseList.css';

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get('/courses');
        setCourses(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch courses');
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) return <div className="loading">Loading courses...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="course-list-container">
      <h1>Schulsport Muri Angebote</h1>
      
      <div className="course-list">
        {courses.map(course => (
          <div key={course._id} className="course-card">
            <h2>{course.name}</h2>
            <div className="course-details">
              <p><strong>Zielgruppe:</strong> {course.targetGroup}</p>
              <p><strong>Zeitplan:</strong> {course.schedule.day} {course.schedule.time}</p>
              <p><strong>Ort:</strong> {course.location}</p>
              <p><strong>Leitung:</strong> {course.instructors.join(', ')}</p>
              <p><strong>Status:</strong> {course.status}</p>
              <p><strong>Anmeldeschluss:</strong> {new Date(course.registrationDeadline).toLocaleDateString('de-CH')}</p>
            </div>
            {course.notes && (
              <div className="course-notes">
                <p>{course.notes}</p>
              </div>
            )}
            <div className="course-actions">
              <Link to={`/register/${course._id}`} className="btn-register">
                Anmelden
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseList; 