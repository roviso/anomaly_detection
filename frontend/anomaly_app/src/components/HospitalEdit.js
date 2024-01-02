// src/components/HospitalEdit.js
import React, { useEffect, useState } from 'react';
import axios from '../utils/axiosConfig';
import { useParams, useNavigate } from 'react-router-dom';
import './HospitalEdit.css';

const HospitalEdit = () => {
    const [hospital, setHospital] = useState({ name: '', address: '', available_icu_beds: 0, available_ventilators: 0, available_isolation_beds: 0, oxygen_support_available: false });
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
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
            navigate('/dashboard');
        } catch (error) {
            console.error("Error updating hospital", error);
        }
    };

    return (
        <div className="container">
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
                <input 
                    type="number"
                    value={hospital.available_icu_beds}
                    onChange={(e) => setHospital({ ...hospital, available_icu_beds: parseInt(e.target.value, 10) })}
                    placeholder="Available ICU Beds"
                    required
                />
                <input 
                    type="number"
                    value={hospital.available_ventilators}
                    onChange={(e) => setHospital({ ...hospital, available_ventilators: parseInt(e.target.value, 10) })}
                    placeholder="Available Ventilators"
                    required
                />
                <input 
                    type="number"
                    value={hospital.available_isolation_beds}
                    onChange={(e) => setHospital({ ...hospital, available_isolation_beds: parseInt(e.target.value, 10) })}
                    placeholder="Available Isolation Beds"
                    required
                />
                <label>
                    <input 
                        type="checkbox"
                        checked={hospital.oxygen_support_available}
                        onChange={(e) => setHospital({ ...hospital, oxygen_support_available: e.target.checked })}
                    />
                    Oxygen Support Available
                </label>
                
                <button type="submit">Update Hospital</button>
            </form>
        </div>
    );
};

export default HospitalEdit;
