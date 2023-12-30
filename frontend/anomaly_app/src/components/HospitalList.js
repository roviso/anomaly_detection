import React, { useState, useEffect } from 'react';
import axios from 'axios';

function HospitalList() {
    const [hospitals, setHospitals] = useState([]);

    useEffect(() => {
        const fetchHospitals = async () => {
            try {
                const response = await axios.get('/api/hospitals');
                setHospitals(response.data);
            } catch (error) {
                console.error("Error fetching hospitals", error);
            }
        };

        fetchHospitals();
    }, []);

    return (
        <div>
            {hospitals.map(hospital => (
                <div key={hospital.id}>
                    {hospital.name} - {hospital.address}
                </div>
            ))}
        </div>
    );
}

export default HospitalList;
