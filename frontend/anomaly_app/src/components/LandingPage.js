// LandingPage.js
import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <main className="landing">
      <h1 className="landing__title">Hospital Management System</h1>
      <Link to="/login" className="landing__link">Login</Link>
      <Link to="/register" className="landing__link">Register</Link>
    </main>
  );
};

export default LandingPage;