import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {}
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full rounded-2xl shadow-xl border border-naukri-border p-8">
        <h2 className="text-2xl font-bold text-naukri-navy text-center">Login</h2>
        <p className="text-sm text-naukri-textMuted text-center mt-1">
          Stay updated on your professional world
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          <div>
            <label className="text-xs font-semibold text-gray-700">Email ID / Username</label>
            <div className="relative mt-1">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
              <input
                type="email"
                required
                placeholder="Enter your email"
                className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-naukri-blue"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                placeholder="Enter password"
                className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-naukri-blue"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-naukri-blue hover:bg-naukri-blueHover text-white font-semibold rounded-lg shadow transition-colors text-sm mt-2"
          >
            Login
          </button>
        </form>

        <p className="text-center text-xs text-gray-600 mt-6">
          New to Naukri?{' '}
          <Link to="/register" className="text-naukri-blue font-semibold hover:underline">
            Register for free
          </Link>
        </p>
      </div>
    </div>
  );
}