import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import ComplaintCard from '../../components/ComplaintCard';

const DEPARTMENTS = ['All', 'Water Supply', 'Electrical', 'B&R'];
const LOCATIONS = ['All', 'Yogendra Vihar', 'VRC', 'Bana Singh', 'APS'];
const STATUSES = ['All', 'Pending', 'In Progress', 'Completed'];

const statColors = {
  Pending: 'text-red-600',
  'In Progress': 'text-orange-500',
  Completed: 'text-green-600',
};

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [complaints, setComplaints] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, completed: 0 });
  const [loading, setLoading] = useState(true);
  const [activeDept, setActiveDept] = useState('All');
  const [filters, setFilters] = useState({ location: 'All', status: 'All' });
  const [searchTerm, setSearchTerm] = useState('');

  const fetchComplaints = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.location !== 'All') params.location = filters.location;
      if (filters.status !== 'All') params.status = filters.status;
      if (activeDept !== 'All') params.department = activeDept;

      const { data } = await API.get('/api/complaints/all', { params });
      setComplaints(data.complaints);
      setStats(data.stats);
    } catch {
      toast.error('Failed to load complaints');
    } finally {
      setLoading(false);
    }
  }, [filters, activeDept]);

  useEffect(() => { fetchComplaints(); }, [fetchComplaints]);

  const handleStatusUpdate = async (id, status, remarks) => {
    try {
      await API.put(`/api/complaints/${id}/status`, { status, remarks });
      toast.success('Complaint updated');
      fetchComplaints();
    } catch {
      toast.error('Update failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this complaint? This action cannot be undone.')) return;
    try {
      await API.delete(`/api/complaints/${id}`);
      toast.success('Complaint deleted');
      fetchComplaints();
    } catch {
      toast.error('Delete failed');
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out');
    navigate('/');
  };

  const displayed = complaints.filter((c) => {
    if (!searchTerm) return true;
    const s = searchTerm.toLowerCase();
    return (
      c.complaintId?.toLowerCase().includes(s) ||
      c.name?.toLowerCase().includes(s) ||
      c.mobile?.includes(s) ||
      c.quarterNumber?.toLowerCase().includes(s)
    );
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Navbar */}
      <nav className="bg-army-900 sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-army-400 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs font-display">MES</span>
            </div>
            <div className="hidden sm:block">
              <span className="text-white font-display font-bold text-base">Admin Dashboard</span>
              <span className="text-army-400 text-xs ml-2">MES Complaint Group</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-army-300 text-sm hidden sm:block">{user?.name}</span>
            <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1.5 rounded-lg transition-colors">
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total', value: stats.total, icon: '📋', color: 'text-army-700', bg: 'bg-army-50' },
            { label: 'Pending', value: stats.pending, icon: '🔴', color: 'text-red-600', bg: 'bg-red-50' },
            { label: 'In Progress', value: stats.inProgress, icon: '🟠', color: 'text-orange-500', bg: 'bg-orange-50' },
            { label: 'Completed', value: stats.completed, icon: '🟢', color: 'text-green-600', bg: 'bg-green-50' },
          ].map((s) => (
            <div key={s.label} className={`${s.bg} rounded-xl p-4 border border-white shadow-sm`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500 font-medium">{s.label}</span>
                <span className="text-lg">{s.icon}</span>
              </div>
              <p className={`font-display text-3xl font-bold ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Filters Row */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-5">
          <div className="flex flex-wrap gap-3 items-center">
            {/* Search */}
            <div className="relative flex-1 min-w-[180px]">
              <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search by ID, name, mobile..."
                className="input-field pl-9 text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="input-field w-auto text-sm"
              value={filters.location}
              onChange={(e) => setFilters({ ...filters, location: e.target.value })}
            >
              {LOCATIONS.map((l) => <option key={l} value={l}>{l === 'All' ? 'All Locations' : l}</option>)}
            </select>
            <select
              className="input-field w-auto text-sm"
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            >
              {STATUSES.map((s) => <option key={s} value={s}>{s === 'All' ? 'All Status' : s}</option>)}
            </select>
            <button onClick={fetchComplaints} className="btn-primary text-sm py-2 px-4 flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
              Refresh
            </button>
          </div>
        </div>

        {/* Department Tabs */}
        <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
          {DEPARTMENTS.map((dept) => {
            const tabColors = {
              All: 'bg-army-700 text-white border-army-700',
              'Water Supply': 'bg-blue-600 text-white border-blue-600',
              Electrical: 'bg-yellow-500 text-white border-yellow-500',
              'B&R': 'bg-gray-600 text-white border-gray-600',
            };
            const activeStyle = activeDept === dept ? tabColors[dept] : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300';
            return (
              <button
                key={dept}
                onClick={() => setActiveDept(dept)}
                className={`whitespace-nowrap text-sm font-medium px-4 py-2 rounded-full border transition-all ${activeStyle}`}
              >
                {dept === 'Water Supply' && '💧 '}
                {dept === 'Electrical' && '⚡ '}
                {dept === 'B&R' && '🏗️ '}
                {dept === 'All' && '📋 '}
                {dept}
                {dept !== 'All' && (
                  <span className="ml-1.5 opacity-75">
                    ({complaints.filter((c) => c.department === dept).length})
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Complaints Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-army-600 border-t-transparent"></div>
          </div>
        ) : displayed.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="font-display text-xl font-bold text-gray-700 mb-2">No complaints found</h3>
            <p className="text-gray-400 text-sm">Try changing your filters or search term.</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-3">Showing {displayed.length} complaint{displayed.length !== 1 ? 's' : ''}</p>
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {displayed.map((c) => (
                <ComplaintCard
                  key={c._id}
                  complaint={c}
                  isAdmin={true}
                  onStatusUpdate={handleStatusUpdate}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <footer className="text-center py-6 text-xs text-gray-400 mt-8">
        MES Complaint Group Admin Panel · Created by <span className="text-gray-500 font-medium">Suraj Rawat</span>
      </footer>
    </div>
  );
}
