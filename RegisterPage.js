import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';

export default function RegisterPage() {
  const { register, user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', mobile: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);

  if (user) {
    navigate('/my-complaints');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.mobile || !form.password) return toast.error('Please fill all fields');
    if (form.mobile.length !== 10) return toast.error('Mobile must be 10 digits');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    if (form.password !== form.confirm) return toast.error('Passwords do not match');

    setLoading(true);
    try {
      await register(form.name, form.mobile, form.password);
      toast.success('Registration successful! Welcome.');
      navigate('/my-complaints');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] px-4 py-12">
        <div className="w-full max-w-md animate-fadeInUp">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-army-800 px-8 py-6 text-white">
              <div className="w-10 h-10 bg-army-400 rounded-xl flex items-center justify-center mb-3">
                <span className="font-display font-bold text-sm">MES</span>
              </div>
              <h1 className="font-display text-2xl font-bold">Create Account</h1>
              <p className="text-army-300 text-sm mt-1">Register to submit complaints</p>
            </div>

            <form onSubmit={handleSubmit} className="px-8 py-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  className="input-field"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Mobile Number</label>
                <input
                  type="tel"
                  placeholder="10-digit mobile number"
                  className="input-field"
                  value={form.mobile}
                  onChange={(e) => setForm({ ...form, mobile: e.target.value.replace(/\D/g, '') })}
                  maxLength={10}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                <input
                  type="password"
                  placeholder="Minimum 6 characters"
                  className="input-field"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
                <input
                  type="password"
                  placeholder="Re-enter password"
                  className="input-field"
                  value={form.confirm}
                  onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                />
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full mt-2 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                {loading ? (
                  <><span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span> Creating account...</>
                ) : 'Create Account'}
              </button>
            </form>

            <div className="px-8 pb-6 text-center">
              <p className="text-sm text-gray-500">
                Already have an account?{' '}
                <Link to="/login" className="text-army-600 hover:text-army-800 font-medium">Login here</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
