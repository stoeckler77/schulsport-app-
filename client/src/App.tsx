import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CourseList from './components/CourseList';
import RegistrationForm from './components/RegistrationForm';
import TeacherDashboard from './components/TeacherDashboard';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CourseList />} />
        <Route path="/register/:courseId" element={<RegistrationForm />} />
        <Route path="/login" element={<Login />} />
        <Route 
          path="/teacher/dashboard" 
          element={
            <ProtectedRoute role="teacher">
              <TeacherDashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App; 