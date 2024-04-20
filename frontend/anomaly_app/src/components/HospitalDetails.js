// src/components/HospitalDetails.js
import React, { useEffect, useState } from 'react';
import axios from '../utils/axiosConfig';
import { useParams, Link } from 'react-router-dom';
import './HospitalDetails.css';

const HospitalDetails = () => {
    const [hospital, setHospital] = useState(null);
    const { id } = useParams();

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

    if (!hospital) return <div>Loading...</div>;

    return (
        <div className="hospital-details-container">
            <h1>{hospital.name}</h1>
            <div className="details-card">
                
                {/* Display all the fields of the hospital */}
                <p><strong>Address:</strong> {hospital.address}</p>
                <p><strong>Opening Hour:</strong> {hospital.opening_hour}</p>
                <p><strong>Closing Hour:</strong> {hospital.closing_hour}</p>
                <p><strong>Contact Number:</strong> {hospital.contact_number}</p>
                <p><strong>Alternative Contact Number:</strong> {hospital.alternative_contact_number}</p>
                <p><strong>Hospital Type:</strong> {hospital.hospital_type}</p>
                <p><strong>Province:</strong> {hospital.province}</p>
                <p><strong>District:</strong> {hospital.district}</p>
                <p><strong>Total Beds:</strong> {hospital.total_beds}</p>
                <p><strong>Total ICU Beds:</strong> {hospital.total_icu_beds}</p>
                <p><strong>Total Ventilators:</strong> {hospital.total_ventilators}</p>
                <p><strong>Total Isolation Beds:</strong> {hospital.total_isolation_beds}</p>
                <p><strong>Available ICU Beds:</strong> {hospital.available_icu_beds}</p>
                <p><strong>Available Ventilators:</strong> {hospital.available_ventilators}</p>
                <p><strong>Available Isolation Beds:</strong> {hospital.available_isolation_beds}</p>
                <p><strong>Oxygen Support:</strong> {hospital.oxygen_support_available ? 'Yes' : 'No'}</p>
                <p><strong>Available Blood:</strong> {hospital.available_blood ? 'Yes' : 'No'}</p>
            </div>
    
            <div className="details-section">
            <h3>Ambulance Details</h3>
            <div className="details-table-container">
                <table className="details-table">
                    <thead>
                        <tr>
                            <th>Driver Name</th>
                            <th>Contact Number</th>
                            <th>Alternative Contact Number</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {hospital.ambulances.map((ambulance) => (
                            <tr key={ambulance.id}>
                                <td>{ambulance.driver_name}</td>
                                <td>{ambulance.contact_number}</td>
                                <td>{ambulance.alternative_contact_number}</td>
                                <td>{ambulance.status}</td>
                            </tr>
                        ))}
                    </tbody>
                    </table>
            </div>
            <Link to={`/hospitals/${hospital.id}/edit-ambulance`} className="edit-link">
                Show/Edit Ambulance
            </Link>
        </div>
    
        <h3>Blood Details</h3>
            <div className="details-table-container">
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
                Show/Edit Blood
            </Link>
            </div>
        </div>
    );
    
};

export default HospitalDetails;
