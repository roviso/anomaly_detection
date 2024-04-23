// src/components/Dashboard.js
import React, { useEffect, useState, useContext } from "react";
import axios from "../utils/axiosConfig";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./Dashboard.css";

const Dashboard = () => {
  const [hospitals, setHospitals] = useState([]);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/"); // Redirect to login if not authenticated
      return;
    }
    const fetchHospitals = async () => {
      try {
        const response = await axios.get(
          "/dashboard/hospitals/gethospitals?skip=0&limit=100",
          { withCredentials: true }
        );
        setHospitals(response.data);
      } catch (error) {
        console.error("Error fetching hospitals", error);
      }
    };

    fetchHospitals();
  }, [user, navigate]);

  return (
    <div className="h-fit max-w-screen p-2 justify-center flex flex-col gap-2">
      <div className="flex-col flex text-center h-fit w-full p-2">
        <h1 className="text-lg font-semibold uppercase">Dashboard</h1>
        <Link
          to="/create-hospital"
          className="p-2 bg-green-500 w-fit rounded-md text-sm text-white"
        >
          Add New Hospital
        </Link>
      </div>
      <div className="h-fit max-w-screen overflow-x-scroll p-2">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Address</th>
              <th>Opening Hour</th>
              <th>Closing Hour</th>
              <th>Contact Number</th>
              <th>Alt. Contact Number</th>
              <th>Hospital Type</th>
              <th>Province</th>
              <th>District</th>
              <th>Total Beds</th>
              <th>Total ICU Beds</th>
              <th>Total Ventilators</th>
              <th>Total Isolation Beds</th>
              <th>Available ICU Beds</th>
              <th>Available Ventilators</th>
              <th>Available Isolation Beds</th>
              <th>Oxygen Support</th>
              <th>Available Blood</th>
              <th>Ambulances</th>
              <th>Blood Samples</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {hospitals.map((hospital) => (
              <tr key={hospital.id}>
                <td>{hospital.name}</td>
                <td>{hospital.address}</td>
                <td>{hospital.opening_hour}</td>
                <td>{hospital.closing_hour}</td>
                <td>{hospital.contact_number}</td>
                <td>{hospital.alternative_contact_number}</td>
                <td>{hospital.hospital_type}</td>
                <td>{hospital.province}</td>
                <td>{hospital.district}</td>
                <td>{hospital.total_beds}</td>
                <td>{hospital.total_icu_beds}</td>
                <td>{hospital.total_ventilators}</td>
                <td>{hospital.total_isolation_beds}</td>
                <td>{hospital.available_icu_beds}</td>
                <td>{hospital.available_ventilators}</td>
                <td>{hospital.available_isolation_beds}</td>
                <td>{hospital.oxygen_support_available ? "Yes" : "No"}</td>
                <td>{hospital.available_blood ? "Yes" : "No"}</td>
                <td>{hospital.ambulances.length}</td>
                <td>{hospital.blood_samples.length}</td>
                <td className="flex items-center gap-2">
                  <Link
                    to={`/hospitals/profile/detail/${hospital.id}`}
                    className="px-2 p-2 text-sm bg-blue-500 text-white rounded-md"
                  >
                    View
                  </Link>
                  <span className="action-separator"></span>
                  <Link
                    to={`/update-hospital/${hospital.id}`}
                    className="px-2 p-2 text-sm bg-blue-500 text-white rounded-md"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
