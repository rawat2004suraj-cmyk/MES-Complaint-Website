import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';

export default function LoginPage() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ mobile: '', password: '' });
  const [loading, setLoading] = useState(false);

  if (user) {
    navigate(user.role === 'admin' ? '/admin/dashboard' : '/my-complaints');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.mobile || !form.password) return toast.error('Please fill all fields');
    setLoading(true);
    try {
      const loggedIn = await login(form.mobile, form.password);
      toast.success(`Welcome back, ${loggedIn.name}!`);
      navigate(loggedIn.role === 'admin' ? '/admin/dashboard' : '/my-complaints');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] px-4 py-12">
        <div className="w-full max-w-md animate-fadeInUp">
          {/* Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            {/* Top bar */}
            <div className="bg-army-800 px-8 py-6 text-white">
              <div className="w-10 h-10 bg-army-400 rounded-xl flex items-center justify-center mb-3">
                <span className="font-display font-bold text-sm">MES</span>
              </div>
              <h1 className="font-display text-2xl font-bold">Welcome Back</h1>
              <p className="text-army-300 text-sm mt-1">Sign in to your account</p>
            </div>

            <form onSubmit={handleSubmit} className="px-8 py-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Mobile Number</label>
                <input
                  type="tel"
                  placeholder="Enter 10-digit mobile"
                  className="input-field"
                  value={form.mobile}
                  onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                  maxLength={10}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  className="input-field"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full mt-2 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                {loading ? (
                  <><span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span> Signing in...</>
                ) : 'Sign In'}
              </button>
            </form>

            <div className="px-8 pb-6 text-center space-y-2">
              <p className="text-sm text-gray-500">
                Don't have an account?{' '}
                <Link to="/register" className="text-army-600 hover:text-army-800 font-medium">Register here</Link>
              </p>
              <p className="text-sm text-gray-500">
                Admin?{' '}
                <Link to="/admin/login" className="text-army-600 hover:text-army-800 font-medium">Admin Login</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
