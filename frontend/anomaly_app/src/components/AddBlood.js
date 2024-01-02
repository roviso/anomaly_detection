import React, { useState } from 'react';
import axios from '../utils/axiosConfig';
import { Link, useParams, useNavigate } from 'react-router-dom';

const AddBlood = () => {
    const { hospitalId } = useParams();
    const navigate = useNavigate();

    const [bloodData, setBloodData] = useState({
        blood_type: '',
        details: '',
        is_available: true, // You can set the default value for is_available
    });

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
            await axios.post('/dashboard/blood/details/create', {
                ...bloodData,
                hospital_id: hospitalId,
            });

            // Redirect to the blood details page or any other page as needed
            navigate(`/hospitals/${hospitalId}/edit-blood`);
        } catch (error) {
            console.error('Error adding blood sample', error);
        }
    };

    return (
        <div className="add-blood-container">
            <h2>Add Blood Sample</h2>
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
                {/* Add more fields as needed */}
                <button type="submit">Add Blood Sample</button>
            </form>
            <Link to={`/hospitals/${hospitalId}/edit-blood`} className="cancel-link">
                Cancel
            </Link>
        </div>
    );
};

export default AddBlood;
