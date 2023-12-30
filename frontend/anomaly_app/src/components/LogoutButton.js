// src/components/LogoutButton.js
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const LogoutButton = () => {
    const navigate = useNavigate();
    const { logout } = useContext(AuthContext);

    const handleLogout = () => {
        logout(); // Clear the authentication state
        navigate('/login'); // Redirect to the login page
    };

    return (
        <button onClick={handleLogout}>Logout</button>
    );
};

export default LogoutButton;
