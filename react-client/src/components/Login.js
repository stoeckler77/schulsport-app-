import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/apiClient';
import { setToken } from '../utils/auth';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      console.log('Attempting login with:', { email, password });
      const response = await api.post('/api/auth/login', { email, password });
      console.log('Login response:', response.data);
      
      // Store the token
      setToken(response.data.token);
      
      // Redirect to admin dashboard
      navigate('/admin');
    } catch (err) {
      console.error('Login error:', err);
      
      let errorMessage = 'Login fehlgeschlagen: Unbekannter Fehler';
      
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Response data:', err.response.data);
        console.error('Response status:', err.response.status);
        
        if (err.response.data && err.response.data.message) {
          errorMessage = `Login fehlgeschlagen: ${err.response.data.message}`;
        } else if (err.response.status === 401) {
          errorMessage = 'Login fehlgeschlagen: Ungültige Anmeldeinformationen';
        } else if (err.response.status === 404) {
          errorMessage = 'Login fehlgeschlagen: Server-Endpunkt nicht gefunden';
        } else if (err.response.status >= 500) {
          errorMessage = 'Login fehlgeschlagen: Serverfehler';
        }
      } else if (err.request) {
        // The request was made but no response was received
        console.error('Request:', err.request);
        errorMessage = 'Login fehlgeschlagen: Keine Antwort vom Server. Bitte überprüfen Sie Ihre Verbindung.';
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error message:', err.message);
        errorMessage = `Login fehlgeschlagen: ${err.message}`;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Admin Login</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Passwort</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Wird eingeloggt...' : 'Einloggen'}
          </button>
        </form>
        
        <div className="login-info">
          <p>Bitte geben Sie Ihre Admin-Anmeldeinformationen ein.</p>
          <p>Bei Problemen wenden Sie sich an den Administrator.</p>
        </div>
      </div>
    </div>
  );
}

export default Login; 