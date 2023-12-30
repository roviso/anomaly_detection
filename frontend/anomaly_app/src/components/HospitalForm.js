// src/components/HospitalForm.js
import React, { useState } from 'react';
import axios from '../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';

const HospitalForm = () => {
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/dashboard/hospitals/hospitals/create', {
                name,
                address
            });
            navigate('/dashboard'); // Redirect to the dashboard after creation
        } catch (error) {
            console.error("Error creating hospital", error);
            // Handle creation error
        }
    };

    return (
        <div>
            <h1>Add New Hospital</h1>
            <form onSubmit={handleSubmit}>
                <input 
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Hospital Name"
                    required
                />
                <input 
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Address"
                    required
                />
                <button type="submit">Create Hospital</button>
            </form>
        </div>
    );
};

export default HospitalForm;
