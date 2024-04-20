// src/components/HospitalEdit.js
import React, { useEffect, useState } from 'react';
import axios from '../utils/axiosConfig';
import { useParams, useNavigate } from 'react-router-dom';
import './HospitalEdit.css'; 

const HospitalEdit = () => {
    const [hospital, setHospital] = useState({
        name: '', 
        address: '', 
        opening_hour: '',
        closing_hour: '',
        contact_number: '',
        alternative_contact_number: '',
        hospital_type: '',
        province: 0,
        district: 0,
        total_beds: 0,
        total_icu_beds: 0,
        total_ventilators: 0,
        total_isolation_beds: 0,
        available_icu_beds: 0,
        available_ventilators: 0,
        available_isolation_beds: 0,
        oxygen_support_available: false,
        available_blood: false,
        // ... include other fields
    });
    const [csrfToken, setCsrfToken] = useState('');
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

        axios.get('/dashboard/users/csrf_token', { withCredentials: true })
            .then(response => {
                setCsrfToken(response.data);
            })
            .catch(error => {
                console.error("Error fetching CSRF token", error.response);
            });
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new URLSearchParams();
            Object.entries(hospital).forEach(([key, value]) => {
                formData.append(key, value);
            });

            await axios.put(`/dashboard/hospitals/hospitals/${id}/update`, formData, {
                headers: {
                    'X-CSRF-TOKEN': csrfToken,
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                withCredentials: true,
            });
            navigate('/dashboard');
        } catch (error) {
            console.error("Error updating hospital", error);
        }
    };

    return (
        <div className="hospital-edit-container">
            <h1>Edit Hospital</h1>
            <form onSubmit={handleSubmit} className="hospital-edit-form">
                {/* Labeled input fields for all hospital attributes */}
                <label>
                    Hospital Name:
                    <input 
                        type="text"
                        value={hospital.name}
                        onChange={(e) => setHospital({ ...hospital, name: e.target.value })}
                        required
                    />
                </label>
                <label>
                    Address:
                    <input 
                        type="text"
                        value={hospital.address}
                        onChange={(e) => setHospital({ ...hospital, address: e.target.value })}
                        required
                    />
                </label>
                <label>
                    Opening Hour:
                    <input 
                        type="text"
                        value={hospital.opening_hour}
                        onChange={(e) => setHospital({ ...hospital, opening_hour: e.target.value })}
                    />
                </label>
                <label>
                    Closing Hour:
                    <input 
                        type="text"
                        value={hospital.closing_hour}
                        onChange={(e) => setHospital({ ...hospital, closing_hour: e.target.value })}
                    />
                </label>
                <label>
                    Contact Number:
                    <input 
                        type="text"
                        value={hospital.contact_number}
                        onChange={(e) => setHospital({ ...hospital, contact_number: e.target.value })}
                    />
                </label>
                <label>
                    Alternative Contact Number:
                    <input 
                        type="text"
                        value={hospital.alternative_contact_number}
                        onChange={(e) => setHospital({ ...hospital, alternative_contact_number: e.target.value })}
                    />
                </label>
                <label>
                    Hospital Type:
                    <input 
                        type="text"
                        value={hospital.hospital_type}
                        onChange={(e) => setHospital({ ...hospital, hospital_type: e.target.value })}
                    />
                </label>
                <label>
                    Province:
                    <input 
                        type="number"
                        value={hospital.province}
                        onChange={(e) => setHospital({ ...hospital, province: parseInt(e.target.value, 10) })}
                    />
                </label>
                <label>
                    District:
                    <input 
                        type="number"
                        value={hospital.district}
                        onChange={(e) => setHospital({ ...hospital, district: parseInt(e.target.value, 10) })}
                    />
                </label>
                <label>
                    Total Beds:
                    <input 
                        type="number"
                        value={hospital.total_beds}
                        onChange={(e) => setHospital({ ...hospital, total_beds: parseInt(e.target.value, 10) })}
                    />
                </label>
                <label>
                    Total ICU Beds:
                    <input 
                        type="number"
                        value={hospital.total_icu_beds}
                        onChange={(e) => setHospital({ ...hospital, total_icu_beds: parseInt(e.target.value, 10) })}
                    />
                </label>
                <label>
                    Total Ventilators:
                    <input 
                        type="number"
                        value={hospital.total_ventilators}
                        onChange={(e) => setHospital({ ...hospital, total_ventilators: parseInt(e.target.value, 10) })}
                    />
                </label>
                <label>
                    Total Isolation Beds:
                    <input 
                        type="number"
                        value={hospital.total_isolation_beds}
                        onChange={(e) => setHospital({ ...hospital, total_isolation_beds: parseInt(e.target.value, 10) })}
                    />
                </label>
                <label>
                    Available ICU Beds:
                    <input 
                        type="number"
                        value={hospital.available_icu_beds}
                        onChange={(e) => setHospital({ ...hospital, available_icu_beds: parseInt(e.target.value, 10) })}
                    />
                </label>
                <label>
                    Available Ventilators:
                    <input 
                        type="number"
                        value={hospital.available_ventilators}
                        onChange={(e) => setHospital({ ...hospital, available_ventilators: parseInt(e.target.value, 10) })}
                    />
                </label>
                <label>
                    Available Isolation Beds:
                    <input 
                        type="number"
                        value={hospital.available_isolation_beds}
                        onChange={(e) => setHospital({ ...hospital, available_isolation_beds: parseInt(e.target.value, 10) })}
                    />
                </label>
                <label>
                    Oxygen Support Available:
                    <input 
                        type="checkbox"
                        checked={hospital.oxygen_support_available}
                        onChange={(e) => setHospital({ ...hospital, oxygen_support_available: e.target.checked })}
                    />
                </label>
                <label>
                    Available Blood:
                    <input 
                        type="checkbox"
                        checked={hospital.available_blood}
                        onChange={(e) => setHospital({ ...hospital, available_blood: e.target.checked })}
                    />
                </label>
                <button type="submit">Update Hospital</button>
            </form>
        </div>
    );
    
};

export default HospitalEdit;
