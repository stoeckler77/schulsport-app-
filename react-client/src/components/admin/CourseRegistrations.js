import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import './AdminStyles.css';

const CourseRegistrations = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [exportLoading, setExportLoading] = useState(false);

  useEffect(() => {
    fetchCourseAndRegistrations();
  }, [id]);

  const fetchCourseAndRegistrations = async () => {
    try {
      setLoading(true);
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000';
      
      // Fetch course details
      const courseResponse = await axios.get(`${apiUrl}/api/courses/${id}`);
      setCourse(courseResponse.data);
      
      // Fetch registrations for this course
      const registrationsResponse = await axios.get(`${apiUrl}/api/registrations/course/${id}`);
      setRegistrations(registrationsResponse.data);
      
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch data');
      setLoading(false);
      console.error(err);
    }
  };

  const exportToCSV = async () => {
    if (registrations.length === 0) return;
    
    setExportLoading(true);
    
    try {
      // Create CSV content
      const headers = ['Vorname', 'Nachname', 'Email', 'Telefon', 'Klasse', 'AHV-Nummer', 'Geburtsdatum', 'Eltern', 'Kontakt Eltern', 'Bemerkungen', 'Anmeldedatum'];
      
      let csvContent = headers.join(',') + '\n';
      
      registrations.forEach(reg => {
        const birthDate = reg.birthDate ? new Date(reg.birthDate).toLocaleDateString('de-CH') : '';
        const regDate = new Date(reg.registrationDate).toLocaleDateString('de-CH');
        
        // Escape commas in text fields
        const row = [
          `"${reg.firstName}"`,
          `"${reg.lastName}"`,
          `"${reg.email}"`,
          `"${reg.phone}"`,
          `"${reg.class}"`,
          `"${reg.ahvNumber || ''}"`,
          `"${birthDate}"`,
          `"${reg.parentName}"`,
          `"${reg.parentContact}"`,
          `"${reg.comments ? reg.comments.replace(/"/g, '""') : ''}"`,
          `"${regDate}"`
        ];
        
        csvContent += row.join(',') + '\n';
      });
      
      // Create download link
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `${course.title}_teilnehmer.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setExportLoading(false);
    } catch (err) {
      console.error('Export error:', err);
      setExportLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="d-flex justify-content-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>
          <i className="bi bi-people-fill me-2"></i>
          Anmeldungen: {course?.title}
        </h2>
        <div>
          <Link to="/admin/courses" className="btn btn-secondary me-2">
            <i className="bi bi-arrow-left"></i> Zurück
          </Link>
          <button 
            className="btn btn-success" 
            onClick={exportToCSV}
            disabled={exportLoading || registrations.length === 0}
          >
            {exportLoading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Exportieren...
              </>
            ) : (
              <>
                <i className="bi bi-file-earmark-excel me-2"></i>
                Als CSV exportieren
              </>
            )}
          </button>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">Kursdetails</h5>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <p><strong>Titel:</strong> {course?.title}</p>
              <p><strong>Leitung:</strong> {course?.teacher}</p>
              <p><strong>Ort:</strong> {course?.location}</p>
            </div>
            <div className="col-md-6">
              <p>
                <strong>Zeitraum:</strong> {course?.startDate ? new Date(course.startDate).toLocaleDateString('de-CH') : ''} - {course?.endDate ? new Date(course.endDate).toLocaleDateString('de-CH') : ''}
              </p>
              <p><strong>Tag & Zeit:</strong> {course?.dayOfWeek}, {course?.timeStart} - {course?.timeEnd}</p>
              <p>
                <strong>Status:</strong> 
                <span className={`badge ms-2 ${course?.status === 'Angebot findet statt' ? 'bg-success' : course?.status === 'Angebot findet nicht statt' ? 'bg-danger' : 'bg-warning'}`}>
                  {course?.status}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

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
    </div>
  );
};

export default CourseRegistrations; 