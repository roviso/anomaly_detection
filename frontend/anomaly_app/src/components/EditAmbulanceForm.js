// EditAmbulanceForm.js
import React, { useState, useEffect } from 'react';
import axios from '../utils/axiosConfig';
import { useParams } from 'react-router-dom';

const EditAmbulanceForm = () => {
  const { id, ambulanceId } = useParams();
  const [csrfToken, setCsrfToken] = useState('');
  const [ambulance, setAmbulance] = useState({
    driver_name: '',
    contact_number: '',
    alternative_contact_number: '',
    status: '',
    hospital_id: parseInt(id),
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


    const fetchAmbulance = async () => {
      try {
        const response = await axios.get(`/dashboard/ambulance/details/${ambulanceId}`);
        setAmbulance(response.data || {});
      } catch (error) {
        console.error('Error fetching ambulance', error);
      }
    };

    fetchAmbulance();
  }, [ambulanceId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAmbulance(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/dashboard/ambulance/details/${ambulanceId}/update`, ambulance, {
        headers: {
            'X-CSRF-TOKEN': csrfToken
        },
        withCredentials: true,
    });
      window.location.href = `/hospitals/${id}/edit-ambulance`;
    } catch (error) {
      console.error('Error updating ambulance', error);
    }
  };

  return (
    <div>
      <h2>Edit Ambulance</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Driver Name:
          <input type="text" name="driver_name" value={ambulance.driver_name} onChange={handleChange} />
        </label>
        <label>
          Contact Number:
          <input type="text" name="contact_number" value={ambulance.contact_number} onChange={handleChange} />
        </label>
        <label>
          Alternative Contact Number:
          <input type="text" name="alternative_contact_number" value={ambulance.alternative_contact_number} onChange={handleChange} />
        </label>
        <label>
          Status:
          <input type="text" name="status" value={ambulance.status} onChange={handleChange} />
        </label>
        {/* Add more form fields if needed */}
        <button type="submit">Update Ambulance</button>
      </form>
    </div>
  );
};

export default EditAmbulanceForm;
