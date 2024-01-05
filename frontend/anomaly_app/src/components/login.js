import React, { useEffect, useState, useContext } from 'react';
import axios from '../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Login.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [csrfToken, setCsrfToken] = useState('');
    const [loginError, setLoginError] = useState('');

    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    // useEffect(() => {
    //     const fetchCsrfToken = async () => {
    //         try {
    //             const response = await axios.get('/dashboard/users/csrf_token');
    //             setCsrfToken(response.data);
    //             console.log("thois is csrf token:",response.data)
    //             axios.defaults.headers.common['X-CSRF-TOKEN'] = response.data;
    //         } catch (error) {
    //             console.error("Error fetching CSRF token", error.response);
    //         }
    //     };
    //     fetchCsrfToken();
    // }, []);
    useEffect(() => {
        axios.get('/dashboard/users/csrf_token', { withCredentials: true })
            .then(response => {
                setCsrfToken(response.data);
                console.log("Received response: ", response.data);
                // Extract CSRF token from the response if needed
            })
            .catch(error => {
                console.error("Error fetching CSRF token", error.response);
            });
    }, []);
    

    

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('username', username);
            formData.append('password', password);
    
            const response = await axios.post('dashboard/users/login', formData, {
                headers: {
                    'X-CSRF-TOKEN': csrfToken, // Set the CSRF token header
                    // 'Content-Type': 'multipart/form-data' is set automatically when using FormData
                },
                withCredentials: true, // Necessary to include cookies with the request
            });
    
            login(response.data); // Update the state/context
            navigate('/dashboard');
        } catch (error) {
            console.error("Login failed", error.response);
        }
    };

    return (
        <div className="container">
            <h2>Login</h2>
            {loginError && <p className="error">{loginError}</p>}
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
