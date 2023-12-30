// src/components/HospitalEdit.js
import React, { useEffect, useState } from 'react';
import axios from '../utils/axiosConfig';
import { useParams, useNavigate } from 'react-router-dom';

const HospitalEdit = () => {
    const [hospital, setHospital] = useState({ name: '', address: '' });
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch the current details of the hospital
        const fetchHospitalDetails = async () => {
            try {
                const response = await axios.get(`/dashboard/hospitals/profile/detail/${id}`);
                setHospital(response.data);
            } catch (error) {
                console.error("Error fetching hospital details", error);
            }
        };
        fetchHospitalDetails();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`/dashboard/hospitals/hospitals/${id}/update`, hospital);
            navigate('/dashboard'); // Redirect to dashboard after successful update
        } catch (error) {
            console.error("Error updating hospital", error);
        }
    };

    return (
        <div>
            <h1>Edit Hospital</h1>
            <form onSubmit={handleSubmit}>
                <input 
                    type="text"
                    value={hospital.name}
                    onChange={(e) => setHospital({ ...hospital, name: e.target.value })}
                    placeholder="Hospital Name"
                    required
                />
                <input 
                    type="text"
                    value={hospital.address}
                    onChange={(e) => setHospital({ ...hospital, address: e.target.value })}
                    placeholder="Address"
                    required
                />
                <button type="submit">Update Hospital</button>
            </form>
        </div>
    );
};

export default HospitalEdit;
