// src/components/HospitalForm.js
import React, { useEffect, useState } from "react";
import axios from "../utils/axiosConfig";
import { useNavigate } from "react-router-dom";

const HospitalForm = () => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  // Add state for all other fields
  const [openingHour, setOpeningHour] = useState("");
  const [closingHour, setClosingHour] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [alternativeContactNumber, setAlternativeContactNumber] = useState("");
  const [hospitalType, setHospitalType] = useState("");
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [totalBeds, setTotalBeds] = useState("");
  const [totalIcuBeds, setTotalIcuBeds] = useState("");
  const [totalVentilators, setTotalVentilators] = useState("");
  const [totalIsolationBeds, setTotalIsolationBeds] = useState("");
  const [availableIcuBeds, setAvailableIcuBeds] = useState("");
  const [availableVentilators, setAvailableVentilators] = useState("");
  const [availableIsolationBeds, setAvailableIsolationBeds] = useState("");
  const [oxygenSupportAvailable, setOxygenSupportAvailable] = useState(false);
  const [availableBlood, setAvailableBlood] = useState(false);
  const [csrfToken, setCsrfToken] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/dashboard/users/csrf_token", { withCredentials: true })
      .then((response) => {
        setCsrfToken(response.data);
      })
      .catch((error) => {
        console.error("Error fetching CSRF token", error.response);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new URLSearchParams();
      formData.append("name", name);
      formData.append("address", address);
      // Append all other fields to formData
      formData.append("opening_hour", openingHour);
      formData.append("closing_hour", closingHour);
      formData.append("contact_number", contactNumber);
      formData.append("alternative_contact_number", alternativeContactNumber);
      formData.append("hospital_type", hospitalType);
      formData.append("province", province);
      formData.append("district", district);
      formData.append("total_beds", totalBeds);
      formData.append("total_icu_beds", totalIcuBeds);
      formData.append("total_ventilators", totalVentilators);
      formData.append("total_isolation_beds", totalIsolationBeds);
      formData.append("available_icu_beds", availableIcuBeds);
      formData.append("available_ventilators", availableVentilators);
      formData.append("available_isolation_beds", availableIsolationBeds);
      formData.append("oxygen_support_available", oxygenSupportAvailable);
      formData.append("available_blood", availableBlood);

      await axios.post("/dashboard/hospitals/hospitals/create", formData, {
        headers: {
          "X-CSRF-TOKEN": csrfToken,
        },
      });

      navigate("/dashboard");
    } catch (error) {
      console.error("Error creating hospital", error);
    }
  };

  return (
    <div className="flex-col flex gap-6 overflow-x-auto justify-center items-center overflow-hidden w-full">
      <p className="w-full h-fit text-2xl font-bold flex justify-center p-2 mt-10 bg-zinc-100">
        Add New Hospital
      </p>
      <div className="flex justify-center ">
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-4 gap-4 items-center h-fit p-2"
        >
          {/* Input fields for all hospital attributes */}
          <label className="text-sm mb-1 p-1 font-semibold">
            Hospital Name
          </label>
          <input
            type="text"
            className="p-2 border border-black rounded-lg placeholder:text-xs mb-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Hospital Name"
            required
          />
          <label className="text-sm mb-1 p-1 font-semibold">Address</label>
          <input
            type="text"
            className="p-2 border border-black rounded-lg placeholder:text-xs mb-2"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Address"
            required
          />
          <label className="text-sm mb-1 p-1 font-semibold">Opening Hour</label>
          <input
            type="text"
            className="p-2 border border-black rounded-lg placeholder:text-xs mb-2"
            value={openingHour}
            onChange={(e) => setOpeningHour(e.target.value)}
            placeholder="Opening Hour"
            required
          />
          <label className="text-sm mb-1 p-1 font-semibold">Closing Hour</label>
          <input
            type="text"
            className="p-2 border border-black rounded-lg placeholder:text-xs mb-2"
            value={closingHour}
            onChange={(e) => setClosingHour(e.target.value)}
            placeholder="Closing Hour"
            required
          />
          <label className="text-sm mb-1 p-1 font-semibold">
            Contact Number
          </label>
          <input
            type="text"
            className="p-2 border border-black rounded-lg placeholder:text-xs mb-2"
            value={contactNumber}
            onChange={(e) => setContactNumber(e.target.value)}
            placeholder="Contact Number"
            required
          />
          <label className="text-sm mb-1 p-1 font-semibold">
            Alternative Contact Number
          </label>
          <input
            type="text"
            className="p-2 border border-black rounded-lg placeholder:text-xs mb-2"
            value={alternativeContactNumber}
            onChange={(e) => setAlternativeContactNumber(e.target.value)}
            placeholder="Alternative Contact Number"
          />
          <label className="text-sm mb-1 p-1 font-semibold">
            Hospital Type
          </label>
          <input
            type="text"
            className="p-2 border border-black rounded-lg placeholder:text-xs mb-2"
            value={hospitalType}
            onChange={(e) => setHospitalType(e.target.value)}
            placeholder="Hospital Type"
            required
          />
          <label className="text-sm mb-1 p-1 font-semibold">Province</label>
          <input
            type="number"
            className="p-2 border border-black rounded-lg placeholder:text-xs mb-2"
            value={province}
            onChange={(e) => setProvince(e.target.value)}
            placeholder="Province"
            required
          />
          <label className="text-sm mb-1 p-1 font-semibold">District</label>
          <input
            type="number"
            className="p-2 border border-black rounded-lg placeholder:text-xs mb-2"
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            placeholder="District"
            required
          />
          <label className="text-sm mb-1 p-1 font-semibold">Total Beds</label>
          {/* Repeat inputs for remaining fields */}
          <input
            type="number"
            className="p-2 border border-black rounded-lg placeholder:text-xs mb-2"
            value={totalBeds}
            onChange={(e) => setTotalBeds(e.target.value)}
            placeholder="Total Beds"
            required
          />
          {/* ... additional fields like ICU beds, ventilators, etc. */}
          <div className="flex w-full gap-4">
            <label className="flex text-xs items-center gap-2">
              <input
                type="checkbox"
                checked={oxygenSupportAvailable}
                onChange={(e) => setOxygenSupportAvailable(e.target.checked)}
              />
              Oxygen Support Available
            </label>
            <label className="flex text-xs items-center gap-2">
              <input
                type="checkbox"
                checked={availableBlood}
                onChange={(e) => setAvailableBlood(e.target.checked)}
              />
              Blood Available
            </label>
          </div>

          <div className="w-full col-span-4">
            <button
              type="submit"
              className="w-full h-fit p-2 bg-zinc-800 hover:bg-zinc-900 text-white font-semibold rounded-lg"
            >
              Create Hospital
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

export default HospitalForm;
