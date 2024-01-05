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
            <h2>{hospital.name} - Hospital Details</h2>
            <div className="details-card">
                <p><strong>Address:</strong> {hospital.address}</p>
                <p><strong>Available ICU Beds:</strong> {hospital.available_icu_beds}</p>
                <p><strong>Available Ventilators:</strong> {hospital.available_ventilators}</p>
                <p><strong>Available Isolation Beds:</strong> {hospital.available_isolation_beds}</p>
                <p><strong>Oxygen Support:</strong> {hospital.oxygen_support_available ? 'Yes' : 'No'}</p>
            </div>

            <div className="details-section">
                <h3>Ambulance Details</h3>
                <table className="details-table">
                    <thead>
                        <tr>
                            <th>License Plate</th>
                            {/* Add more headers as needed */}
                        </tr>
                    </thead>
                    <tbody>
                        {hospital.ambulances.map((ambulance) => (
                            <tr key={ambulance.id}>
                                <td>{ambulance.license_plate}</td>
                                {/* Add more details as needed */}
                            </tr>
                        ))}
                    </tbody>
                </table>
                <Link to={`/hospitals/${hospital.id}/edit-ambulance`} className="edit-link">
                    Edit Ambulance
                </Link>
            </div>

            <div className="details-section">
                <h3>Blood Details</h3>
                <table className="details-table">
                    <thead>
                        <tr>
                            <th>Blood Type</th>
                            <th>Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {hospital.blood_samples.map((bloodSample) => (
                            <tr key={bloodSample.id}>
                                <td>{bloodSample.blood_type}</td>
                                <td>{bloodSample.details}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <Link to={`/hospitals/${hospital.id}/edit-blood`} className="edit-link">
                    Edit Blood
                </Link>
            </div>
        </div>
    );
};

export default HospitalDetails;