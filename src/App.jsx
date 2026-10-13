import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';

// Public Pages
import Home from './pages/Home';
import FindBlood from './pages/FindBlood';
import EmergencyRequest from './pages/EmergencyRequest';
import Login from './pages/Login';
import Register from './pages/Register';

// Role Dashboard Pages
import PatientDashboard from './pages/dashboards/PatientDashboard';
import HospitalDashboard from './pages/dashboards/HospitalDashboard';
import BloodBankDashboard from './pages/dashboards/BloodBankDashboard';
import DonorDashboard from './pages/dashboards/DonorDashboard';
import AdminDashboard from './pages/dashboards/AdminDashboard';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Core Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/find-blood" element={<FindBlood />} />
          <Route path="/emergency-request" element={<EmergencyRequest />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Role-Based Dashboards */}
          <Route
            path="/dashboard/patient"
            element={
              <ProtectedRoute allowedRoles={['patient', 'admin']}>
                <PatientDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/hospital"
            element={
              <ProtectedRoute allowedRoles={['hospital', 'admin']}>
                <HospitalDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/blood_bank"
            element={
              <ProtectedRoute allowedRoles={['blood_bank', 'admin']}>
                <BloodBankDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/donor"
            element={
              <ProtectedRoute allowedRoles={['donor', 'admin']}>
                <DonorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Fallback to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
