// src/components/HospitalDetails.js
import React, { useEffect, useState } from 'react';
import axios from '../utils/axiosConfig';
import { useParams } from 'react-router-dom';

const HospitalDetails = () => {
    const [hospital, setHospital] = useState(null);
    const { id } = useParams(); // Gets the hospital ID from the URL

    useEffect(() => {
        const fetchHospitalDetails = async () => {
            try {
                const response = await axios.get(`/dashboard/hospitals/profile/detail/${id}`);
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
        <div>
            <h2>Hospital Details</h2>
            <p>Name: {hospital.name}</p>
            <p>Address: {hospital.address}</p>
            {/* Render other hospital details */}
        </div>
    );
};

export default HospitalDetails;
