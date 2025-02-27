import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CourseList from './components/CourseList';
import RegistrationForm from './components/RegistrationForm';
import Login from './components/Login';
import TeacherDashboard from './components/TeacherDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <header className="app-header">
          <div className="logo">Schulsport Muri</div>
          <nav>
            <a href="/">Kurse</a>
            <a href="/login">Login</a>
          </nav>
        </header>
        
        <main className="app-content">
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
        </main>
        
        <footer className="app-footer">
          <p>&copy; 2023 Schulsport Muri. Alle Rechte vorbehalten.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App; 