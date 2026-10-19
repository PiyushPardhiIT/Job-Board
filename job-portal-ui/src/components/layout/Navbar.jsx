import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { LogOut } from "lucide-react";

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
            {isRecruiter && (
              <span className="text-xs bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full font-semibold">
                Recruiter Portal
              </span>
            )}
          </nav>
        </div>

        {/* Action Buttons / Auth State */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              {/* Clickable Profile Badge */}
              <Link
                to="/profile"
                className="flex items-center gap-2 p-1 rounded-lg hover:bg-gray-50 transition-colors"
                title="View & Edit Profile"
              >
                <div className="w-8 h-8 rounded-full bg-blue-100 text-naukri-blue flex items-center justify-center font-bold text-sm">
                  {user.fullName ? user.fullName.charAt(0).toUpperCase() : "U"}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-bold text-gray-800">
                    {user.fullName}
                  </div>
                  <div className="text-[10px] text-gray-500">
                    {isRecruiter ? "Employer" : "Jobseeker (View Profile)"}
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