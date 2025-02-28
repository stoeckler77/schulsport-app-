import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../utils/apiClient';
import { isAuthenticated, removeToken } from '../../utils/auth';
import CourseForm from './CourseForm';
import './AdminDashboard.css';
import axios from 'axios';

function AdminDashboard() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [currentCourse, setCurrentCourse] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [loadingRegistrations, setLoadingRegistrations] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    // Fetch current user and courses
    fetchCurrentUser();
    fetchCourses();
  }, [navigate]);

  useEffect(() => {
    // Add Bootstrap Icons if not already present
    if (!document.getElementById('bootstrap-icons')) {
      const link = document.createElement('link');
      link.id = 'bootstrap-icons';
      link.rel = 'stylesheet';
      link.href = 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css';
      document.head.appendChild(link);
    }
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const response = await api.get('/api/auth/me');
      setCurrentUser(response.data);
    } catch (err) {
      console.error('Error fetching current user:', err);
      // If unauthorized, redirect to login
      if (err.response && err.response.status === 401) {
        removeToken();
        navigate('/login');
      }
    }
  };

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/courses');
      setCourses(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError('Failed to load courses. Please try again later.');
      setLoading(false);
    }
  };

  const handleLogout = () => {
    removeToken();
    navigate('/login');
  };

  const handleStatusToggle = async (courseId, currentStatus) => {
    try {
      await api.patch(`/api/courses/${courseId}`, {
        isActive: !currentStatus
      });
      
      // Update local state
      setCourses(courses.map(course => 
        course._id === courseId 
          ? { ...course, isActive: !currentStatus } 
          : course
      ));
    } catch (err) {
      console.error('Error updating course status:', err);
      alert('Failed to update course status. Please try again.');
    }
  };

  const handleAddCourse = () => {
    setCurrentCourse(null);
    setShowForm(true);
  };

  const handleEditCourse = (course) => {
    setCurrentCourse(course);
    setShowForm(true);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setCurrentCourse(null);
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (currentCourse) {
        // Update existing course
        console.log('Updating course:', currentCourse._id, formData);
        const response = await api.put(`/api/courses/${currentCourse._id}`, formData);
        setCourses(courses.map(course => 
          course._id === currentCourse._id ? response.data : course
        ));
      } else {
        // Create new course
        console.log('Creating new course:', formData);
        const response = await api.post('/api/courses', formData);
        setCourses([...courses, response.data]);
      }
      
      setShowForm(false);
      setCurrentCourse(null);
    } catch (err) {
      console.error('Error saving course:', err);
      let errorMessage = 'Failed to save course. Please try again.';
      
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Response data:', err.response.data);
        console.error('Response status:', err.response.status);
        
        if (err.response.data && err.response.data.message) {
          errorMessage = err.response.data.message;
        }
      } else if (err.request) {
        // The request was made but no response was received
        console.error('Request:', err.request);
        errorMessage = 'No response from server. Please check your connection.';
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error message:', err.message);
      }
      
      alert(errorMessage);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      return;
    }
    
    try {
      await api.delete(`/api/courses/${courseId}`);
      setCourses(courses.filter(course => course._id !== courseId));
    } catch (err) {
      console.error('Error deleting course:', err);
      alert('Failed to delete course. Please try again.');
    }
  };

  const fetchRegistrations = async (courseId) => {
    setLoadingRegistrations(true);
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000';
      const response = await axios.get(`${apiUrl}/api/registrations/course/${courseId}`);
      setRegistrations(response.data);
      
      // Find the selected course details
      const course = courses.find(c => c._id === courseId);
      setSelectedCourse(course);
      
      setLoadingRegistrations(false);
    } catch (error) {
      console.error('Error fetching registrations:', error);
      setLoadingRegistrations(false);
    }
  };

  if (loading) return <div className="loading">Loading dashboard...</div>;

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>🏫 Admin Dashboard</h1>
        {currentUser && (
          <div className="user-info">
            <span>Welcome, {currentUser.name}</span>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm ? (
        <CourseForm 
          course={currentCourse} 
          onSubmit={handleFormSubmit} 
          onCancel={handleFormCancel} 
        />
      ) : (
        <>
          <div className="dashboard-actions">
            <button className="add-course-btn" onClick={handleAddCourse}>+ Add New Course</button>
          </div>

          <div className="courses-table-container">
            <h2>Manage Courses</h2>
            <table className="courses-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Target Group</th>
                  <th>Schedule</th>
                  <th>Location</th>
                  <th>Instructor</th>
                  <th>Max Participants</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="no-courses">No courses available</td>
                  </tr>
                ) : (
                  courses.map(course => (
                    <tr key={course._id}>
                      <td>{course.title}</td>
                      <td>{course.targetGroup}</td>
                      <td>{course.schedule}</td>
                      <td>{course.location}</td>
                      <td>{course.instructor}</td>
                      <td>{course.maxParticipants}</td>
                      <td>
                        <span className={`status-badge ${course.isActive ? 'active' : 'inactive'}`}>
                          {course.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="actions-cell">
                        <button 
                          className="status-toggle-btn"
                          onClick={() => handleStatusToggle(course._id, course.isActive)}
                        >
                          {course.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                        <button 
                          className="edit-btn"
                          onClick={() => handleEditCourse(course)}
                        >
                          Edit
                        </button>
                        <button 
                          className="delete-btn"
                          onClick={() => handleDeleteCourse(course._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-4 mb-5">
            <h3 className="mb-3">
              <i className="bi bi-people-fill me-2"></i>
              Kursanmeldungen anzeigen
            </h3>
            
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
              {courses && courses.map(course => (
                <div key={course._id} className="col">
                  <div className="card h-100 border-primary">
                    <div className="card-header bg-primary text-white">
                      <h5 className="card-title mb-0">{course.title}</h5>
                    </div>
                    <div className="card-body">
                      <p className="card-text">
                        <strong>Leitung:</strong> {course.teacher || 'Nicht angegeben'}
                      </p>
                      <p className="card-text">
                        <strong>Tag:</strong> {course.dayOfWeek || 'Nicht angegeben'}
                      </p>
                      <p className="card-text">
                        <strong>Zeit:</strong> {course.timeStart} - {course.timeEnd}
                      </p>
                    </div>
                    <div className="card-footer bg-transparent border-top">
                      <button 
                        className="btn btn-primary w-100"
                        onClick={() => fetchRegistrations(course._id)}
                      >
                        <i className="bi bi-list-ul me-2"></i>
                        Anmeldungen anzeigen
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5">
            <h2>
              <i className="bi bi-people-fill me-2"></i>
              Kursanmeldungen
            </h2>
            
            <div className="card mb-4">
              <div className="card-header bg-primary text-white">
                <h5 className="mb-0">Kurs auswählen</h5>
              </div>
              <div className="card-body">
                <select 
                  className="form-select mb-3"
                  onChange={(e) => {
                    if (e.target.value) {
                      fetchRegistrations(e.target.value);
                    } else {
                      setSelectedCourse(null);
                      setRegistrations([]);
                    }
                  }}
                  defaultValue=""
                >
                  <option value="">-- Kurs auswählen --</option>
                  {courses.map(course => (
                    <option key={course._id} value={course._id}>
                      {course.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {selectedCourse && (
              <div className="card mb-4">
                <div className="card-header bg-primary text-white">
                  <h5 className="mb-0">Kursdetails: {selectedCourse.title}</h5>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6">
                      <p><strong>Titel:</strong> {selectedCourse.title}</p>
                      <p><strong>Leitung:</strong> {selectedCourse.teacher}</p>
                      <p><strong>Ort:</strong> {selectedCourse.location}</p>
                    </div>
                    <div className="col-md-6">
                      <p>
                        <strong>Zeitraum:</strong> {selectedCourse.startDate ? new Date(selectedCourse.startDate).toLocaleDateString('de-CH') : ''} - {selectedCourse.endDate ? new Date(selectedCourse.endDate).toLocaleDateString('de-CH') : ''}
                      </p>
                      <p><strong>Tag & Zeit:</strong> {selectedCourse.dayOfWeek}, {selectedCourse.timeStart} - {selectedCourse.timeEnd}</p>
                      <p>
                        <strong>Status:</strong> 
                        <span className={`badge ms-2 ${selectedCourse.status === 'Angebot findet statt' ? 'bg-success' : selectedCourse.status === 'Angebot findet nicht statt' ? 'bg-danger' : 'bg-warning'}`}>
                          {selectedCourse.status}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {loadingRegistrations && (
              <div className="d-flex justify-content-center my-4">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            )}
            
            {selectedCourse && !loadingRegistrations && (
              <div className="card">
                <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Teilnehmerliste</h5>
                  <span className="badge bg-light text-dark">
                    {registrations.length} {registrations.length === 1 ? 'Teilnehmer' : 'Teilnehmer'}
                  </span>
                </div>
                <div className="card-body">
                  {registrations.length === 0 ? (
                    <div className="alert alert-info">
                      <i className="bi bi-info-circle me-2"></i>
                      Keine Anmeldungen für diesen Kurs vorhanden.
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-striped table-hover">
                        <thead className="table-light">
                          <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Klasse</th>
                            <th>AHV-Nummer</th>
                            <th>Geburtsdatum</th>
                            <th>Kontakt</th>
                            <th>Eltern</th>
                            <th>Anmeldedatum</th>
                          </tr>
                        </thead>
                        <tbody>
                          {registrations.map((registration, index) => (
                            <tr key={registration._id}>
                              <td>{index + 1}</td>
                              <td>
                                <strong>{registration.firstName} {registration.lastName}</strong>
                              </td>
                              <td>{registration.class}</td>
                              <td>{registration.ahvNumber || '-'}</td>
                              <td>
                                {registration.birthDate 
                                  ? new Date(registration.birthDate).toLocaleDateString('de-CH') 
                                  : '-'}
                              </td>
                              <td>
                                <div><small><i className="bi bi-envelope me-1"></i>{registration.email}</small></div>
                                <div><small><i className="bi bi-telephone me-1"></i>{registration.phone}</small></div>
                              </td>
                              <td>
                                <div>{registration.parentName}</div>
                                <div><small>{registration.parentContact}</small></div>
                              </td>
                              <td>
                                {new Date(registration.registrationDate).toLocaleDateString('de-CH')}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </>
      )}

      <style>
        {`
          .input-group-text {
            background-color: #f8f9fa;
            border-right: none;
          }
          
          .input-group .form-control {
            border-left: none;
          }
          
          input[type="date"] {
            padding: 0.5rem;
            border-radius: 0.25rem;
          }
          
          .form-label {
            font-weight: 500;
            margin-bottom: 0.5rem;
          }
          
          .text-muted {
            font-size: 0.875rem;
          }
          
          .bi {
            vertical-align: -0.125em;
          }
        `}
      </style>
    </div>
  );
}

export default AdminDashboard; 