// src/components/Login.js
import React, { useState, useContext } from 'react';
import axios from '../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/dashboard/users/login', { username, password });
            console.log("User data: ", response.data)
            login(response.data); // Update the global state with user data
            navigate('/dashboard'); // Redirect to the dashboard
        } catch (error) {
            console.error("Login failed", error.response); // Handle login error
        }
    };

    return (
        <div>
            <form onSubmit={handleLogin}>
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
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;
