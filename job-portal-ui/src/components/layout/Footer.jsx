import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-20 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1 */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl font-black text-naukri-blue tracking-tight">naukri</span>
              <span className="text-xs font-semibold px-2 py-0.5 bg-blue-50 text-naukri-blue rounded-full border border-blue-200">PRO</span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              Connect with top employers across India. Apply to verified jobs or hire the best engineering talent.
            </p>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">Jobseekers</h4>
            <ul className="space-y-2 text-xs text-gray-600">
              <li><Link to="/" className="hover:text-naukri-blue">Search Jobs</Link></li>
              <li><Link to="/profile" className="hover:text-naukri-blue">Profile Completeness</Link></li>
              <li><Link to="/my-applications" className="hover:text-naukri-blue">Application Tracker</Link></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">Employers</h4>
            <ul className="space-y-2 text-xs text-gray-600">
              <li><Link to="/recruiter/post-job" className="hover:text-naukri-blue">Post a Job</Link></li>
              <li><Link to="/recruiter/dashboard" className="hover:text-naukri-blue">Employer Dashboard</Link></li>
              <li><Link to="/recruiter/dashboard" className="hover:text-naukri-blue">Candidate ATS</Link></li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">Fast Links</h4>
            <ul className="space-y-2 text-xs text-gray-600">
              <li><a href="#privacy" className="hover:text-naukri-blue">Privacy Policy</a></li>
              <li><a href="#terms" className="hover:text-naukri-blue">Terms & Conditions</a></li>
              <li><a href="#support" className="hover:text-naukri-blue">Help Center</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-4">
          <p>© 2026 Naukri Clone Platform. All rights reserved.</p>
          <p>Engineered with Spring Boot 3, Spring Security 6, React & MySQL.</p>
        </div>
      </div>
    </footer>
  );
}