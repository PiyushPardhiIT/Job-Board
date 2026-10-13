import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserCheck, Building2, Lock, Mail, User, Phone } from 'lucide-react';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState('ROLE_SEEKER'); // or ROLE_RECRUITER
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    phoneNumber: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register({ ...form, role });
      navigate('/');
    } catch (err) {}
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full rounded-2xl shadow-xl border border-naukri-border p-8">
        <h2 className="text-2xl font-bold text-naukri-navy text-center">Create your profile</h2>
        <p className="text-sm text-naukri-textMuted text-center mt-1">
          Search & apply to jobs or hire top talent on Naukri
        </p>

        {/* Role Switcher Pill */}
        <div className="grid grid-cols-2 gap-2 p-1.5 bg-gray-100 rounded-xl my-6">
          <button
            type="button"
            onClick={() => setRole('ROLE_SEEKER')}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              role === 'ROLE_SEEKER'
                ? 'bg-white text-naukri-blue shadow-sm'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            Jobseeker
          </button>
          <button
            type="button"
            onClick={() => setRole('ROLE_RECRUITER')}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              role === 'ROLE_RECRUITER'
                ? 'bg-white text-naukri-blue shadow-sm'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <Building2 className="w-4 h-4" />
            Employer
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-700">Full Name</label>
            <div className="relative mt-1">
              <User className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
              <input
                type="text"
                required
                placeholder="What is your name?"
                className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-naukri-blue"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-700">Email ID</label>
            <div className="relative mt-1">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
              <input
                type="email"
                required
                placeholder="Tell us your Email ID"
                className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-naukri-blue"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-700">Password</label>
            <div className="relative mt-1">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
              <input
                type="password"
                required
                placeholder="(Minimum 6 characters)"
                className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-naukri-blue"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-700">Mobile Number</label>
            <div className="relative mt-1">
              <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
              <input
                type="tel"
                placeholder="Enter your 10 digit mobile number"
                className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-naukri-blue"
                value={form.phoneNumber}
                onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-naukri-blue hover:bg-naukri-blueHover text-white font-semibold rounded-lg shadow transition-colors text-sm mt-2"
          >
            Register Now
          </button>
        </form>

        <p className="text-center text-xs text-gray-600 mt-6">
          Already registered?{' '}
          <Link to="/login" className="text-naukri-blue font-semibold hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}