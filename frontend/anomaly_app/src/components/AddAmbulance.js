// AddAmbulance.js
import React, {useEffect, useState } from 'react';
import axios from '../utils/axiosConfig';
import { useParams } from 'react-router-dom';
import './AddAmbulance.css';

const AddAmbulance = () => {
    const { hospitalId } = useParams();
    const [csrfToken, setCsrfToken] = useState('');
    const [ambulanceData, setAmbulanceData] = useState({
        driver_name: '',
        contact_number: '',
        alternative_contact_number: '',
        status: '',
        hospital_id: parseInt(hospitalId)
    });

    useEffect(() => {
      axios.get('/dashboard/users/csrf_token', { withCredentials: true })
          .then(response => {
              setCsrfToken(response.data);
              console.log("Received CSRF token: ", response.data);
          })
          .catch(error => {
              console.error("Error fetching CSRF token", error.response);
          });
  }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAmbulanceData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/dashboard/ambulance/details/create', ambulanceData, {
              headers: {
                  'X-CSRF-TOKEN': csrfToken
              },
              withCredentials: true,
          });
            window.location.href = `/hospitals/${hospitalId}/edit-ambulance`;
        } catch (error) {
            console.error('Error adding ambulance', error);
        }
    };

    return (
        <div>
            <h2>Add Ambulance</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Driver Name:
                    <input type="text" name="driver_name" value={ambulanceData.driver_name} onChange={handleChange} />
                </label>
                <label>
                    Contact Number:
                    <input type="text" name="contact_number" value={ambulanceData.contact_number} onChange={handleChange} />
                </label>
                <label>
                    Alternative Contact Number:
                    <input type="text" name="alternative_contact_number" value={ambulanceData.alternative_contact_number} onChange={handleChange} />
                </label>
                <label>
                    Status:
                    <input type="text" name="status" value={ambulanceData.status} onChange={handleChange} />
                </label>
                <button type="submit">Add Ambulance</button>
            </form>
        </div>
    );
};

export default AddAmbulance;
