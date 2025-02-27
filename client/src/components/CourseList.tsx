import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './CourseList.css';

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
  notes: string;
  status: string;
}

const CourseList: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    targetGroup: '',
    day: ''
  });

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/courses');
        setCourses(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch courses');
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const filteredCourses = courses.filter(course => {
    return (
      (filters.targetGroup === '' || course.targetGroup.includes(filters.targetGroup)) &&
      (filters.day === '' || course.schedule.day === filters.day)
    );
  });

  if (loading) return <div className="loading">Loading courses...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="course-list-container">
      <h1>Sportangebote 2024/2025</h1>
      
      <div className="filters">
        <div className="filter-group">
          <label htmlFor="targetGroup">Zielgruppe:</label>
          <select 
            id="targetGroup" 
            name="targetGroup" 
            value={filters.targetGroup} 
            onChange={handleFilterChange}
          >
            <option value="">Alle</option>
            <option value="1">1. Klasse</option>
            <option value="2">2. Klasse</option>
            {/* Add more options */}
          </select>
        </div>
        
        <div className="filter-group">
          <label htmlFor="day">Tag:</label>
          <select 
            id="day" 
            name="day" 
            value={filters.day} 
            onChange={handleFilterChange}
          >
            <option value="">Alle</option>
            <option value="MO">Montag</option>
            <option value="DI">Dienstag</option>
            <option value="MI">Mittwoch</option>
            <option value="DO">Donnerstag</option>
            <option value="FR">Freitag</option>
          </select>
        </div>
      </div>
      
      <table className="courses-table">
        <thead>
          <tr>
            <th>Angebot</th>
            <th>Zielgruppe</th>
            <th>Wochentag/Zeit</th>
            <th>Beginn</th>
            <th>Ort</th>
            <th>Leitung</th>
            <th>max Plätze</th>
            <th>Status</th>
            <th>Aktion</th>
          </tr>
        </thead>
        <tbody>
          {filteredCourses.map(course => (
            <tr key={course._id} className={course.status === 'Angebot findet nicht statt' ? 'course-cancelled' : ''}>
              <td>{course.name}</td>
              <td>{course.targetGroup}</td>
              <td>{course.schedule.day} {course.schedule.time}</td>
              <td>{new Date(course.startDate).toLocaleDateString('de-CH')}</td>
              <td>{course.location}</td>
              <td>{course.instructors.join(', ')}</td>
              <td>{course.maxCapacity}</td>
              <td className={course.status === 'Angebot findet statt' ? 'status-active' : 'status-cancelled'}>
                {course.status}
              </td>
              <td>
                {course.status === 'Angebot findet statt' && (
                  <Link to={`/register/${course._id}`} className="btn-register">
                    Anmelden
                  </Link>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <div className="registration-info">
        <h3>Anmeldung:</h3>
        <ul>
          <li>Nach der Anmeldung ist die Teilnahme bis zum Ende des Semesters verpflichtend.</li>
          <li>Für den Kursbeginn werden keine weiteren Infos versendet.</li>
          <li>Falls ein Kurs aufgrund der Anmeldezahlen nicht stattfinden kann, werden die Angemeldeten kontaktiert.</li>
          <li>Anmeldeschluss: Freitag, 24. Januar 2025</li>
        </ul>
      </div>
    </div>
  );
};

export default CourseList; 