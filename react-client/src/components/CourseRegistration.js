import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './CourseRegistration.css';

const CourseRegistration = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    class: '',
    ahvNumber: '',
    birthDate: '',
    parentName: '',
    parentContact: '',
    comments: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000';
      await axios.post(`${apiUrl}/api/registrations`, {
        ...formData,
        courseId: id
      });
      setSuccess(true);
      setLoading(false);
      setTimeout(() => {
        navigate('/registration-success');
      }, 2000);
    } catch (err) {
      setLoading(false);
      setError('Registration failed. Please try again.');
      console.error('Registration error:', err);
    }
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h3 className="mb-0">Kursanmeldung</h3>
            </div>
            <div className="card-body">
              {success ? (
                <div className="alert alert-success">
                  Anmeldung erfolgreich! Sie werden weitergeleitet...
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="firstName" className="form-label">Vorname *</label>
                      <input
                        type="text"
                        className="form-control"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="lastName" className="form-label">Nachname *</label>
                      <input
                        type="text"
                        className="form-control"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="email" className="form-label">Email *</label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="phone" className="form-label">Telefon *</label>
                      <input
                        type="tel"
                        className="form-control"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="class" className="form-label">Klasse *</label>
                      <input
                        type="text"
                        className="form-control"
                        id="class"
                        name="class"
                        value={formData.class}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="ahvNumber" className="form-label">AHV-Nummer *</label>
                      <input
                        type="text"
                        className="form-control"
                        id="ahvNumber"
                        name="ahvNumber"
                        placeholder="756.xxxx.xxxx.xx"
                        value={formData.ahvNumber}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="birthDate" className="form-label">Geburtsdatum *</label>
                    <input
                      type="date"
                      className="form-control"
                      id="birthDate"
                      name="birthDate"
                      value={formData.birthDate}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="parentName" className="form-label">Name der Eltern *</label>
                      <input
                        type="text"
                        className="form-control"
                        id="parentName"
                        name="parentName"
                        value={formData.parentName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="parentContact" className="form-label">Kontakt der Eltern *</label>
                      <input
                        type="text"
                        className="form-control"
                        id="parentContact"
                        name="parentContact"
                        value={formData.parentContact}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="comments" className="form-label">Bemerkungen</label>
                    <textarea
                      className="form-control"
                      id="comments"
                      name="comments"
                      rows="3"
                      value={formData.comments}
                      onChange={handleChange}
                    ></textarea>
                  </div>

                  {error && <div className="alert alert-danger">{error}</div>}

                  <div className="d-grid gap-2">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={loading}
                    >
                      {loading ? 'Wird gesendet...' : 'Anmelden'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseRegistration; 