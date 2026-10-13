import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const res = await api.get('/auth/me');
          setUser(res.data);
        } catch (err) {
          logout();
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token: jwtToken, ...userData } = res.data;
      localStorage.setItem('token', jwtToken);
      setToken(jwtToken);
      setUser(userData);
      toast.success(`Welcome back, ${userData.fullName}!`);
      return userData;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Invalid credentials.');
      throw err;
    }
  };

  const register = async (formData) => {
    try {
      const res = await api.post('/auth/register', formData);
      const { token: jwtToken, ...userData } = res.data;
      localStorage.setItem('token', jwtToken);
      setToken(jwtToken);
      setUser(userData);
      toast.success('Registration successful!');
      return userData;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed.');
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    toast.success('Logged out successfully');
  };

  const isRecruiter = user?.roles?.includes('ROLE_RECRUITER');
  const isSeeker = user?.roles?.includes('ROLE_SEEKER');

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, isRecruiter, isSeeker }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);