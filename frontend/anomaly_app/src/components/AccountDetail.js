// src/components/AccountDetail.js
import React, { useEffect, useState, useContext } from 'react';
import axios from '../utils/axiosConfig';
import './AccountDetail.css';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const AccountDetail = () => {
    const [userDetails, setUserDetails] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const { user } = useContext(AuthContext); // Access the logged-in user's details

    const navigate = useNavigate();

    useEffect(() => {
        if (!user){
            navigate('/');
            return;
        } 
    
        if (user && user.id) {
            console.log(user)
            fetchUserDetails(user.id);
        }
    }, [user,navigate]);

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
            const response = await axios.put(`/dashboard/users/${user.id}/update`, userDetails);
            setUserDetails(response.data);
            setEditMode(false);
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
                <form onSubmit={handleSubmit}>
                    <input type="email" name="email" value={userDetails.email} onChange={handleChange} />
                    <input type="text" name="username" value={userDetails.username} onChange={handleChange} />
                    {/* Include other fields as necessary */}
                    <button type="submit">Save</button>
                </form>
            )}
        </div>
    );
};

export default AccountDetail;
