import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('mes_user');
    const token = localStorage.getItem('mes_token');
    if (stored && token) {
      setUser(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  const login = async (mobile, password) => {
    const { data } = await API.post('/api/auth/login', { mobile, password });
    localStorage.setItem('mes_token', data.token);
    localStorage.setItem('mes_user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const register = async (name, mobile, password) => {
    const { data } = await API.post('/api/auth/register', { name, mobile, password });
    localStorage.setItem('mes_token', data.token);
    localStorage.setItem('mes_user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('mes_token');
    localStorage.removeItem('mes_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
