import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SeekerProfilePage from './pages/SeekerProfilePage';
import JobListingPage from './pages/JobListingPage';
import MyApplicationsPage from './pages/MyApplicationsPage';
import RecruiterDashboardPage from './pages/RecruiterDashboardPage';
import PostJobPage from './pages/PostJobPage';
import JobApplicantsPage from './pages/JobApplicantsPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Navbar />
        <Routes>
          {/* Public & Candidate Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/jobs" element={<JobListingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={<SeekerProfilePage />} />
          <Route path="/my-applications" element={<MyApplicationsPage />} />

          {/* Employer / Recruiter Routes */}
          <Route path="/recruiter/dashboard" element={<RecruiterDashboardPage />} />
          <Route path="/recruiter/post-job" element={<PostJobPage />} />
          <Route path="/recruiter/jobs/:jobId/applicants" element={<JobApplicantsPage />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  );
}