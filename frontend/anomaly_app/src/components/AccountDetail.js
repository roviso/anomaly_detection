// src/components/AccountDetail.js
import React, { useEffect, useState, useContext } from 'react';
import axios from '../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './AccountDetail.css';

const AccountDetail = () => {
    const [userDetails, setUserDetails] = useState(null);
    const [password, setPassword] = useState(''); // New state for password
    const [editMode, setEditMode] = useState(false);
    const [csrfToken, setCsrfToken] = useState('');
    const { user } = useContext(AuthContext); // Access the logged-in user's details

    const navigate = useNavigate();

    useEffect(() => {

        if (!user) {
            navigate('/');
            return;
        }

        if (user && user.id) {
            axios.get('/dashboard/users/csrf_token', { withCredentials: true })
            .then(response => {
                setCsrfToken(response.data);
                console.log("Received CSRF token: ", response.data);
            })
            .catch(error => {
                console.error("Error fetching CSRF token", error.response);
            });
            
            fetchUserDetails(user.id);
        }
    }, [user, navigate]);

    const fetchUserDetails = async (userId) => {
        try {
            const response = await axios.get(`/dashboard/users/detail/${userId}`);
            setUserDetails(response.data);
        } catch (error) {
            console.error("Error fetching user details", error);
        }
    };

    const handleEdit = () => {
        setEditMode(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new URLSearchParams();
            formData.append('email', userDetails.email);
            formData.append('username', userDetails.username);
            formData.append('password', password); // Add password to form data

            // Add other fields as necessary

            const response = await axios.put(`/dashboard/users/${user.id}/update`, formData, {
                headers: {
                    'X-CSRF-TOKEN': csrfToken,
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                withCredentials: true,
            });

            setUserDetails(response.data);
            setEditMode(false);
            setPassword(''); // Clear password field after successful update
        } catch (error) {
            console.error("Error updating user details", error);
        }
    };

    const handleChange = (e) => {
        setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
    };

    if (!userDetails) return <div>Loading...</div>;

    return (
        <div className="account-details-container">
            <h1 className="account-details-header">Account Details</h1>
            {!editMode ? (
                <>
                    <p className="account-detail"><strong>Email:</strong> {userDetails.email}</p>
                    <p className="account-detail"><strong>Username:</strong> {userDetails.username}</p>
                    {/* Display other details */}
                    <button onClick={handleEdit}>Edit</button>
                </>
            ) : (
                <form onSubmit={handleSubmit} className="account-detail-form">
                    <label>
                        Email:
                        <input type="email" name="email" value={userDetails.email} onChange={handleChange} />
                    </label>
                    <label>
                        Username:
                        <input type="text" name="username" value={userDetails.username} onChange={handleChange} />
                    </label>
                    <label>
                        New Password:
                        <input type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="New password" />
                    </label>
                    <button type="submit">Save</button>
                </form>
            )}
        </div>
    );
};


export default AccountDetail;
