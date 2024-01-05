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
            navigate('/'); // Redirect to login if not authenticated
            return;
        }
        const fetchHospitals = async () => {
            try {
                const response = await axios.get('/dashboard/hospitals/gethospitals?skip=0&limit=100', {withCredentials: true } );
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
                            <th>ICU Beds</th>
                            <th>Ventilators</th>
                            <th>Isolation Beds</th>
                            <th>Oxygen Support</th>
                            <th>Ambulances</th>
                            <th>Blood Samples</th>
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
                                <td>{hospital.ambulances.length}</td> {/* Show ambulance count */}
                                <td>{hospital.blood_samples.length}</td> {/* Show blood sample count */}
                                <td>
                                    <Link to={`/hospitals/profile/detail/${hospital.id}`} className="action-button">
                                        View
                                    </Link>
                                    <span className="action-separator"></span> {/* Separator for spacing */}
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
