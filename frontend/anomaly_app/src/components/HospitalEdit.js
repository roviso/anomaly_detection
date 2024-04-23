// src/components/HospitalEdit.js
import React, { useEffect, useState } from "react";
import axios from "../utils/axiosConfig";
import { useParams, useNavigate } from "react-router-dom";
import "./HospitalForm.css";

const HospitalEdit = () => {
  const [hospital, setHospital] = useState({
    name: "",
    address: "",
    opening_hour: "",
    closing_hour: "",
    contact_number: "",
    alternative_contact_number: "",
    hospital_type: "",
    province: 0,
    district: 0,
    total_beds: 0,
    total_icu_beds: 0,
    total_ventilators: 0,
    total_isolation_beds: 0,
    available_icu_beds: 0,
    available_ventilators: 0,
    available_isolation_beds: 0,
    oxygen_support_available: false,
    available_blood: false,
    // ... include other fields
  });
  const [csrfToken, setCsrfToken] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHospitalDetails = async () => {
      try {
        const response = await axios.get(
          `/dashboard/hospitals/profile/detail/${id}`
        );
        setHospital(response.data);
      } catch (error) {
        console.error("Error fetching hospital details", error);
      }
    };
    fetchHospitalDetails();

    axios
      .get("/dashboard/users/csrf_token", { withCredentials: true })
      .then((response) => {
        setCsrfToken(response.data);
      })
      .catch((error) => {
        console.error("Error fetching CSRF token", error.response);
      });
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new URLSearchParams();
      Object.entries(hospital).forEach(([key, value]) => {
        formData.append(key, value);
      });

      await axios.put(`/dashboard/hospitals/hospitals/${id}/update`, formData, {
        headers: {
          "X-CSRF-TOKEN": csrfToken,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        withCredentials: true,
      });
      navigate("/dashboard");
    } catch (error) {
      console.error("Error updating hospital", error);
    }
  };

  return (
    <div className="flex-col flex gap-6 overflow-x-auto justify-center items-center overflow-hidden w-full">
      <p className="w-full h-fit text-2xl font-bold flex justify-center p-2 mt-10 bg-zinc-100">
        Edit Hospital
      </p>
      <div className="flex justify-center ">
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-4 gap-4 items-center h-fit p-2"
        >
          {/* Labeled input fields for all hospital attributes */}
          <label className="text-sm mb-1 p-1 font-semibold">
            Hospital Name:
          </label>
          <input
            type="text"
            className="p-2 border border-black rounded-lg placeholder:text-xs mb-2"
            value={hospital.name}
            onChange={(e) => setHospital({ ...hospital, name: e.target.value })}
            required
          />
          <label className="text-sm mb-1 p-1 font-semibold">Address:</label>
          <input
            type="text"
            value={hospital.address}
            className="p-2 border border-black rounded-lg placeholder:text-xs mb-2"
            onChange={(e) =>
              setHospital({ ...hospital, address: e.target.value })
            }
            required
          />
          <label className="text-sm mb-1 p-1 font-semibold">
            Opening Hour:
          </label>
          <input
            type="text"
            value={hospital.opening_hour}
            className="p-2 border border-black rounded-lg placeholder:text-xs mb-2"
            onChange={(e) =>
              setHospital({ ...hospital, opening_hour: e.target.value })
            }
          />
          <label className="text-sm mb-1 p-1 font-semibold">
            Closing Hour:
          </label>
          <input
            type="text"
            value={hospital.closing_hour}
            className="p-2 border border-black rounded-lg placeholder:text-xs mb-2"
            onChange={(e) =>
              setHospital({ ...hospital, closing_hour: e.target.value })
            }
          />
          <label className="text-sm mb-1 p-1 font-semibold">
            Contact Number:
          </label>
          <input
            type="text"
            value={hospital.contact_number}
            className="p-2 border border-black rounded-lg placeholder:text-xs mb-2"
            onChange={(e) =>
              setHospital({ ...hospital, contact_number: e.target.value })
            }
          />
          <label className="text-sm mb-1 p-1 font-semibold">
            Alternative Contact Number:
          </label>
          <input
            type="text"
            value={hospital.alternative_contact_number}
            className="p-2 border border-black rounded-lg placeholder:text-xs mb-2"
            onChange={(e) =>
              setHospital({
                ...hospital,
                alternative_contact_number: e.target.value,
              })
            }
          />
          <label className="text-sm mb-1 p-1 font-semibold">
            Hospital Type:
          </label>
          <input
            type="text"
            value={hospital.hospital_type}
            className="p-2 border border-black rounded-lg placeholder:text-xs mb-2"
            onChange={(e) =>
              setHospital({ ...hospital, hospital_type: e.target.value })
            }
          />
          <label className="text-sm mb-1 p-1 font-semibold">Province:</label>
          <input
            type="number"
            value={hospital.province}
            className="p-2 border border-black rounded-lg placeholder:text-xs mb-2"
            onChange={(e) =>
              setHospital({
                ...hospital,
                province: parseInt(e.target.value, 10),
              })
            }
          />
          <label className="text-sm mb-1 p-1 font-semibold">District:</label>
          <input
            type="number"
            value={hospital.district}
            className="p-2 border border-black rounded-lg placeholder:text-xs mb-2"
            onChange={(e) =>
              setHospital({
                ...hospital,
                district: parseInt(e.target.value, 10),
              })
            }
          />
          <label className="text-sm mb-1 p-1 font-semibold">Total Beds:</label>
          <input
            type="number"
            value={hospital.total_beds}
            className="p-2 border border-black rounded-lg placeholder:text-xs mb-2"
            onChange={(e) =>
              setHospital({
                ...hospital,
                total_beds: parseInt(e.target.value, 10),
              })
            }
          />
          <label className="text-sm mb-1 p-1 font-semibold">
            Total ICU Beds:
          </label>
          <input
            type="number"
            value={hospital.total_icu_beds}
            className="p-2 border border-black rounded-lg placeholder:text-xs mb-2"
            onChange={(e) =>
              setHospital({
                ...hospital,
                total_icu_beds: parseInt(e.target.value, 10),
              })
            }
          />
          <label className="text-sm mb-1 p-1 font-semibold">
            Total Ventilators:
          </label>
          <input
            type="number"
            value={hospital.total_ventilators}
            className="p-2 border border-black rounded-lg placeholder:text-xs mb-2"
            onChange={(e) =>
              setHospital({
                ...hospital,
                total_ventilators: parseInt(e.target.value, 10),
              })
            }
          />
          <label className="text-sm mb-1 p-1 font-semibold">
            Total Isolation Beds:
          </label>
          <input
            type="number"
            value={hospital.total_isolation_beds}
            className="p-2 border border-black rounded-lg placeholder:text-xs mb-2"
            onChange={(e) =>
              setHospital({
                ...hospital,
                total_isolation_beds: parseInt(e.target.value, 10),
              })
            }
          />
          <label className="text-sm mb-1 p-1 font-semibold">
            Available ICU Beds:
          </label>
          <input
            type="number"
            value={hospital.available_icu_beds}
            className="p-2 border border-black rounded-lg placeholder:text-xs mb-2"
            onChange={(e) =>
              setHospital({
                ...hospital,
                available_icu_beds: parseInt(e.target.value, 10),
              })
            }
          />
          <label className="text-sm mb-1 p-1 font-semibold">
            Available Ventilators:
          </label>
          <input
            type="number"
            value={hospital.available_ventilators}
            className="p-2 border border-black rounded-lg placeholder:text-xs mb-2"
            onChange={(e) =>
              setHospital({
                ...hospital,
                available_ventilators: parseInt(e.target.value, 10),
              })
            }
          />
          <label className="text-sm mb-1 p-1 font-semibold">
            Available Isolation Beds:
          </label>
          <input
            type="number"
            value={hospital.available_isolation_beds}
            className="p-2 border border-black rounded-lg placeholder:text-xs mb-2"
            onChange={(e) =>
              setHospital({
                ...hospital,
                available_isolation_beds: parseInt(e.target.value, 10),
              })
            }
          />
          <label className="text-sm mb-1 p-1 font-semibold">
            Oxygen Support Available:
          </label>
          <input
            type="checkbox"
            checked={hospital.oxygen_support_available}
            className="p-2 border border-black rounded-lg placeholder:text-xs mb-2"
            onChange={(e) =>
              setHospital({
                ...hospital,
                oxygen_support_available: e.target.checked,
              })
            }
          />
          <label className="text-sm mb-1 p-1 font-semibold">
            Available Blood:
          </label>
          <input
            type="checkbox"
            checked={hospital.available_blood}
            className="p-2 border border-black rounded-lg placeholder:text-xs mb-2"
            onChange={(e) =>
              setHospital({ ...hospital, available_blood: e.target.checked })
            }
          />
          <div className="w-full col-span-4">
            <button
              type="submit"
              className="w-full h-fit p-2 bg-zinc-800 hover:bg-zinc-900 text-white font-semibold rounded-lg"
            >
              Update Hospital
            </button>
          </div>
          <div className="w-full col-span-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="w-full h-fit p-2 bg-zinc-700 hover:bg-zinc-800 text-white font-semibold rounded-lg"
            >
              Back to Dashboard
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HospitalEdit;
