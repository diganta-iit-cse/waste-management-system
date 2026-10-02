import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { VoiceProvider } from './context/VoiceContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import VoiceAssistant from './components/VoiceAssistant';

// Pages
import HomePage from './pages/HomePage';
import ClassifyPage from './pages/ClassifyPage';
import ServicesPage from './pages/ServicesPage';
import PickupPage from './pages/PickupPage';
import HistoryPage from './pages/HistoryPage';
import DashboardPage from './pages/DashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import SettingsPage from './pages/SettingsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

function App() {
  return (
    <AuthProvider>
      <VoiceProvider>
        <div className="min-h-screen flex flex-col bg-gray-950 text-gray-100 antialiased selection:bg-emerald-500 selection:text-white">
          {/* Main Top Navigation with Global Voice Search */}
          <Navbar />

          {/* Page Routing */}
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/classify" element={<ClassifyPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/pickup" element={<PickupPage />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/admin" element={<AdminDashboardPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          {/* Floating Global Voice Assistant (Requirement #52 & #53) */}
          <VoiceAssistant />

          {/* Site Footer */}
          <Footer />
        </div>
      </VoiceProvider>
    </AuthProvider>
  );
}

export default App;
