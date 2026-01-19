// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import api from '../api/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) fetchUser();
    else setLoading(false);
  }, []);

  const fetchUser = async () => {
    try {
      const res = await api.get('/auth/me'); // backend endpoint to get user info
      setUser(res.data);
    } catch (err) {
      console.error(err);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const login = (token, role) => {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    fetchUser();
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
