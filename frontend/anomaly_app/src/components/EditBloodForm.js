// EditBloodForm.js
import React, { useState, useEffect } from 'react';
import axios from '../utils/axiosConfig';
import { useParams, useNavigate } from 'react-router-dom';
import './EditBloodForm.css';


const EditBloodForm = () => {
    const { hospitalId, bloodId } = useParams();
    const navigate = useNavigate();
    const [bloodData, setBloodData] = useState({
        blood_type: '',
        details: '',
        is_available: true,
    });

    useEffect(() => {
        const fetchBloodData = async () => {
            try {
                const response = await axios.get(`/dashboard/blood/details/${bloodId}`);
                setBloodData(response.data);
            } catch (error) {
                console.error('Error fetching blood sample', error);
            }
        };

        fetchBloodData();
    }, [bloodId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBloodData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.put(`/dashboard/blood/details/${bloodId}/update`, bloodData);
            navigate(`/hospitals/${hospitalId}/edit-blood`);
        } catch (error) {
            console.error('Error updating blood sample', error);
        }
    };

    return (
        <div className="edit-blood-form-container">
            <h2>Edit Blood Sample</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Blood Type:
                    <input
                        type="text"
                        name="blood_type"
                        value={bloodData.blood_type}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Details:
                    <input
                        type="text"
                        name="details"
                        value={bloodData.details}
                        onChange={handleChange}
                        required
                    />
                </label>
                <button type="submit">Update Blood Sample</button>
            </form>
        </div>
    );
};

export default EditBloodForm;