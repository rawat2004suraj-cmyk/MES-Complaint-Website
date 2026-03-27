import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';

const LOCATIONS = ['Yogendra Vihar', 'VRC', 'Bana Singh', 'APS'];
const DEPARTMENTS = ['Water Supply', 'Electrical', 'B&R'];
const COMPLAINT_TYPES = {
  'Water Supply': ['No Water Supply', 'Low Pressure', 'Water Leakage', 'Dirty Water', 'Pipe Burst', 'Other'],
  'Electrical': ['Power Outage', 'Voltage Fluctuation', 'Faulty Wiring', 'Street Light Issue', 'Short Circuit', 'Other'],
  'B&R': ['Road Damage', 'Seepage in Wall', 'Roof Leak', 'Door/Window Repair', 'Drain Blocked', 'Other'],
};

const initialForm = {
  name: '', mobile: '', location: '', quarterNumber: '',
  department: '', complaintType: '', description: '', photo: null,
};

export default function AddComplaintPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ ...initialForm, name: user?.name || '', mobile: user?.mobile || '' });
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error('Photo must be under 5MB'); return; }
    set('photo', file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, mobile, location, quarterNumber, department, complaintType, description } = form;
    if (!name || !mobile || !location || !quarterNumber || !department || !complaintType || !description) {
      return toast.error('Please fill all required fields');
    }

    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => {
      if (k === 'photo' && v) data.append('photo', v);
      else if (k !== 'photo') data.append(k, v);
    });

    setLoading(true);
    try {
      const res = await API.post('/api/complaints', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success(`Complaint ${res.data.complaint.complaintId} submitted!`);
      navigate('/my-complaints');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  const types = form.department ? COMPLAINT_TYPES[form.department] : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Page header */}
        <div className="mb-6">
          <h1 className="font-display text-3xl font-bold text-army-800">Submit New Complaint</h1>
          <p className="text-gray-500 text-sm mt-1">Fill the form below. A unique Complaint ID will be auto-generated.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5 animate-fadeInUp">
          {/* Section: Personal Info */}
          <div>
            <h2 className="font-display text-lg font-semibold text-army-700 border-b border-gray-100 pb-2 mb-4">Personal Information</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name <span className="text-red-500">*</span></label>
                <input type="text" className="input-field" value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Your full name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Mobile Number <span className="text-red-500">*</span></label>
                <input type="tel" className="input-field" value={form.mobile} onChange={(e) => set('mobile', e.target.value.replace(/\D/g, ''))} placeholder="10-digit number" maxLength={10} />
              </div>
            </div>
          </div>

          {/* Section: Location */}
          <div>
            <h2 className="font-display text-lg font-semibold text-army-700 border-b border-gray-100 pb-2 mb-4">Location Details</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Location <span className="text-red-500">*</span></label>
                <select className="input-field" value={form.location} onChange={(e) => set('location', e.target.value)}>
                  <option value="">Select location</option>
                  {LOCATIONS.map((l) => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Quarter Number <span className="text-red-500">*</span></label>
                <input type="text" className="input-field" value={form.quarterNumber} onChange={(e) => set('quarterNumber', e.target.value)} placeholder="e.g. A-12, B-7" />
              </div>
            </div>
          </div>

          {/* Section: Complaint */}
          <div>
            <h2 className="font-display text-lg font-semibold text-army-700 border-b border-gray-100 pb-2 mb-4">Complaint Details</h2>
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Department <span className="text-red-500">*</span></label>
                  <select className="input-field" value={form.department} onChange={(e) => { set('department', e.target.value); set('complaintType', ''); }}>
                    <option value="">Select department</option>
                    {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Complaint Type <span className="text-red-500">*</span></label>
                  <select className="input-field" value={form.complaintType} onChange={(e) => set('complaintType', e.target.value)} disabled={!form.department}>
                    <option value="">Select type</option>
                    {types.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Description <span className="text-red-500">*</span></label>
                <textarea
                  className="input-field min-h-[100px] resize-none"
                  value={form.description}
                  onChange={(e) => set('description', e.target.value)}
                  placeholder="Describe the issue in detail..."
                  rows={4}
                />
              </div>
            </div>
          </div>

          {/* Photo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Photo (Optional)</label>
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:border-army-300 transition-colors">
              <input type="file" accept="image/*" onChange={handlePhoto} className="hidden" id="photo-upload" />
              {preview ? (
                <div className="relative">
                  <img src={preview} alt="preview" className="mx-auto max-h-40 rounded-lg object-cover" />
                  <button type="button" onClick={() => { setPreview(null); set('photo', null); }} className="mt-2 text-xs text-red-500 hover:underline">Remove</button>
                </div>
              ) : (
                <label htmlFor="photo-upload" className="cursor-pointer">
                  <div className="text-3xl mb-2">📷</div>
                  <p className="text-sm text-gray-500">Click to upload photo</p>
                  <p className="text-xs text-gray-400 mt-1">JPG, PNG or WebP • Max 5MB</p>
                </label>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => navigate('/my-complaints')} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-60">
              {loading ? <><span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span> Submitting...</> : 'Submit Complaint'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
