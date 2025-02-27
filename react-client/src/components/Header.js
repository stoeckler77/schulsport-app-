import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
// No need to import the logo if using a URL

function Header() {
  return (
    <header className="header">
      <div className="logo-container">
        <Link to="/">
          <img 
            src="https://via.placeholder.com/150x50?text=Schulsport+Muri" 
            alt="Schulsport Muri Logo" 
            className="logo"
          />
        </Link>
      </div>
      <nav className="nav">
        <ul className="nav-list">
          <li className="nav-item">
            <Link to="/" className="nav-link">Home</Link>
          </li>
          <li className="nav-item">
            <Link to="/courses" className="nav-link">Kurse</Link>
          </li>
          <li className="nav-item">
            <Link to="/about" className="nav-link">Über uns</Link>
          </li>
          <li className="nav-item">
            <Link to="/contact" className="nav-link">Kontakt</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header; 