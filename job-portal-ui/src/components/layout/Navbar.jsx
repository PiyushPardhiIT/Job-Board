import React from 'react';
import { Search, Briefcase, Bell, User } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="bg-white border-b border-naukri-border sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Main Nav */}
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2 cursor-pointer">
            <span className="text-2xl font-black text-naukri-blue tracking-tight">naukri</span>
            <span className="text-xs font-semibold px-2 py-0.5 bg-blue-50 text-naukri-blue rounded-full border border-blue-200">PRO</span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-700">
            <a href="#jobs" className="hover:text-naukri-blue transition-colors">Jobs</a>
            <a href="#companies" className="hover:text-naukri-blue transition-colors">Companies</a>
            <a href="#services" className="hover:text-naukri-blue transition-colors">Services</a>
          </nav>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          <button className="px-4 py-2 text-sm font-semibold text-naukri-blue border border-naukri-blue rounded-full hover:bg-blue-50 transition-colors">
            Login
          </button>
          <button className="px-5 py-2 text-sm font-semibold text-white bg-naukri-blue hover:bg-naukri-blueHover rounded-full shadow-sm transition-colors">
            Register
          </button>
          <div className="h-6 w-px bg-gray-200 hidden sm:block"></div>
          <button className="text-xs font-medium text-gray-600 hover:text-naukri-blue hidden sm:block">
            Employers / Post Job
          </button>
        </div>

      </div>
    </header>
  );
}