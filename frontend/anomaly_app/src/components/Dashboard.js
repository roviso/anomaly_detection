// src/components/Dashboard.js
import React, { useEffect, useState, useContext } from 'react';
import axios from '../utils/axiosConfig';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
    const [hospitals, setHospitals] = useState([]);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/');
            return;
        }

        const fetchHospitals = async () => {
            try {
                const response = await axios.get('/dashboard/hospitals/gethospitals?skip=0&limit=100');
                console.log(response.data);
                setHospitals(response.data);
            } catch (error) {
                console.error('Error fetching hospitals', error);
            }
        };

        fetchHospitals();
    }, [user, navigate]);

    return (
        <div className="dashboard-container">
            <h1>Hospitals Dashboard</h1>
            <Link to="/create-hospital" className="add-hospital-link">
                Add New Hospital
            </Link>
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Address</th>
                            <th>available_icu_beds</th>
                            <th>available_ventilators</th>
                            <th>available_isolation_beds</th>
                            <th>oxygen_support_available</th>
                            <th>Ambulance</th>
                            <th>Blood</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {hospitals.map((hospital) => (
                            <tr key={hospital.id}>
                                <td>{hospital.name}</td>
                                <td>{hospital.address}</td>
                                <td>{hospital.available_icu_beds}</td>
                                <td>{hospital.available_ventilators}</td>
                                <td>{hospital.available_isolation_beds}</td>
                                <td>{hospital.oxygen_support_available ? 'Yes' : 'No'}</td>
                                <td>
                                    {hospital.ambulances.map((ambulance) => (
                                        <div key={ambulance.id}>
                                            License Plate: {ambulance.license_plate}, {/* Add more details as needed */}
                                        </div>
                                    ))}
                                </td>
                                <td>
                                    {hospital.blood_samples.map((bloodSample) => (
                                        <div key={bloodSample.id}>
                                            Blood Type: {bloodSample.blood_type}, Details: {bloodSample.details}
                                        </div>
                                    ))}
                                </td>
                                <td>
                                    <Link to={`/hospitals/profile/detail/${hospital.id}`} className="action-button">
                                        View
                                    </Link>
                                    <Link to={`/update-hospital/${hospital.id}`} className="action-button">
                                        Edit
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Dashboard;
