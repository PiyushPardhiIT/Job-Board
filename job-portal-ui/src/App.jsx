import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/layout/Navbar";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import SeekerProfilePage from "./pages/SeekerProfilePage";
import RecruiterDashboardPage from "./pages/RecruiterDashboardPage";
import PostJobPage from "./pages/PostJobPage";
import MyApplicationsPage from './pages/MyApplicationsPage';
import JobApplicantsPage from './pages/JobApplicantsPage';
import Footer from './components/layout/Footer';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Navbar />
        <Routes>
          {/* Public & Candidate Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={<SeekerProfilePage />} />

          {/* Employer / Recruiter Routes */}
          <Route
            path="/recruiter/dashboard"
            element={<RecruiterDashboardPage />}
          />
          <Route path="/recruiter/post-job" element={<PostJobPage />} />
          <Route path="/my-applications" element={<MyApplicationsPage />} />
          <Route
            path="/recruiter/jobs/:jobId/applicants"
            element={<JobApplicantsPage />}
          />
        </Routes>
         <Footer />
      </BrowserRouter>
    </AuthProvider>
  );
}
