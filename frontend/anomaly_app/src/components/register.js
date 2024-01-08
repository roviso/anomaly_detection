import React, { useEffect, useState } from 'react';
import axios from '../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';
import './Register.css';

const Register = () => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [csrfToken, setCsrfToken] = useState('');
    const [registerError, setRegisterError] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        axios.get('/dashboard/users/csrf_token', { withCredentials: true })
            .then(response => {
                setCsrfToken(response.data);
                console.log("Received CSRF token: ", response.data);
            })
            .catch(error => {
                console.error("Error fetching CSRF token", error.response);
            });
    }, []);

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            // Use URLSearchParams or FormData to encode the data as form data
            const formData = new URLSearchParams();
            formData.append('email', email);
            formData.append('username', username);
            formData.append('password', password);

            const response = await axios.post('/dashboard/users/create', formData, {
                headers: {
                    'X-CSRF-TOKEN': csrfToken
                },
                withCredentials: true,
            });

            console.log("Registration successful", response.data);
            navigate('/login');
        } catch (error) {
            setRegisterError('Registration failed. Please try again.');
            console.error("Registration failed", error.response);
        }
    };

    return (
        <div className="register-container">
            <h2>Register</h2>
            {registerError && <p className="error">{registerError}</p>}
            <form onSubmit={handleRegister}>
                <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    placeholder="Email" 
                    required 
                />
                <input 
                    type="text" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                    placeholder="Username" 
                    required 
                />
                <input 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    placeholder="Password" 
                    required 
                />
                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default Register;
