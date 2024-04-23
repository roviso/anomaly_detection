import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import AccountDetail from "./components/AccountDetail";
import AddAmbulance from "./components/AddAmbulance";
import AddBlood from "./components/AddBlood";
import Dashboard from "./components/Dashboard";
import EditAmbulance from "./components/EditAmbulance";
import EditAmbulanceForm from "./components/EditAmbulanceForm"; // Create this file
import EditBlood from "./components/EditBlood";
import HospitalDetails from "./components/HospitalDetails";
import HospitalEdit from "./components/HospitalEdit";
import HospitalForm from "./components/HospitalForm";
import LandingPage from "./components/LandingPage/LandingPage.jsx";
import Layout from "./components/Layout.jsx";
import Login from "./components/LoginPage/LoginPage.jsx";
import Register from "./components/RegisterPage/RegisterPage.jsx";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <div>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/account-detail" element={<AccountDetail />} />
            <Route
              path="/dashboard"
              element={<Layout ContentComponent={<Dashboard />} />}
            />
            <Route
              path="/hospitals/profile/detail/:id"
              element={<HospitalDetails />}
            />
            <Route
              path="/create-hospital"
              element={<Layout ContentComponent={<HospitalForm />} />}
            />
            <Route
              path="/update-hospital/:id"
              element={<Layout ContentComponent={<HospitalEdit />} />}
            />

            <Route
              path="/hospitals/:hospitalId/edit-ambulance"
              element={<Layout ContentComponent={<EditAmbulance />} />}
            />
            <Route
              path="/hospitals/:id/edit-ambulance/:ambulanceId"
              element={<Layout ContentComponent={<EditAmbulanceForm />} />}
            />
            <Route
              path="/hospitals/:hospitalId/add-ambulance"
              element={<Layout ContentComponent={<AddAmbulance />} />}
            />

            <Route
              path="/hospitals/:hospitalId/edit-blood"
              element={<Layout ContentComponent={<EditBlood />} />}
            />
            <Route
              path="/hospitals/:hospitalId/add-blood"
              element={<Layout ContentComponent={<AddBlood />} />}
            />
            {/* Define routes for other components as needed */}
          </Routes>
        </Router>
      </AuthProvider>
    </div>
  );
}

export default App;
