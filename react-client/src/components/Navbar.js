import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // Make sure to create this CSS file
// Import the logo directly from assets
// import schuleMuriLogo from '../assets/schule-muri-logo.png';

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          {/* Inline SVG logo based on the red Schule Muri logo */}
          <div className="logo-container me-2">
            <svg 
              width="150" 
              height="40" 
              viewBox="0 0 400 100" 
              xmlns="http://www.w3.org/2000/svg"
              className="logo-svg"
            >
              <rect width="400" height="100" fill="#c1121f" />
              <path d="M50,20 v40 h20 v-20 h20 v-20 h-40" fill="white" />
              <path d="M90,20 v40 h20 v-20 h20 v-20 h-40" fill="white" />
              <path d="M130,20 v40 h20 v-20 h20 v-20 h-40" fill="white" />
              <path d="M170,20 h180 v60 h-350 v-20 h170 v-40" fill="white" />
              <text x="200" y="40" font-family="Arial" font-size="16" fill="white" text-anchor="middle">SCHULE</text>
              <text x="240" y="70" font-family="Arial" font-size="24" font-weight="bold" fill="#c1121f" text-anchor="middle">MURI</text>
            </svg>
          </div>
          <span>Schulsport App</span>
        </Link>
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav" 
          aria-controls="navbarNav" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/courses">Kurse</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 