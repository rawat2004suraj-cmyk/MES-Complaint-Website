import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import ComplaintCard from '../components/ComplaintCard';
import { useAuth } from '../context/AuthContext';

export default function MyComplaintsPage() {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/api/complaints/my');
      setComplaints(data);
    } catch {
      toast.error('Failed to load complaints');
    } finally {
      setLoading(false);
    }
  };

  const statuses = ['All', 'Pending', 'In Progress', 'Completed'];
  const filtered = filter === 'All' ? complaints : complaints.filter((c) => c.status === filter);

  const counts = {
    All: complaints.length,
    Pending: complaints.filter((c) => c.status === 'Pending').length,
    'In Progress': complaints.filter((c) => c.status === 'In Progress').length,
    Completed: complaints.filter((c) => c.status === 'Completed').length,
  };

  const filterColors = {
    All: 'bg-army-700 text-white border-army-700',
    Pending: 'bg-red-500 text-white border-red-500',
    'In Progress': 'bg-orange-500 text-white border-orange-500',
    Completed: 'bg-green-600 text-white border-green-600',
  };

  const defaultColors = 'bg-white text-gray-600 border-gray-200 hover:border-gray-300';

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="font-display text-3xl font-bold text-army-800">My Complaints</h1>
            <p className="text-gray-500 text-sm mt-1">Hello, {user?.name} 👋 — {complaints.length} total complaint{complaints.length !== 1 ? 's' : ''}</p>
          </div>
          <Link to="/add-complaint" className="btn-primary flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            New Complaint
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`text-sm font-medium px-4 py-2 rounded-full border transition-all ${filter === s ? filterColors[s] : defaultColors}`}
            >
              {s} <span className="ml-1 opacity-75">({counts[s]})</span>
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-army-600 border-t-transparent"></div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <div className="text-5xl mb-4">📋</div>
            <h3 className="font-display text-xl font-bold text-gray-700 mb-2">
              {complaints.length === 0 ? 'No complaints yet' : `No ${filter} complaints`}
            </h3>
            <p className="text-gray-400 text-sm mb-6">
              {complaints.length === 0 ? 'Submit your first complaint to get started.' : 'Try a different filter.'}
            </p>
            {complaints.length === 0 && (
              <Link to="/add-complaint" className="btn-primary inline-block">Submit Complaint</Link>
            )}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {filtered.map((c) => (
              <ComplaintCard key={c._id} complaint={c} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
