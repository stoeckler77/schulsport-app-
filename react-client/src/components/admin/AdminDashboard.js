import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../utils/apiClient';
import { isAuthenticated, removeToken } from '../../utils/auth';
import CourseForm from './CourseForm';
import './AdminDashboard.css';

function AdminDashboard() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [currentCourse, setCurrentCourse] = useState(null);
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

          <div className="mt-4">
            <h3>Kursanmeldungen anzeigen</h3>
            <div className="list-group">
              {courses && courses.map(course => (
                <Link 
                  key={course._id}
                  to={`/admin/courses/${course._id}/registrations`}
                  className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                >
                  {course.title}
                  <span className="badge bg-primary rounded-pill">
                    <i className="bi bi-people me-1"></i>
                    Anmeldungen
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <button 
            className="btn btn-secondary mb-3"
            onClick={() => {
              // Fetch courses and log their IDs
              const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000';
              fetch(`${apiUrl}/api/courses`)
                .then(response => response.json())
                .then(courses => {
                  console.log('Course IDs:');
                  courses.forEach(course => {
                    console.log(`${course.title}: ${course._id}`);
                  });
                  alert('Course IDs logged to console. Press F12 to view.');
                })
                .catch(error => {
                  console.error('Error fetching courses:', error);
                  alert('Error fetching courses. Check console for details.');
                });
            }}
          >
            Debug: Show Course IDs
          </button>
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