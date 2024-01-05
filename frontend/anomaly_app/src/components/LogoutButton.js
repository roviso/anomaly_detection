// src/components/LogoutButton.js
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios
import { AuthContext } from '../context/AuthContext';

const LogoutButton = () => {
    const navigate = useNavigate();
    const { logout } = useContext(AuthContext);

    const handleLogout = async () => {
        try {
            // Send a request to the logout endpoint of your FastAPI application
            await axios.post('/logout', {}, { withCredentials: true });

            logout(); // Clear the authentication state
            navigate('/login'); // Redirect to the login page
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    return (
        <button onClick={handleLogout}>Logout</button>
    );
};

export default LogoutButton;
