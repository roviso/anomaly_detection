// EditAmbulanceForm.js
import React, { useState, useEffect } from 'react';
import axios from '../utils/axiosConfig';
import { useParams } from 'react-router-dom';

const EditAmbulanceForm = () => {
  const { id, ambulanceId } = useParams();
  const [ambulance, setAmbulance] = useState({
    license_plate: '',
    hospital_id: 0,
    service_active: true,
  });

  useEffect(() => {
    const fetchAmbulance = async () => {
      try {
        const response = await axios.get(`/dashboard/hospitals/profile/detail/${id}`);
        const selectedAmbulance = response.data.ambulances.find(a => a.id === parseInt(ambulanceId));
        setAmbulance(selectedAmbulance || {});
      } catch (error) {
        console.error('Error fetching ambulance', error);
      }
    };

    fetchAmbulance();
  }, [id, ambulanceId]);

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
      await axios.put(`/dashboard/ambulance/details/${ambulanceId}/update`, ambulance);
      // Redirect to the ambulance list or update the state as needed
      // Replace the following line with your redirection logic
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
          License Plate:
          <input type="text" name="license_plate" value={ambulance.license_plate} onChange={handleChange} />
        </label>
        {/* Add more form fields as needed */}
        <button type="submit">Update Ambulance</button>
      </form>
    </div>
  );
};

export default EditAmbulanceForm;
