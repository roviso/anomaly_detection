// src/components/EditBlood.js
import React, { useState, useEffect } from 'react';
import axios from '../utils/axiosConfig';
import { Link, useParams } from 'react-router-dom';

const EditBlood = () => {
    const { hospitalId } = useParams();
    const [bloodSamples, setBloodSamples] = useState([]);

    const fetchBloodSamples = async () => {
        try {
            const response = await axios.get(`/dashboard/hospitals/profile/detail/${hospitalId}`);
            console.log(response.data)
            setBloodSamples(response.data.blood_samples);
        } catch (error) {
            console.error('Error fetching blood samples', error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            await fetchBloodSamples();
        };

        fetchData();
    }, [hospitalId]);

    const handleDelete = async (bloodSampleId) => {
        try {
            await axios.delete(`/dashboard/blood/${bloodSampleId}`);
            // Refresh the blood samples list after deletion
            await fetchBloodSamples();
        } catch (error) {
            console.error('Error deleting blood sample', error);
        }
    };

    return (
        <div className="edit-blood-container">
            <h2>Edit Blood Samples</h2>
            <Link to={`/hospitals/${hospitalId}/add-blood`} className="add-blood-link">
                Add Blood Sample
            </Link>
            <table>
                <thead>
                    <tr>
                        <th>Blood Type</th>
                        <th>Details</th>
                        <th>Is Available</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {bloodSamples.map((bloodSample) => (
                        <tr key={bloodSample.id}>
                            <td>{bloodSample.blood_type}</td>
                            <td>{bloodSample.details}</td>
                            <td>{bloodSample.is_available ? 'Yes' : 'No'}</td>
                            <td>
                                <Link to={`/hospitals/${hospitalId}/edit-blood/${bloodSample.id}`} className="edit-link">
                                    Edit
                                </Link>
                                <button onClick={() => handleDelete(bloodSample.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default EditBlood;
