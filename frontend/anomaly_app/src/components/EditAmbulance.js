// EditAmbulance.js
import React, { useState, useEffect } from 'react';
import axios from '../utils/axiosConfig';
import { Link, useParams } from 'react-router-dom';

const EditAmbulance = () => {
    const { hospitalId } = useParams();
    const [csrfToken, setCsrfToken] = useState('');
    const [ambulances, setAmbulances] = useState([]);

    useEffect(() => {
        axios.get('/dashboard/users/csrf_token', { withCredentials: true })
            .then(response => {
                setCsrfToken(response.data);
                console.log("Received CSRF token: ", response.data);
            })
            .catch(error => {
                console.error("Error fetching CSRF token", error.response);
            });

        const fetchAmbulances = async () => {
            try {
                const response = await axios.get(`/dashboard/hospitals/profile/detail/${hospitalId}`);
                setAmbulances(response.data.ambulances);
            } catch (error) {
                console.error('Error fetching ambulances', error);
            }
        };

        fetchAmbulances();
    }, [hospitalId]);

    const handleDelete = async (ambulanceId) => {
        try {
            await axios.delete(`/dashboard/ambulance/${ambulanceId}`, {
                headers: {
                    'X-CSRF-TOKEN': csrfToken
                },
                withCredentials: true,
            });
            setAmbulances(ambulances.filter(ambulance => ambulance.id !== ambulanceId));
        } catch (error) {
            console.error('Error deleting ambulance', error);
        }
    };

    return (
        <div className="edit-ambulance-container">
            <h2>Edit Ambulance</h2>
            <Link to={`/hospitals/${hospitalId}/add-ambulance`} className="add-ambulance-link">
                Add Ambulance
            </Link>
            <table>
                <thead>
                    <tr>
                        <th>Driver Name</th>
                        <th>Contact Number</th>
                        <th>Alternative Contact Number</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {ambulances.map((ambulance) => (
                        <tr key={ambulance.id}>
                            <td>{ambulance.driver_name}</td>
                            <td>{ambulance.contact_number}</td>
                            <td>{ambulance.alternative_contact_number}</td>
                            <td>{ambulance.status}</td>
                            <td>
                                <Link to={`/hospitals/${hospitalId}/edit-ambulance/${ambulance.id}`} className="edit-link">
                                    Edit
                                </Link>
                                <button onClick={() => handleDelete(ambulance.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default EditAmbulance;
