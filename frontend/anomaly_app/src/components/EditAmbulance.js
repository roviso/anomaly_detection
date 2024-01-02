import React, { useState, useEffect } from 'react';
import axios from '../utils/axiosConfig';
import { Link, useParams } from 'react-router-dom';

const EditAmbulance = () => {
    const { hospitalId } = useParams();
    const [ambulances, setAmbulances] = useState([]);

    const fetchAmbulances = async () => {
        try {
            const response = await axios.get(`/dashboard/hospitals/profile/detail/${hospitalId}`);
            setAmbulances(response.data.ambulances);
        } catch (error) {
            console.error('Error fetching ambulances', error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            await fetchAmbulances();
        };

        fetchData();
    }, [hospitalId]); // Removed `fetchAmbulances` from the dependency array

    const handleDelete = async (ambulanceId) => {
        try {
            await axios.delete(`/dashboard/ambulance/${ambulanceId}`);
            // Refresh the ambulance list after deletion
            await fetchAmbulances();
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
                        <th>License Plate</th>
                        {/* Add more ambulance details as needed */}
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {ambulances.map((ambulance) => (
                        <tr key={ambulance.id}>
                            <td>{ambulance.license_plate}</td>
                            {/* Add more ambulance details as needed */}
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
