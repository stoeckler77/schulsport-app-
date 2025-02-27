import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TeacherDashboard.css';

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
  maxCapacity: number;
  status: string;
}

interface Registration {
  _id: string;
  studentName: string;
  class: string;
  parentName: string;
  email: string;
  phone: string;
  registrationDate: Date;
  status: string;
  attendance: Array<{
    date: Date;
    present: boolean;
    notes?: string;
  }>;
}

const TeacherDashboard: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getToken = () => {
    try {
      return localStorage.getItem('token');
    } catch (error) {
      console.warn('localStorage not available');
      return null;
    }
  };

  useEffect(() => {
    const fetchTeacherCourses = async () => {
      try {
        setLoading(true);
        const token = getToken();
        
        // If no token is available, you might want to redirect to login
        if (!token) {
          setError('Authentication required');
          setLoading(false);
          return;
        }
        
        const response = await axios.get('http://localhost:5000/api/courses/teacher', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setCourses(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch courses');
        setLoading(false);
      }
    };

    fetchTeacherCourses();
  }, []);

  useEffect(() => {
    const fetchRegistrations = async () => {
      if (!selectedCourse) return;
      
      try {
        setLoading(true);
        const token = getToken();
        const response = await axios.get(`http://localhost:5000/api/registrations/course/${selectedCourse._id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setRegistrations(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch registrations');
        setLoading(false);
      }
    };

    if (selectedCourse) {
      fetchRegistrations();
    }
  }, [selectedCourse]);

  const handleCourseSelect = (course: Course) => {
    setSelectedCourse(course);
  };

  const handleAttendanceChange = (registrationId: string, date: Date, present: boolean) => {
    // Update attendance in the UI
    setRegistrations(prevRegistrations => 
      prevRegistrations.map(reg => {
        if (reg._id === registrationId) {
          const existingAttendanceIndex = reg.attendance.findIndex(
            a => new Date(a.date).toDateString() === new Date(date).toDateString()
          );
          
          let updatedAttendance = [...reg.attendance];
          
          if (existingAttendanceIndex >= 0) {
            updatedAttendance[existingAttendanceIndex] = {
              ...updatedAttendance[existingAttendanceIndex],
              present
            };
          } else {
            updatedAttendance.push({
              date,
              present
            });
          }
          
          return {
            ...reg,
            attendance: updatedAttendance
          };
        }
        return reg;
      })
    );
    
    // Send update to server
    const token = getToken();
    axios.post(`http://localhost:5000/api/registrations/${registrationId}/attendance`, {
      date,
      present
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).catch(err => {
      console.error('Failed to update attendance', err);
    });
  };

  if (loading && !selectedCourse) return <div className="loading">Loading courses...</div>;
  if (error && !selectedCourse) return <div className="error">{error}</div>;

  return (
    <div className="teacher-dashboard">
      <h1>Lehrer Dashboard</h1>
      
      <div className="dashboard-layout">
        <div className="sidebar">
          <h3>Meine Kurse</h3>
          <ul className="course-list">
            {courses.map(course => (
              <li 
                key={course._id} 
                className={selectedCourse?._id === course._id ? 'active' : ''}
                onClick={() => handleCourseSelect(course)}
              >
                {course.name} - {course.schedule.day} {course.schedule.time}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="main-content">
          {selectedCourse ? (
            <>
              <h2>{selectedCourse.name}</h2>
              <div className="course-details">
                <p><strong>Zielgruppe:</strong> {selectedCourse.targetGroup}</p>
                <p><strong>Zeit:</strong> {selectedCourse.schedule.day} {selectedCourse.schedule.time}</p>
                <p><strong>Ort:</strong> {selectedCourse.location}</p>
                <p><strong>Status:</strong> {selectedCourse.status}</p>
                <p><strong>Anmeldungen:</strong> {registrations.length} / {selectedCourse.maxCapacity}</p>
              </div>
              
              <h3>Teilnehmerliste</h3>
              {loading ? (
                <div className="loading">Loading registrations...</div>
              ) : error ? (
                <div className="error">{error}</div>
              ) : registrations.length === 0 ? (
                <p>Keine Anmeldungen vorhanden.</p>
              ) : (
                <table className="registrations-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Klasse</th>
                      <th>Eltern</th>
                      <th>Kontakt</th>
                      <th>Status</th>
                      <th>Anwesenheit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {registrations.map(registration => (
                      <tr key={registration._id}>
                        <td>{registration.studentName}</td>
                        <td>{registration.class}</td>
                        <td>{registration.parentName}</td>
                        <td>
                          <a href={`mailto:${registration.email}`}>{registration.email}</a>
                          <br />
                          <a href={`tel:${registration.phone}`}>{registration.phone}</a>
                        </td>
                        <td>{registration.status}</td>
                        <td>
                          <div className="attendance-tracker">
                            {/* Generate attendance checkboxes for the last 4 course dates */}
                            {Array.from({ length: 4 }).map((_, index) => {
                              const date = new Date(selectedCourse.startDate);
                              date.setDate(date.getDate() + (index * 7)); // Weekly
                              
                              const attendanceRecord = registration.attendance.find(
                                a => new Date(a.date).toDateString() === date.toDateString()
                              );
                              
                              return (
                                <div key={index} className="attendance-date">
                                  <label>
                                    <input 
                                      type="checkbox"
                                      checked={attendanceRecord?.present || false}
                                      onChange={(e) => handleAttendanceChange(
                                        registration._id,
                                        date,
                                        e.target.checked
                                      )}
                                    />
                                    {date.toLocaleDateString('de-CH')}
                                  </label>
                                </div>
                              );
                            })}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </>
          ) : (
            <p>Bitte wählen Sie einen Kurs aus der Liste.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard; 