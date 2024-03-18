// src/components/HospitalForm.js
import React, { useEffect, useState } from 'react';
import axios from '../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';

const HospitalForm = () => {
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    // Add state for all other fields
    const [openingHour, setOpeningHour] = useState('');
    const [closingHour, setClosingHour] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [alternativeContactNumber, setAlternativeContactNumber] = useState('');
    const [hospitalType, setHospitalType] = useState('');
    const [province, setProvince] = useState('');
    const [district, setDistrict] = useState('');
    const [totalBeds, setTotalBeds] = useState('');
    // const [totalIcuBeds, setTotalIcuBeds] = useState('');
    // const [totalVentilators, setTotalVentilators] = useState('');
    // const [totalIsolationBeds, setTotalIsolationBeds] = useState('');
    // const [availableIcuBeds, setAvailableIcuBeds] = useState('');
    // const [availableVentilators, setAvailableVentilators] = useState('');
    // const [availableIsolationBeds, setAvailableIsolationBeds] = useState('');
    const [totalIcuBeds] = useState('');
    const [totalVentilators] = useState('');
    const [totalIsolationBeds] = useState('');
    const [availableIcuBeds] = useState('');
    const [availableVentilators] = useState('');
    const [availableIsolationBeds] = useState('');
    const [oxygenSupportAvailable, setOxygenSupportAvailable] = useState(false);
    const [availableBlood, setAvailableBlood] = useState(false);
    const [csrfToken, setCsrfToken] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('/dashboard/users/csrf_token', { withCredentials: true })
            .then(response => {
                setCsrfToken(response.data);
            })
            .catch(error => {
                console.error("Error fetching CSRF token", error.response);
            });
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new URLSearchParams();
            formData.append('name', name);
            formData.append('address', address);
            // Append all other fields to formData
            formData.append('opening_hour', openingHour);
            formData.append('closing_hour', closingHour);
            formData.append('contact_number', contactNumber);
            formData.append('alternative_contact_number', alternativeContactNumber);
            formData.append('hospital_type', hospitalType);
            formData.append('province', province);
            formData.append('district', district);
            formData.append('total_beds', totalBeds);
            formData.append('total_icu_beds', totalIcuBeds);
            formData.append('total_ventilators', totalVentilators);
            formData.append('total_isolation_beds', totalIsolationBeds);
            formData.append('available_icu_beds', availableIcuBeds);
            formData.append('available_ventilators', availableVentilators);
            formData.append('available_isolation_beds', availableIsolationBeds);
            formData.append('oxygen_support_available', oxygenSupportAvailable);
            formData.append('available_blood', availableBlood);

            await axios.post('/dashboard/hospitals/hospitals/create', formData, {
                headers: {
                    'X-CSRF-TOKEN': csrfToken
                }
            });

            navigate('/dashboard');
        } catch (error) {
            console.error("Error creating hospital", error);
        }
    };

    return (
        <div>
            <h1>Add New Hospital</h1>
            <form onSubmit={handleSubmit}>
                {/* Input fields for all hospital attributes */}
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
                <input 
                    type="text"
                    value={openingHour}
                    onChange={(e) => setOpeningHour(e.target.value)}
                    placeholder="Opening Hour"
                    required
                />
                <input 
                    type="text"
                    value={closingHour}
                    onChange={(e) => setClosingHour(e.target.value)}
                    placeholder="Closing Hour"
                    required
                />
                <input 
                    type="text"
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    placeholder="Contact Number"
                    required
                />
                <input 
                    type="text"
                    value={alternativeContactNumber}
                    onChange={(e) => setAlternativeContactNumber(e.target.value)}
                    placeholder="Alternative Contact Number"
                />
                <input 
                    type="text"
                    value={hospitalType}
                    onChange={(e) => setHospitalType(e.target.value)}
                    placeholder="Hospital Type"
                    required
                />
                <input 
                    type="number"
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    placeholder="Province"
                    required
                />
                <input 
                    type="number"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    placeholder="District"
                    required
                />
                {/* Repeat inputs for remaining fields */}
                <input 
                    type="number"
                    value={totalBeds}
                    onChange={(e) => setTotalBeds(e.target.value)}
                    placeholder="Total Beds"
                    required
                />
                {/* ... additional fields like ICU beds, ventilators, etc. */}
                <label>
                    <input 
                        type="checkbox"
                        checked={oxygenSupportAvailable}
                        onChange={(e) => setOxygenSupportAvailable(e.target.checked)}
                    />
                    Oxygen Support Available
                </label>
                <label>
                    <input 
                        type="checkbox"
                        checked={availableBlood}
                        onChange={(e) => setAvailableBlood(e.target.checked)}
                    />
                    Available Blood
                </label>
                <button type="submit">Create Hospital</button>
            </form>
        </div>
    );
};

export default HospitalForm;
