import React from 'react';

const statusClass = {
  'Pending': 'status-pending',
  'In Progress': 'status-in-progress',
  'Completed': 'status-completed',
};

const deptClass = {
  'Water Supply': 'dept-water',
  'Electrical': 'dept-electrical',
  'B&R': 'dept-br',
};

const deptIcon = {
  'Water Supply': '💧',
  'Electrical': '⚡',
  'B&R': '🏗️',
};

export default function ComplaintCard({ complaint, isAdmin = false, onStatusUpdate, onDelete }) {
  const date = new Date(complaint.date || complaint.createdAt).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric'
  });

  return (
    <div className="card p-4 animate-fadeInUp">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
        <div>
          <p className="text-xs text-gray-500 font-mono">{complaint.complaintId}</p>
          <p className="text-sm text-gray-400">{date}</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${deptClass[complaint.department] || 'bg-gray-100 text-gray-600'}`}>
            {deptIcon[complaint.department]} {complaint.department}
          </span>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusClass[complaint.status] || 'bg-gray-100 text-gray-600'}`}>
            {complaint.status}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="space-y-1.5 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-gray-500 text-xs w-20 shrink-0">Name</span>
          <span className="text-sm font-medium text-gray-800">{complaint.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-500 text-xs w-20 shrink-0">Location</span>
          <span className="text-sm text-gray-700">{complaint.location} — Qtr {complaint.quarterNumber}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-500 text-xs w-20 shrink-0">Type</span>
          <span className="text-sm text-gray-700">{complaint.complaintType}</span>
        </div>
        <div className="flex items-start gap-2">
          <span className="text-gray-500 text-xs w-20 shrink-0 mt-0.5">Details</span>
          <span className="text-sm text-gray-600 leading-snug">{complaint.description}</span>
        </div>
        {complaint.remarks && (
          <div className="flex items-start gap-2 mt-1 p-2 bg-army-50 rounded-lg">
            <span className="text-army-600 text-xs w-20 shrink-0 mt-0.5">Remarks</span>
            <span className="text-sm text-army-800">{complaint.remarks}</span>
          </div>
        )}
      </div>

      {/* Photo */}
      {complaint.photoUrl && (
        <a href={`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${complaint.photoUrl}`} target="_blank" rel="noreferrer"
          className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline mb-3">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          View Photo
        </a>
      )}

      {/* Admin Controls */}
      {isAdmin && (
        <div className="border-t border-gray-100 pt-3 flex flex-wrap gap-2 items-center">
          <select
            value={complaint.status}
            onChange={(e) => onStatusUpdate(complaint._id, e.target.value, complaint.remarks)}
            className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:border-army-400 cursor-pointer"
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
          <input
            type="text"
            placeholder="Add remark..."
            defaultValue={complaint.remarks || ''}
            onBlur={(e) => {
              if (e.target.value !== (complaint.remarks || '')) {
                onStatusUpdate(complaint._id, complaint.status, e.target.value);
              }
            }}
            className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 flex-1 min-w-0 focus:outline-none focus:border-army-400"
          />
          <button
            onClick={() => onDelete(complaint._id)}
            className="text-xs bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-3 py-1.5 rounded-lg transition-colors"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
