import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut, PlusCircle, FileText } from 'lucide-react';

export default function Navbar() {
  const { user, logout, isRecruiter } = useAuth();

  return (
    <header className="bg-white border-b border-naukri-border sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Navigation Links */}
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 cursor-pointer">
            <span className="text-2xl font-black text-naukri-blue tracking-tight">
              naukri
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 bg-blue-50 text-naukri-blue rounded-full border border-blue-200">
              PRO
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-700">
            <Link to="/" className="hover:text-naukri-blue transition-colors">
              Jobs
            </Link>

            {/* Seeker-only Link: My Applications */}
            {user && !isRecruiter && (
              <Link
                to="/my-applications"
                className="hover:text-naukri-blue transition-colors flex items-center gap-1.5 font-semibold text-xs text-gray-700"
              >
                <FileText className="w-3.5 h-3.5 text-naukri-blue" /> My Applications
              </Link>
            )}

            {/* Recruiter-only Links */}
            {isRecruiter && (
              <div className="flex items-center gap-3">
                <Link
                  to="/recruiter/dashboard"
                  className="text-xs bg-amber-100 text-amber-800 px-3 py-1 rounded-full font-semibold hover:bg-amber-200 transition-colors"
                >
                  Recruiter Dashboard
                </Link>
                <Link
                  to="/recruiter/post-job"
                  className="flex items-center gap-1 text-xs text-naukri-blue hover:text-naukri-blueHover font-semibold transition-colors"
                >
                  <PlusCircle className="w-3.5 h-3.5" /> Post a Job
                </Link>
              </div>
            )}
          </nav>
        </div>

        {/* Action Buttons / Auth State */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              {/* Profile / Dashboard Navigation Badge */}
              <Link
                to={isRecruiter ? '/recruiter/dashboard' : '/profile'}
                className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-50 transition-colors"
                title={isRecruiter ? 'Open Recruiter Dashboard' : 'View & Edit Candidate Profile'}
              >
                <div className="w-8 h-8 rounded-full bg-blue-100 text-naukri-blue flex items-center justify-center font-bold text-sm">
                  {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-bold text-gray-800">
                    {user.fullName}
                  </div>
                  <div className="text-[10px] text-gray-500">
                    {isRecruiter ? 'Employer Portal' : 'Jobseeker (View Profile)'}
                  </div>
                </div>
              </Link>

              {/* Logout Button */}
              <button
                onClick={logout}
                title="Logout"
                className="p-2 text-gray-500 hover:text-rose-600 transition-colors rounded-full hover:bg-rose-50"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-semibold text-naukri-blue border border-naukri-blue rounded-full hover:bg-blue-50 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-5 py-2 text-sm font-semibold text-white bg-naukri-blue hover:bg-naukri-blueHover rounded-full shadow-sm transition-colors"
              >
                Register
              </Link>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}