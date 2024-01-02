// AddAmbulance.js
import React, { useState } from 'react';
import axios from '../utils/axiosConfig';
import { useParams } from 'react-router-dom';

const AddAmbulance = () => {
  const {hospitalId } = useParams();
  const [ambulanceData, setAmbulanceData] = useState({
    license_plate: '',
    hospital_id: parseInt(hospitalId),
    service_active: true,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAmbulanceData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(ambulanceData,'this is ambulance data')
      await axios.post('/dashboard/ambulance/details/create', ambulanceData);
      // Redirect to the ambulance list or update the state as needed
      // Replace the following line with your redirection logic
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
          License Plate:
          <input type="text" name="license_plate" value={ambulanceData.license_plate} onChange={handleChange} />
        </label>
        {/* Add more form fields as needed */}
        <button type="submit">Add Ambulance</button>
      </form>
    </div>
  );
};

export default AddAmbulance;
