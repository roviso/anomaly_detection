// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import LandingPage from './components/LandingPage';
import Login from './components/login';
import Register from './components/register';
import Confirmation from './components/Confirmation';
import Dashboard from './components/Dashboard';
import HospitalDetails from './components/HospitalDetails';
import HospitalForm from './components/HospitalForm';
import EditAmbulance from './components/EditAmbulance';
import EditAmbulanceForm from './components/EditAmbulanceForm'; // Create this file
import AddAmbulance from './components/AddAmbulance';
import EditBlood from './components/EditBlood';
import AddBlood from './components/AddBlood';
import HospitalEdit from './components/HospitalEdit';
import AccountDetail from './components/AccountDetail';
import { AuthProvider } from './context/AuthContext';
// ... import other necessary components

function App() {
  return (
    <AuthProvider>
      <Router>
      <Header />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/email-confirmation/:registrationToken" element={<Confirmation />} />
          <Route path="/account-detail" element={<AccountDetail />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/hospitals/profile/detail/:id" element={<HospitalDetails />} />
          <Route path="/create-hospital" element={<HospitalForm />} />
          <Route path="/update-hospital/:id" element={<HospitalEdit />} />

          <Route path="/hospitals/:hospitalId/edit-ambulance" element={<EditAmbulance />} />
          <Route path="/hospitals/:id/edit-ambulance/:ambulanceId" element={<EditAmbulanceForm />} />
          <Route path="/hospitals/:hospitalId/add-ambulance" element={<AddAmbulance />} />


          <Route path="/hospitals/:hospitalId/edit-blood" element={<EditBlood />} />
          <Route path="/hospitals/:hospitalId/add-blood" element={<AddBlood />} />
          {/* Define routes for other components as needed */}
        </Routes>
    </Router>

    </AuthProvider>
    
  );
}

export default App;
