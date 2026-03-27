import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function AdminLoginPage() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ mobile: '', password: '' });
  const [loading, setLoading] = useState(false);

  if (user?.role === 'admin') { navigate('/admin/dashboard'); return null; }
  if (user?.role === 'user') { navigate('/my-complaints'); return null; }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.mobile || !form.password) return toast.error('Please fill all fields');
    setLoading(true);
    try {
      const u = await login(form.mobile, form.password);
      if (u.role !== 'admin') {
        toast.error('Access denied: not an admin account');
        return;
      }
      toast.success('Admin login successful');
      navigate('/admin/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-army-900 flex items-center justify-center px-4"
      style={{ background: 'linear-gradient(135deg, #122004 0%, #1e3606 50%, #2c4c09 100%)' }}>
      <div className="w-full max-w-md animate-fadeInUp">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-army-400 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="font-display font-bold text-xl text-white">MES</span>
          </div>
          <h1 className="font-display text-3xl font-bold text-white">Admin Portal</h1>
          <p className="text-army-400 text-sm mt-1">MES Complaint Group — Restricted Access</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl p-3 mb-6">
            <span className="text-amber-500 text-lg">🔒</span>
            <p className="text-amber-700 text-xs font-medium">This area is for authorised administrators only</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Admin Mobile</label>
              <input
                type="tel"
                className="input-field"
                placeholder="Enter admin mobile"
                value={form.mobile}
                onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                maxLength={10}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <input
                type="password"
                className="input-field"
                placeholder="Admin password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full mt-2 flex items-center justify-center gap-2 disabled:opacity-60">
              {loading ? <><span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span> Verifying...</> : 'Access Admin Panel'}
            </button>
          </form>
        </div>

        <p className="text-center text-army-500 text-xs mt-6">
          Created by <span className="text-army-300 font-medium">Suraj Rawat</span> · MES Complaint Group
        </p>
      </div>
    </div>
  );
}
