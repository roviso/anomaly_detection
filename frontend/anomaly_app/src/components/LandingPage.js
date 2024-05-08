// src/components/LandingPage.js
import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-container">
      <h1>Hospital Management System</h1>
      <Link to="/login" className="landing-link">Login</Link>
      <Link to="/register" className="landing-link">Register</Link>
    </div>
  );
};

export default LandingPage;
