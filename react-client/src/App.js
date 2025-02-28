import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Login from './components/Login';
import CourseList from './components/CourseList';
import AdminDashboard from './components/admin/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import CourseRegistrations from './components/admin/CourseRegistrations';

function App() {
  return (
    <Router>
      <div className="app">
        <header className="app-header">
          <div className="logo">
            <img src="/schule-muri-logo.png" alt="Schule Muri Logo" className="school-logo" />
          </div>
          <nav>
            <Link to="/">Kurse</Link>
            <Link to="/login">Login</Link>
          </nav>
        </header>
        
        <main className="app-content">
          <Routes>
            <Route path="/" element={
              <div className="landing-page">
                <h1>🏃‍♂️ Freiwilliger Schulsport 🏃‍♀️</h1>
                <h2>Freiwilliger SchulSport Schule Muri 2024/2025</h2>
                
                <div className="intro-text">
                  <p>Der freiwillige Schulsport ist das Bindeglied zwischen obligatorischem Sportunterricht in der Schule und freiwilligem Vereinssport.</p>
                  <p>Ziel ist es, möglichst viele Kinder und Jugendliche durch den freiwilligen Sport in der Schule für den Vereinssport zu begeistern.</p>
                </div>
                
                <div className="info-section">
                  <h3>📋 Das Wichtigste in Kürze:</h3>
                  <ul>
                    <li><strong>👨‍🏫 Leitung:</strong> Anerkannte J+S-Leiterpersonen aus Vereinen und der Schule.</li>
                    <li><strong>💰 Kosten:</strong> Die Kurse sind kostenlos.</li>
                    <li><strong>🗓️ Kursgebinn:</strong> Die Kurse beginnen am angegebenen Startdatum.</li>
                    <li><strong>⏱️ Dauer:</strong> Die Kurse dauern ein Semester (mindestens 15 Lektionen à 60 Minuten).</li>
                    <li><strong>🔒 Versicherung:</strong> Die Versicherung ist Sache der Teilnehmenden.</li>
                  </ul>
                  
                  <h3>✍️ Anmeldung:</h3>
                  <ul>
                    <li>Nach der Anmeldung ist die Teilnahme bis zum Ende des Semesters verpflichtend.</li>
                    <li>Für den Kursbeginn werden keine weiteren Infos versendet. (Ausnahme Tennis: die Einteilung erfolgt nach Anmeldeschluss und wird über Klapp kommuniziert)</li>
                    <li>Falls ein Kurs aufgrund der Anmeldezahlen nicht stattfinden kann, werden die Angemeldeten kontaktiert.</li>
                  </ul>
                  
                  <p><strong>⏰ Anmeldeschluss:</strong> Freitag, 24. Januar 2025</p>
                  
                  <h3>📞 Kontakt:</h3>
                  <ul>
                    <li><strong>📧 schulverwaltung@schulemuri.ch; 📱 056 675 72 80</strong> - bei administrativen Anliegen</li>
                    <li><strong>📧 schneider.martin@schulemuri.ch</strong> oder <strong>📧 schaerer.nathanael@schulemuri.ch</strong> - bei inhaltlichen Fragen</li>
                  </ul>
                </div>
                
                <CourseList />
              </div>
            } />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/courses/:id/registrations" element={<CourseRegistrations />} />
          </Routes>
        </main>
        
        <footer className="app-footer">
          <p>&copy; 2025 Schulsport Muri. Alle Rechte vorbehalten. 🏫</p>
          <p>Made with ❤️ in Besenbüren.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
