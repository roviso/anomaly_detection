// src/components/HospitalDetails.js
import React, { useEffect, useState } from 'react';
import axios from '../utils/axiosConfig';
import { useParams, Link } from 'react-router-dom';
import './HospitalDetails.css';


const HospitalDetails = () => {
    const [hospital, setHospital] = useState(null);
    const { id } = useParams(); // Gets the hospital ID from the URL

    useEffect(() => {
        const fetchHospitalDetails = async () => {
            try {
                const response = await axios.get(`/dashboard/hospitals/profile/detail/${id}`);
                console.log(response.data)
                setHospital(response.data);
            } catch (error) {
                console.error("Error fetching hospital details", error);
                // Handle error appropriately
            }
        };

        fetchHospitalDetails();
    }, [id]);

    if (!hospital) return <div>Loading...</div>;

    return (
        <div className="hospital-details-container">
            <h2>Hospital Details</h2>
            <p>Name: {hospital.name}</p>
            <p>Address: {hospital.address}</p>

            {/* Ambulance details */}
            <div className="details-section">
                <h3>Ambulance Details</h3>
                {hospital.ambulances.map((ambulance) => (
                    <div key={ambulance.id} className="detail-item">
                        License Plate: {ambulance.license_plate}
                        {/* Add more details as needed */}
                    </div>
                ))}
                <Link to={`/hospitals/${hospital.id}/edit-ambulance`} className="edit-link">
                    Edit Ambulance
                </Link>
            </div>

            {/* Blood details */}
            <div className="details-section">
                <h3>Blood Details</h3>
                {hospital.blood_samples.map((bloodSample) => (
                    <div key={bloodSample.id} className="detail-item">
                        Blood Type: {bloodSample.blood_type}, Details: {bloodSample.details}
                    </div>
                ))}
                <Link to={`/hospitals/${hospital.id}/edit-blood`} className="edit-link">
                    Edit Blood
                </Link>
            </div>
        </div>
    );
};

export default HospitalDetails;
