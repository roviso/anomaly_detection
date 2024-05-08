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
                setHospitals(response.data);
            } catch (error) {
                console.error('Error fetching hospitals', error);
            }
        };

        fetchHospitals();
    }, [user, navigate]);

    return (
        <div className="dashboard-container" >
            <h1>Hospitals Dashboard</h1>
            <Link to="/create-hospital" className="add-hospital-link">
                Add New Hospital
            </Link>
            <div className="card-container">
                {hospitals.map((hospital) => (
                    <div className="hospital-card" key={hospital.id}>
                        <h2>{hospital.name}</h2>
                        <p>{hospital.address}</p>
                        <p>Opening Hours: {hospital.opening_hour} - {hospital.closing_hour}</p>
                        <p>Total Beds: {hospital.total_beds}</p>
                        <p>Available Beds: {hospital.available_beds}</p>
                        <Link to={`/hospitals/profile/detail/${hospital.id}`} className="action-button">
                            View Details
                        </Link>
                        {" "} {/* Space added here */}
                        <Link to={`/update-hospital/${hospital.id}`} className="action-button">
                            Edit
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;