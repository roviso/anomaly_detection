// import React, { useEffect, useState } from 'react';
// import axios from '../utils/axiosConfig';
// import { useNavigate } from 'react-router-dom';
// import './Register.css';

// const Register = () => {
//     const [email, setEmail] = useState('');
//     const [username, setUsername] = useState('');
//     const [password, setPassword] = useState('');
//     const [csrfToken, setCsrfToken] = useState('');
//     const [registerError, setRegisterError] = useState('');

//     const navigate = useNavigate();

//     useEffect(() => {
//         axios.get('/dashboard/users/csrf_token', { withCredentials: true })
//             .then(response => {
//                 setCsrfToken(response.data);
//                 console.log("Received CSRF token: ", response.data);
//             })
//             .catch(error => {
//                 console.error("Error fetching CSRF token", error.response);
//             });
//     }, []);

//     const handleRegister = async (e) => {
//         e.preventDefault();
//         try {
//             // Use URLSearchParams or FormData to encode the data as form data
//             const formData = new URLSearchParams();
//             formData.append('email', email);
//             formData.append('username', username);
//             formData.append('password', password);
//             console.log("Using csrfToken: ",csrfToken);

//             const response = await axios.post('/dashboard/users/create', formData, {
//                 headers: {
//                     'X-CSRF-TOKEN': csrfToken
//                 },
//                 withCredentials: true,
//             });

//             console.log("Registration successful", response.data);
//             navigate('/login');
//         } catch (error) {
//             setRegisterError('Registration failed. Please try again.');
//             console.error("Registration failed", error.response);
//         }
//     };

//     return (
//         <div className="register-container">
//             <h2>Register</h2>
//             {registerError && <p className="error">{registerError}</p>}
//             <form onSubmit={handleRegister}>
//                 <input 
//                     type="email" 
//                     value={email} 
//                     onChange={(e) => setEmail(e.target.value)} 
//                     placeholder="Email" 
//                     required 
//                 />
//                 <input 
//                     type="text" 
//                     value={username} 
//                     onChange={(e) => setUsername(e.target.value)} 
//                     placeholder="Username" 
//                     required 
//                 />
//                 <input 
//                     type="password" 
//                     value={password} 
//                     onChange={(e) => setPassword(e.target.value)} 
//                     placeholder="Password" 
//                     required 
//                 />
//                 <button type="submit">Register</button>
//             </form>
//         </div>
//     );
// };

// export default Register;

// import React, { useEffect, useState } from 'react';
// import axios from '../utils/axiosConfig';
// import { useNavigate } from 'react-router-dom';
// import './Register.css';

// const Register = () => {
//     const [csrfToken, setCsrfToken] = useState('');
//     const [registerError, setRegisterError] = useState('');

//     const navigate = useNavigate();

//     useEffect(() => {
//         axios.get('/dashboard/users/csrf_token', { withCredentials: true })
//             .then(response => {
//                 setCsrfToken(response.data);
//                 console.log("Received CSRF token: ", response.data);
//             })
//             .catch(error => {
//                 console.error("Error fetching CSRF token", error.response);
//             });

//         // Initialize Google Sign-In
//         window.gapi.load('auth2', () => {
//             window.gapi.auth2.init({
//                 client_id: '579884707101-g1p3u00e5hth3pel5h1mmui5dt76aol9.apps.googleusercontent.com',
//             });
//         });
//     }, []);

//     const handleGoogleSignIn = async () => {
//         const auth2 = window.gapi.auth2.getAuthInstance();
//         console.log(auth2,"auth2")
//         try {
//             const googleUser = await auth2.signIn();
//             console.log(googleUser,"googleUser")
//             const id_token = googleUser.getAuthResponse().id_token;
//             console.log(id_token,"id_token")
//             // Send this id_token to your backend
//             const response = await axios.post('/dashboard/users/create', { token: id_token }, {
//                 headers: {
//                     'X-CSRF-TOKEN': csrfToken
//                 },
//                 withCredentials: true,
//             });
    
//             console.log("Google sign-in successful", response.data);
//             navigate('/login');
//         } catch (error) {
//             if (error.error === 'popup_closed_by_user') {
//                 setRegisterError('Google sign-in was cancelled by the user.');
//             } else {
//                 setRegisterError('Google sign-in failed. Please try again.');
//             }
//             console.error("Google sign-in failed", error);
//         }
//     };

//     return (
//         <div className="register-container">
//             <h2>Register</h2>
//             {registerError && <p className="error">{registerError}</p>}
//             <button onClick={handleGoogleSignIn} className="google-sign-in">
//                 Sign in with Google
//             </button>
//         </div>
//     );
// };

// export default Register;


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
    const [confirmationMessage, setConfirmationMessage] = useState('');

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
            const userData = {
                email: email,
                username: username,
                password: password
            };

            const response = await axios.post('/dashboard/users/register', userData, {
                headers: {
                    'Content-Type': 'application/json' // Set content type to JSON
                },
                withCredentials: true
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
            {confirmationMessage && <p className="confirmation">{confirmationMessage}</p>}
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
