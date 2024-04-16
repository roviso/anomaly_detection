// Confirmation.js
import React, { useEffect, useState } from 'react';
import axios from '../utils/axiosConfig';
import { useNavigate, useParams } from 'react-router-dom';
import './Confirmation.css';

const Confirmation = () => {
    const [confirmationMessage, setConfirmationMessage] = useState('');
    const [confirmationError, setConfirmationError] = useState('');
    const { registrationToken } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const confirmRegistration = async () => {
            try {
                await axios.get(`/dashboard/users/register-confirmation/${registrationToken}`, { withCredentials: true });
                setConfirmationMessage('Registration completed successfully. You can now login.');
            } catch (error) {
                setConfirmationError('Invalid registration token. Please try again.');
                console.error('Confirmation error:', error.response);
            }
        };

        confirmRegistration();
    }, [registrationToken]);

    return (
        <div className="confirmation-container">
            <h2>Email Confirmation</h2>
            {confirmationError && <p className="error">{confirmationError}</p>}
            {confirmationMessage && <p className="confirmation">{confirmationMessage}</p>}
            {confirmationMessage && <button onClick={() => navigate('/login')}>Go to Login</button>}
        </div>
    );
};

export default Confirmation;
