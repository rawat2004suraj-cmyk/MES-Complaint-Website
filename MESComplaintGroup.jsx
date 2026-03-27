import { useState, useEffect, useRef } from "react";

/* ─── CONSTANTS ─────────────────────────────────────────────────────────── */
const ADMIN_EMAIL = "admin@mes.gov.in";
const LOCATIONS = ["Yogendra Vihar", "VRC", "Bana Singh", "APS"];
const DEPARTMENTS = ["Water Supply", "Electrical", "B&R"];
const COMPLAINT_TYPES = {
  "Water Supply": ["No Water Supply", "Low Water Pressure", "Water Leakage", "Dirty Water", "Pipe Burst", "Overhead Tank Issue", "Other"],
  "Electrical": ["Power Outage", "Faulty Wiring", "Street Light Issue", "Meter Problem", "Voltage Fluctuation", "Transformer Fault", "Other"],
  "B&R": ["Road Damage / Pothole", "Building Crack", "Drainage Blockage", "Roof Leakage", "Paint Required", "Sewage Issue", "Other"],
};
const STATUSES = ["Pending", "In Progress", "Completed"];

const DEMO_COMPLAINTS = [
  { id: "MES-20260315-142", date: "2026-03-15", name: "Rajesh Kumar", mobile: "9876543210", location: "Yogendra Vihar", quarterNumber: "A-12", department: "Water Supply", complaintType: "No Water Supply", description: "No water supply since morning. Kitchen and bathroom completely dry.", photo: null, status: "In Progress", remarks: "Plumber dispatched, work in progress", submittedBy: "user@gmail.com" },
  { id: "MES-20260318-387", date: "2026-03-18", name: "Priya Sharma", mobile: "8765432109", location: "VRC", quarterNumber: "B-7", department: "Electrical", complaintType: "Power Outage", description: "Electricity not working in the entire block since yesterday evening.", photo: null, status: "Pending", remarks: "", submittedBy: "priya@gmail.com" },
  { id: "MES-20260320-521", date: "2026-03-20", name: "Amit Singh", mobile: "7654321098", location: "Bana Singh", quarterNumber: "C-3", department: "B&R", complaintType: "Road Damage / Pothole", description: "Large pothole in front of quarter causing vehicle damage.", photo: null, status: "Completed", remarks: "Road repaired on 22 March 2026", submittedBy: "amit@gmail.com" },
  { id: "MES-20260322-089", date: "2026-03-22", name: "Sunita Verma", mobile: "6543210987", location: "APS", quarterNumber: "D-15", department: "Water Supply", complaintType: "Water Leakage", description: "Water leaking from main pipe near the entrance gate.", photo: null, status: "Pending", remarks: "", submittedBy: "user@gmail.com" },
  { id: "MES-20260324-763", date: "2026-03-24", name: "Vijay Pandey", mobile: "9123456780", location: "Yogendra Vihar", quarterNumber: "A-8", department: "Electrical", complaintType: "Street Light Issue", description: "Street lights on main road not working for 3 days.", photo: null, status: "In Progress", remarks: "Team dispatched for inspection", submittedBy: "vijay@gmail.com" },
  { id: "MES-20260325-334", date: "2026-03-25", name: "Meena Gupta", mobile: "9012345678", location: "VRC", quarterNumber: "E-2", department: "B&R", complaintType: "Roof Leakage", description: "Roof leaking heavily during rains. Plaster falling off ceiling.", photo: null, status: "Pending", remarks: "", submittedBy: "user@gmail.com" },
];

/* ─── HELPERS ────────────────────────────────────────────────────────────── */
const genId = () => {
  const d = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  return `MES-${d}-${Math.floor(100 + Math.random() * 900)}`;
};
const today = () => new Date().toISOString().slice(0, 10);

const DEPT_COLORS = {
  "Water Supply": { bg: "#DBEAFE", text: "#1D4ED8", badge: "#2563EB", border: "#93C5FD", icon: "💧", tabColor: "#2563EB" },
  "Electrical":   { bg: "#FEF9C3", text: "#92400E", badge: "#D97706", border: "#FDE68A", icon: "⚡", tabColor: "#D97706" },
  "B&R":          { bg: "#F3F4F6", text: "#374151", badge: "#6B7280", border: "#D1D5DB", icon: "🏗️", tabColor: "#4B5563" },
};
const STATUS_CONF = {
  "Pending":     { bg: "#FEF3C7", text: "#92400E", dot: "#F59E0B", label: "Pending" },
  "In Progress": { bg: "#D1FAE5", text: "#065F46", dot: "#10B981", label: "In Progress" },
  "Completed":   { bg: "#EDE9FE", text: "#4C1D95", dot: "#7C3AED", label: "Completed" },
};

/* ─── GLOBAL STYLES ──────────────────────────────────────────────────────── */
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700&family=Noto+Sans:wght@400;500;600&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Noto Sans', sans-serif; background: #0F2318; }
    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-thumb { background: #2D5A3D; border-radius: 4px; }
    .app-shell {
      max-width: 430px; margin: 0 auto;
      min-height: 100vh; display: flex; flex-direction: column;
      background: #F8FAF9; position: relative; overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #0F4C2A 0%, #1B6B3A 60%, #0D5C32 100%);
      padding: 16px 20px 12px; color: white;
      box-shadow: 0 2px 12px rgba(0,0,0,0.3);
      position: sticky; top: 0; z-index: 50;
    }
    .header-top { display: flex; align-items: center; justify-content: space-between; }
    .header-logo { display: flex; align-items: center; gap: 10px; }
    .header-emblem {
      width: 38px; height: 38px; background: rgba(255,255,255,0.15);
      border-radius: 50%; display: flex; align-items: center; justify-content: center;
      font-size: 20px; border: 1.5px solid rgba(255,255,255,0.3);
    }
    .header-title { font-family: 'Rajdhani', sans-serif; font-size: 17px; font-weight: 700; letter-spacing: 0.5px; }
    .header-sub { font-size: 10px; opacity: 0.75; letter-spacing: 1px; text-transform: uppercase; }
    .user-badge {
      display: flex; align-items: center; gap: 6px;
      background: rgba(255,255,255,0.12); border-radius: 20px;
      padding: 5px 10px 5px 6px; cursor: pointer; transition: background 0.2s;
    }
    .user-badge:hover { background: rgba(255,255,255,0.2); }
    .user-avatar {
      width: 26px; height: 26px; border-radius: 50%;
      background: #FFD700; color: #0F4C2A;
      font-size: 12px; font-weight: 700;
      display: flex; align-items: center; justify-content: center;
    }
    .user-name { font-size: 12px; font-weight: 600; max-width: 80px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .admin-chip {
      background: #FFD700; color: #0F4C2A; font-size: 9px; font-weight: 700;
      padding: 2px 6px; border-radius: 10px; letter-spacing: 0.5px;
      font-family: 'Rajdhani', sans-serif; text-transform: uppercase; margin-top: 2px;
    }
    .tab-bar {
      display: flex; background: #0F2318;
      border-top: 1px solid #1E4D2B;
      position: sticky; bottom: 0; z-index: 50;
    }
    .tab-item {
      flex: 1; padding: 8px 2px 10px; display: flex; flex-direction: column;
      align-items: center; gap: 3px; cursor: pointer;
      border: none; background: transparent; transition: all 0.2s; position: relative;
    }
    .tab-item.active::after {
      content: ''; position: absolute; top: 0; left: 50%; transform: translateX(-50%);
      width: 32px; height: 2px; border-radius: 0 0 4px 4px; background: currentColor;
    }
    .tab-icon { font-size: 18px; }
    .tab-label { font-size: 9px; font-weight: 600; letter-spacing: 0.3px; font-family: 'Rajdhani', sans-serif; text-transform: uppercase; }
    .content-area { flex: 1; overflow-y: auto; padding: 16px; padding-bottom: 80px; }
    .card {
      background: white; border-radius: 12px; padding: 14px;
      box-shadow: 0 1px 6px rgba(0,0,0,0.08); margin-bottom: 12px;
      border: 1px solid #E5EDE8; transition: box-shadow 0.2s;
    }
    .card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.12); }
    .complaint-id {
      font-family: 'Rajdhani', sans-serif; font-size: 13px;
      color: #0F4C2A; font-weight: 700; letter-spacing: 1px;
    }
    .complaint-date { font-size: 11px; color: #9CA3AF; }
    .dept-badge {
      display: inline-flex; align-items: center; gap: 4px;
      padding: 3px 8px; border-radius: 20px; font-size: 11px;
      font-weight: 600; font-family: 'Rajdhani', sans-serif; letter-spacing: 0.3px;
    }
    .status-badge {
      display: inline-flex; align-items: center; gap: 5px;
      padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 600;
      font-family: 'Rajdhani', sans-serif; letter-spacing: 0.3px;
    }
    .status-dot { width: 6px; height: 6px; border-radius: 50%; }
    .form-group { margin-bottom: 14px; }
    .form-label { font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 5px; display: block; font-family: 'Rajdhani', sans-serif; letter-spacing: 0.5px; text-transform: uppercase; }
    .form-label .req { color: #EF4444; }
    .form-input, .form-select, .form-textarea {
      width: 100%; padding: 10px 12px; border: 1.5px solid #D1D5DB;
      border-radius: 8px; font-size: 14px; font-family: 'Noto Sans', sans-serif;
      color: #111827; background: white; outline: none; transition: border-color 0.2s;
      -webkit-appearance: none; appearance: none;
    }
    .form-select { background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236B7280' d='M6 8L1 3h10z'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 12px center; padding-right: 32px; }
    .form-input:focus, .form-select:focus, .form-textarea:focus { border-color: #0F4C2A; box-shadow: 0 0 0 3px rgba(15,76,42,0.1); }
    .form-textarea { min-height: 90px; resize: vertical; }
    .btn-primary {
      width: 100%; padding: 13px; border-radius: 10px; border: none;
      background: linear-gradient(135deg, #0F4C2A, #1B6B3A);
      color: white; font-size: 15px; font-weight: 700;
      font-family: 'Rajdhani', sans-serif; letter-spacing: 1px; text-transform: uppercase;
      cursor: pointer; transition: all 0.2s; box-shadow: 0 2px 8px rgba(15,76,42,0.4);
    }
    .btn-primary:hover { box-shadow: 0 4px 14px rgba(15,76,42,0.5); transform: translateY(-1px); }
    .btn-primary:active { transform: translateY(0); }
    .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
    .section-title {
      font-family: 'Rajdhani', sans-serif; font-size: 18px; font-weight: 700;
      color: #0F2318; margin-bottom: 16px; display: flex; align-items: center; gap: 8px;
    }
    .empty-state {
      text-align: center; padding: 48px 24px; color: #9CA3AF;
    }
    .empty-icon { font-size: 48px; margin-bottom: 12px; }
    .empty-msg { font-size: 14px; font-weight: 500; }
    .filter-row { display: flex; gap: 8px; margin-bottom: 14px; flex-wrap: wrap; }
    .filter-chip {
      padding: 5px 12px; border-radius: 20px; font-size: 12px; font-weight: 600;
      cursor: pointer; border: 1.5px solid; transition: all 0.2s;
      font-family: 'Rajdhani', sans-serif; letter-spacing: 0.3px;
    }
    .filter-chip.active { color: white; }
    .modal-overlay {
      position: fixed; inset: 0; background: rgba(0,0,0,0.6);
      z-index: 200; display: flex; align-items: flex-end; justify-content: center;
      animation: fadeIn 0.2s;
    }
    .modal-box {
      background: white; border-radius: 20px 20px 0 0;
      padding: 20px; width: 100%; max-width: 430px; max-height: 80vh;
      overflow-y: auto; animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
    .modal-handle { width: 40px; height: 4px; background: #E5E7EB; border-radius: 4px; margin: 0 auto 16px; }
    .modal-title { font-family: 'Rajdhani', sans-serif; font-size: 18px; font-weight: 700; color: #0F2318; margin-bottom: 14px; }
    .stats-row { display: flex; gap: 8px; margin-bottom: 16px; }
    .stat-card {
      flex: 1; background: white; border-radius: 10px; padding: 12px 8px;
      text-align: center; border: 1px solid #E5EDE8;
      box-shadow: 0 1px 4px rgba(0,0,0,0.06);
    }
    .stat-num { font-family: 'Rajdhani', sans-serif; font-size: 26px; font-weight: 700; color: #0F4C2A; }
    .stat-label { font-size: 10px; color: #6B7280; font-weight: 600; letter-spacing: 0.3px; text-transform: uppercase; }
    .photo-upload-area {
      border: 2px dashed #D1D5DB; border-radius: 8px; padding: 20px;
      text-align: center; cursor: pointer; transition: all 0.2s; background: #F9FAFB;
    }
    .photo-upload-area:hover { border-color: #0F4C2A; background: #F0FDF4; }
    .photo-preview { width: 100%; height: 160px; object-fit: cover; border-radius: 8px; }
    .info-row { display: flex; gap: 8px; margin-bottom: 6px; align-items: flex-start; }
    .info-key { font-size: 11px; color: #9CA3AF; font-weight: 600; min-width: 90px; text-transform: uppercase; letter-spacing: 0.3px; font-family: 'Rajdhani', sans-serif; }
    .info-val { font-size: 13px; color: #1F2937; font-weight: 500; flex: 1; }
    .success-toast {
      position: fixed; top: 80px; left: 50%; transform: translateX(-50%);
      background: #0F4C2A; color: white; padding: 10px 20px;
      border-radius: 24px; font-size: 13px; font-weight: 600;
      box-shadow: 0 4px 16px rgba(0,0,0,0.3); z-index: 300;
      animation: toastIn 0.3s, toastOut 0.3s 2.4s forwards;
      white-space: nowrap;
    }
    @keyframes toastIn { from { opacity: 0; transform: translateX(-50%) translateY(-10px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }
    @keyframes toastOut { from { opacity: 1; } to { opacity: 0; } }
    .login-screen {
      min-height: 100vh; display: flex; flex-direction: column;
      background: linear-gradient(160deg, #0F2318 0%, #0F4C2A 50%, #1B6B3A 100%);
      align-items: center; justify-content: center; padding: 32px 24px;
      font-family: 'Noto Sans', sans-serif;
    }
    .login-emblem {
      width: 90px; height: 90px; border-radius: 50%;
      background: rgba(255,255,255,0.12); border: 2px solid rgba(255,255,255,0.3);
      display: flex; align-items: center; justify-content: center;
      font-size: 44px; margin-bottom: 20px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.3);
    }
    .login-title { font-family: 'Rajdhani', sans-serif; font-size: 28px; font-weight: 700; color: white; text-align: center; letter-spacing: 0.5px; }
    .login-sub { font-size: 13px; color: rgba(255,255,255,0.65); text-align: center; margin-top: 6px; letter-spacing: 0.5px; }
    .login-card {
      background: white; border-radius: 20px; padding: 28px 24px; width: 100%;
      max-width: 380px; margin-top: 32px; box-shadow: 0 20px 60px rgba(0,0,0,0.4);
    }
    .login-card-title { font-family: 'Rajdhani', sans-serif; font-size: 18px; font-weight: 700; color: #0F2318; margin-bottom: 6px; }
    .login-card-sub { font-size: 13px; color: #6B7280; margin-bottom: 24px; }
    .google-btn {
      width: 100%; padding: 13px; border-radius: 10px;
      border: 1.5px solid #E5E7EB; background: white;
      display: flex; align-items: center; justify-content: center; gap: 10px;
      font-size: 14px; font-weight: 600; color: #374151; cursor: pointer;
      transition: all 0.2s; margin-bottom: 10px;
    }
    .google-btn:hover { background: #F9FAFB; border-color: #D1D5DB; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
    .google-icon { width: 20px; height: 20px; }
    .demo-divider { display: flex; align-items: center; gap: 10px; margin: 16px 0; }
    .demo-divider::before, .demo-divider::after { content: ''; flex: 1; height: 1px; background: #E5E7EB; }
    .demo-divider span { font-size: 12px; color: #9CA3AF; font-weight: 500; }
    .demo-btn {
      width: 100%; padding: 11px; border-radius: 10px; border: 1.5px dashed #D1D5DB;
      background: transparent; font-size: 13px; font-weight: 600;
      cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 8px;
      margin-bottom: 8px;
    }
    .demo-btn.admin { color: #0F4C2A; border-color: #0F4C2A; }
    .demo-btn.admin:hover { background: #F0FDF4; }
    .demo-btn.user { color: #2563EB; border-color: #2563EB; }
    .demo-btn.user:hover { background: #EFF6FF; }
    .logout-btn {
      background: none; border: none; cursor: pointer;
      padding: 4px; color: rgba(255,255,255,0.7); font-size: 18px;
    }
    .remark-input {
      width: 100%; padding: 8px 10px; border: 1.5px solid #D1D5DB;
      border-radius: 8px; font-size: 13px; font-family: 'Noto Sans', sans-serif;
      outline: none; margin-bottom: 8px;
    }
    .remark-input:focus { border-color: #0F4C2A; }
    .status-select-sm {
      padding: 6px 10px; border: 1.5px solid #D1D5DB;
      border-radius: 8px; font-size: 13px; font-family: 'Noto Sans', sans-serif;
      outline: none; width: 100%; -webkit-appearance: none; background: #F9FAFB;
      cursor: pointer; margin-bottom: 8px;
    }
    .btn-sm {
      padding: 7px 14px; border-radius: 8px; border: none;
      background: #0F4C2A; color: white; font-size: 12px; font-weight: 700;
      font-family: 'Rajdhani', sans-serif; letter-spacing: 0.5px; cursor: pointer;
      transition: all 0.2s;
    }
    .btn-sm:hover { background: #0a3a1f; }
    .complaint-card-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 10px; }
    .complaint-meta { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 8px; }
    .complaint-location { font-size: 13px; color: #374151; font-weight: 600; }
    .complaint-desc { font-size: 12px; color: #6B7280; line-height: 1.5; margin-top: 6px; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-clamp: 2; -webkit-box-orient: vertical; }
    .search-bar {
      display: flex; align-items: center; background: white;
      border: 1.5px solid #D1D5DB; border-radius: 10px; padding: 8px 12px;
      margin-bottom: 14px; gap: 8px;
    }
    .search-bar input { flex: 1; border: none; outline: none; font-size: 14px; color: #374151; font-family: 'Noto Sans', sans-serif; }
    .search-icon { color: #9CA3AF; }
    .page-header { margin-bottom: 16px; }
    .page-title { font-family: 'Rajdhani', sans-serif; font-size: 20px; font-weight: 700; color: #0F2318; }
    .page-sub { font-size: 12px; color: #6B7280; margin-top: 2px; }
    .count-badge {
      display: inline-flex; align-items: center; justify-content: center;
      background: #0F4C2A; color: white; font-size: 11px; font-weight: 700;
      width: 20px; height: 20px; border-radius: 50%; font-family: 'Rajdhani', sans-serif;
    }
  `}</style>
);

/* ─── TOAST ──────────────────────────────────────────────────────────────── */
function Toast({ msg }) {
  return <div className="success-toast">✓ {msg}</div>;
}

/* ─── LOGIN SCREEN ───────────────────────────────────────────────────────── */
function LoginScreen({ onLogin }) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [showGoogleForm, setShowGoogleForm] = useState(false);

  const handleDemo = (isAdmin) => {
    setLoading(true);
    setTimeout(() => {
      onLogin(isAdmin
        ? { name: "Admin", email: ADMIN_EMAIL, isAdmin: true }
        : { name: "Demo User", email: "user@gmail.com", isAdmin: false }
      );
      setLoading(false);
    }, 600);
  };

  const handleGoogleLogin = () => {
    if (!email.trim()) return;
    setLoading(true);
    setTimeout(() => {
      const isAdmin = email.toLowerCase() === ADMIN_EMAIL;
      const name = email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, c => c.toUpperCase());
      onLogin({ name, email: email.toLowerCase(), isAdmin });
      setLoading(false);
    }, 800);
  };

  return (
    <div className="login-screen">
      <GlobalStyles />
      <div className="login-emblem">🏛️</div>
      <div className="login-title">MES Complaint Group</div>
      <div className="login-sub">Military Engineering Services · Complaint Management Portal</div>

      <div className="login-card">
        <div className="login-card-title">Welcome Back</div>
        <div className="login-card-sub">Sign in to access the complaint portal</div>

        {!showGoogleForm ? (
          <button className="google-btn" onClick={() => setShowGoogleForm(true)}>
            <svg className="google-icon" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>
        ) : (
          <div>
            <div className="form-group">
              <label className="form-label">Google Email</label>
              <input
                className="form-input"
                type="email"
                placeholder="yourname@gmail.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleGoogleLogin()}
              />
              <div style={{ fontSize: 11, color: "#6B7280", marginTop: 4 }}>
                Admin: admin@mes.gov.in
              </div>
            </div>
            <button className="btn-primary" onClick={handleGoogleLogin} disabled={loading || !email.trim()}>
              {loading ? "Signing In..." : "Sign In"}
            </button>
            <button style={{ width: "100%", background: "none", border: "none", color: "#6B7280", fontSize: 13, marginTop: 8, cursor: "pointer", padding: 6 }} onClick={() => setShowGoogleForm(false)}>
              ← Back
            </button>
          </div>
        )}

        <div className="demo-divider"><span>Quick Demo Access</span></div>
        <button className="demo-btn admin" onClick={() => handleDemo(true)} disabled={loading}>
          👑 Login as Admin
        </button>
        <button className="demo-btn user" onClick={() => handleDemo(false)} disabled={loading}>
          👤 Login as User
        </button>
      </div>

      <div style={{ marginTop: 24, fontSize: 11, color: "rgba(255,255,255,0.4)", textAlign: "center" }}>
        Secure · Official · Confidential
      </div>
    </div>
  );
}

/* ─── COMPLAINT CARD ─────────────────────────────────────────────────────── */
function ComplaintCard({ complaint, isAdmin, onViewDetails }) {
  const dc = DEPT_COLORS[complaint.department] || DEPT_COLORS["B&R"];
  const sc = STATUS_CONF[complaint.status] || STATUS_CONF["Pending"];
  return (
    <div className="card" onClick={() => onViewDetails(complaint)} style={{ cursor: "pointer" }}>
      <div className="complaint-card-header">
        <div>
          <div className="complaint-id">{complaint.id}</div>
          <div className="complaint-date">{complaint.date} · {complaint.name}</div>
        </div>
        <div className="status-badge" style={{ background: sc.bg, color: sc.text }}>
          <div className="status-dot" style={{ background: sc.dot }}></div>
          {complaint.status}
        </div>
      </div>
      <div className="complaint-meta">
        <span className="dept-badge" style={{ background: dc.bg, color: dc.text }}>
          {dc.icon} {complaint.department}
        </span>
        <span style={{ fontSize: 12, color: "#6B7280", display: "flex", alignItems: "center", gap: 3 }}>
          📍 {complaint.location} · Q {complaint.quarterNumber}
        </span>
      </div>
      <div style={{ fontSize: 12, color: "#374151", fontWeight: 600 }}>{complaint.complaintType}</div>
      <div className="complaint-desc">{complaint.description}</div>
      {complaint.photo && (
        <img src={complaint.photo} alt="complaint" style={{ width: "100%", height: 120, objectFit: "cover", borderRadius: 8, marginTop: 8 }} />
      )}
    </div>
  );
}

/* ─── DETAIL MODAL ───────────────────────────────────────────────────────── */
function DetailModal({ complaint, isAdmin, onClose, onUpdate }) {
  const [status, setStatus] = useState(complaint.status);
  const [remarks, setRemarks] = useState(complaint.remarks || "");
  const [saving, setSaving] = useState(false);
  const dc = DEPT_COLORS[complaint.department] || DEPT_COLORS["B&R"];
  const sc = STATUS_CONF[status] || STATUS_CONF["Pending"];

  const save = () => {
    setSaving(true);
    setTimeout(() => {
      onUpdate({ ...complaint, status, remarks });
      setSaving(false);
      onClose();
    }, 400);
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <div className="modal-handle"></div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div className="complaint-id" style={{ fontSize: 15 }}>{complaint.id}</div>
            <div style={{ fontSize: 12, color: "#9CA3AF" }}>{complaint.date}</div>
          </div>
          <div className="status-badge" style={{ background: sc.bg, color: sc.text }}>
            <div className="status-dot" style={{ background: sc.dot }}></div>
            {status}
          </div>
        </div>
        <div style={{ margin: "12px 0 6px" }}>
          <span className="dept-badge" style={{ background: dc.bg, color: dc.text, fontSize: 12 }}>
            {dc.icon} {complaint.department}
          </span>
        </div>
        <div style={{ background: "#F9FAFB", borderRadius: 10, padding: 12, marginBottom: 14 }}>
          <div className="info-row"><span className="info-key">Name</span><span className="info-val">{complaint.name}</span></div>
          <div className="info-row"><span className="info-key">Mobile</span><span className="info-val">{complaint.mobile}</span></div>
          <div className="info-row"><span className="info-key">Location</span><span className="info-val">{complaint.location}</span></div>
          <div className="info-row"><span className="info-key">Quarter No.</span><span className="info-val">{complaint.quarterNumber}</span></div>
          <div className="info-row"><span className="info-key">Type</span><span className="info-val">{complaint.complaintType}</span></div>
          <div className="info-row"><span className="info-key">Description</span><span className="info-val" style={{ lineHeight: 1.5 }}>{complaint.description}</span></div>
          {complaint.remarks && (
            <div className="info-row"><span className="info-key">Remarks</span><span className="info-val" style={{ color: "#0F4C2A", fontStyle: "italic" }}>{complaint.remarks}</span></div>
          )}
        </div>
        {complaint.photo && (
          <img src={complaint.photo} alt="complaint" className="photo-preview" style={{ marginBottom: 14 }} />
        )}
        {isAdmin && (
          <div style={{ borderTop: "1px solid #E5E7EB", paddingTop: 14 }}>
            <div className="modal-title" style={{ fontSize: 14, marginBottom: 10 }}>⚙️ Admin Controls</div>
            <label className="form-label">Update Status</label>
            <select className="status-select-sm" value={status} onChange={e => setStatus(e.target.value)}>
              {STATUSES.map(s => <option key={s}>{s}</option>)}
            </select>
            <label className="form-label">Add Remarks (Optional)</label>
            <textarea className="remark-input" rows={3} placeholder="Add remarks or notes..." value={remarks} onChange={e => setRemarks(e.target.value)} />
            <button className="btn-sm" onClick={save} disabled={saving}>
              {saving ? "Saving..." : "💾 Save Changes"}
            </button>
          </div>
        )}
        <button style={{ marginTop: 14, width: "100%", padding: "10px", background: "#F3F4F6", border: "none", borderRadius: 8, color: "#6B7280", fontWeight: 600, cursor: "pointer", fontFamily: "'Rajdhani', sans-serif", fontSize: 13, letterSpacing: 0.5 }} onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}

/* ─── ADD COMPLAINT FORM ─────────────────────────────────────────────────── */
function AddComplaintView({ currentUser, onSubmit }) {
  const initForm = {
    name: currentUser.name === "Demo User" ? "" : currentUser.name,
    mobile: "",
    location: "",
    quarterNumber: "",
    department: "",
    complaintType: "",
    description: "",
    photo: null,
  };
  const [form, setForm] = useState(initForm);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const fileRef = useRef();

  const set = (k, v) => {
    setForm(f => ({ ...f, [k]: v }));
    setErrors(e => ({ ...e, [k]: "" }));
    if (k === "department") setForm(f => ({ ...f, department: v, complaintType: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.mobile.trim() || !/^\d{10}$/.test(form.mobile.trim())) e.mobile = "Valid 10-digit mobile number required";
    if (!form.location) e.location = "Select a location";
    if (!form.quarterNumber.trim()) e.quarterNumber = "Quarter number is required";
    if (!form.department) e.department = "Select a department";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    const newComplaint = {
      id: genId(),
      date: today(),
      ...form,
      status: "Pending",
      remarks: "",
      submittedBy: currentUser.email,
    };
    onSubmit(newComplaint);
    setSubmitted(true);
    setForm(initForm);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setForm(f => ({ ...f, photo: ev.target.result }));
    reader.readAsDataURL(file);
  };

  const types = form.department ? COMPLAINT_TYPES[form.department] : [];

  return (
    <div className="content-area">
      {submitted && <Toast msg="Complaint submitted successfully!" />}
      <div className="page-header">
        <div className="page-title">📝 Add Complaint</div>
        <div className="page-sub">Fill in all mandatory fields marked with *</div>
      </div>

      <div className="card">
        <div className="form-group">
          <label className="form-label">Full Name <span className="req">*</span></label>
          <input className="form-input" placeholder="Enter your full name" value={form.name} onChange={e => set("name", e.target.value)} />
          {errors.name && <div style={{ color: "#EF4444", fontSize: 11, marginTop: 3 }}>{errors.name}</div>}
        </div>

        <div className="form-group">
          <label className="form-label">Mobile Number <span className="req">*</span></label>
          <input className="form-input" type="tel" placeholder="10-digit mobile number" maxLength={10} value={form.mobile} onChange={e => set("mobile", e.target.value.replace(/\D/g, ""))} />
          {errors.mobile && <div style={{ color: "#EF4444", fontSize: 11, marginTop: 3 }}>{errors.mobile}</div>}
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">Location <span className="req">*</span></label>
            <select className="form-select" value={form.location} onChange={e => set("location", e.target.value)}>
              <option value="">Select...</option>
              {LOCATIONS.map(l => <option key={l}>{l}</option>)}
            </select>
            {errors.location && <div style={{ color: "#EF4444", fontSize: 11, marginTop: 3 }}>{errors.location}</div>}
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label className="form-label">Quarter No. <span className="req">*</span></label>
            <input className="form-input" placeholder="e.g. A-12" value={form.quarterNumber} onChange={e => set("quarterNumber", e.target.value)} />
            {errors.quarterNumber && <div style={{ color: "#EF4444", fontSize: 11, marginTop: 3 }}>{errors.quarterNumber}</div>}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Department <span className="req">*</span></label>
          <select className="form-select" value={form.department} onChange={e => set("department", e.target.value)}>
            <option value="">Select department...</option>
            {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
          </select>
          {errors.department && <div style={{ color: "#EF4444", fontSize: 11, marginTop: 3 }}>{errors.department}</div>}
        </div>

        {form.department && (
          <div className="form-group">
            <label className="form-label">Complaint Type</label>
            <select className="form-select" value={form.complaintType} onChange={e => set("complaintType", e.target.value)}>
              <option value="">Select type...</option>
              {types.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
        )}

        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea className="form-textarea" placeholder="Describe your complaint in detail..." value={form.description} onChange={e => set("description", e.target.value)} />
        </div>

        <div className="form-group">
          <label className="form-label">Photo (Optional)</label>
          <div className="photo-upload-area" onClick={() => fileRef.current.click()}>
            {form.photo ? (
              <img src={form.photo} alt="preview" className="photo-preview" />
            ) : (
              <>
                <div style={{ fontSize: 28, marginBottom: 6 }}>📷</div>
                <div style={{ fontSize: 13, color: "#6B7280" }}>Tap to upload photo</div>
                <div style={{ fontSize: 11, color: "#9CA3AF" }}>JPG, PNG supported</div>
              </>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handlePhoto} />
          {form.photo && (
            <button style={{ marginTop: 6, fontSize: 12, color: "#EF4444", background: "none", border: "none", cursor: "pointer" }} onClick={() => setForm(f => ({ ...f, photo: null }))}>
              ✕ Remove photo
            </button>
          )}
        </div>

        <button className="btn-primary" onClick={handleSubmit}>
          Submit Complaint
        </button>
      </div>
    </div>
  );
}

/* ─── COMPLAINT LIST VIEW ────────────────────────────────────────────────── */
function ComplaintListView({ title, icon, complaints, isAdmin, onUpdate, emptyMsg, accentColor }) {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterLocation, setFilterLocation] = useState("All");
  const [selected, setSelected] = useState(null);

  const filtered = complaints.filter(c => {
    const matchSearch = !search || c.id.toLowerCase().includes(search.toLowerCase()) || c.name.toLowerCase().includes(search.toLowerCase()) || c.description.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "All" || c.status === filterStatus;
    const matchLoc = filterLocation === "All" || c.location === filterLocation;
    return matchSearch && matchStatus && matchLoc;
  });

  const counts = { All: complaints.length, ...STATUSES.reduce((a, s) => ({ ...a, [s]: complaints.filter(c => c.status === s).length }), {}) };

  return (
    <div className="content-area">
      <div className="page-header">
        <div className="page-title">{icon} {title}</div>
        <div className="page-sub">{complaints.length} total complaint{complaints.length !== 1 ? "s" : ""}</div>
      </div>

      {isAdmin && (
        <div className="stats-row">
          {[["⏳", "Pending", "#F59E0B"], ["⚙️", "In Progress", "#10B981"], ["✅", "Completed", "#7C3AED"]].map(([ic, st, col]) => (
            <div className="stat-card" key={st}>
              <div className="stat-num" style={{ color: col }}>{complaints.filter(c => c.status === st).length}</div>
              <div className="stat-label">{st}</div>
            </div>
          ))}
        </div>
      )}

      <div className="search-bar">
        <span className="search-icon">🔍</span>
        <input placeholder="Search complaints..." value={search} onChange={e => setSearch(e.target.value)} />
        {search && <span style={{ cursor: "pointer", color: "#9CA3AF" }} onClick={() => setSearch("")}>✕</span>}
      </div>

      <div className="filter-row">
        {["All", ...STATUSES].map(s => {
          const sc = s === "All" ? null : STATUS_CONF[s];
          const active = filterStatus === s;
          return (
            <button key={s} className={`filter-chip ${active ? "active" : ""}`}
              style={{ borderColor: sc ? sc.dot : accentColor || "#0F4C2A", color: active ? "white" : (sc ? sc.dot : accentColor || "#0F4C2A"), background: active ? (sc ? sc.dot : accentColor || "#0F4C2A") : "transparent" }}
              onClick={() => setFilterStatus(s)}
            >
              {s} ({counts[s] || 0})
            </button>
          );
        })}
      </div>

      {isAdmin && (
        <div className="filter-row">
          {["All", ...LOCATIONS].map(l => (
            <button key={l} className={`filter-chip ${filterLocation === l ? "active" : ""}`}
              style={{ borderColor: "#0F4C2A", color: filterLocation === l ? "white" : "#0F4C2A", background: filterLocation === l ? "#0F4C2A" : "transparent", fontSize: 11 }}
              onClick={() => setFilterLocation(l)}
            >
              {l}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <div className="empty-msg">{emptyMsg || "No complaints found"}</div>
        </div>
      ) : (
        filtered.map(c => (
          <ComplaintCard key={c.id} complaint={c} isAdmin={isAdmin} onViewDetails={setSelected} />
        ))
      )}

      {selected && (
        <DetailModal
          complaint={selected}
          isAdmin={isAdmin}
          onClose={() => setSelected(null)}
          onUpdate={(updated) => {
            onUpdate(updated);
            setSelected(updated);
          }}
        />
      )}
    </div>
  );
}

/* ─── TAB BAR ────────────────────────────────────────────────────────────── */
const TABS = [
  { id: "add",        icon: "➕", label: "Add",       color: "#0F4C2A" },
  { id: "mine",       icon: "📋", label: "Mine",      color: "#0F4C2A" },
  { id: "water",      icon: "💧", label: "Water",     color: "#2563EB" },
  { id: "electrical", icon: "⚡", label: "Electric",  color: "#D97706" },
  { id: "br",         icon: "🏗️", label: "B&R",       color: "#4B5563" },
];

function TabBar({ activeTab, setActiveTab, userCounts }) {
  return (
    <div className="tab-bar">
      {TABS.map(t => {
        const active = activeTab === t.id;
        return (
          <button key={t.id} className={`tab-item ${active ? "active" : ""}`}
            style={{ color: active ? t.color : "#4B5563" }}
            onClick={() => setActiveTab(t.id)}
          >
            <span className="tab-icon">{t.icon}</span>
            <span className="tab-label">{t.label}</span>
            {userCounts[t.id] > 0 && t.id !== "add" && (
              <span style={{
                position: "absolute", top: 4, right: "50%", transform: "translateX(14px)",
                background: t.color, color: "white", fontSize: 9, fontWeight: 700,
                width: 15, height: 15, borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>{userCounts[t.id] > 9 ? "9+" : userCounts[t.id]}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

/* ─── HEADER ─────────────────────────────────────────────────────────────── */
function Header({ currentUser, onLogout }) {
  const initials = currentUser.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div className="header">
      <div className="header-top">
        <div className="header-logo">
          <div className="header-emblem">🏛️</div>
          <div>
            <div className="header-title">MES Complaint Group</div>
            <div className="header-sub">Military Engineering Services</div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 2 }}>
          <div className="user-badge" onClick={onLogout} title="Tap to logout">
            <div className="user-avatar">{initials}</div>
            <span className="user-name">{currentUser.name}</span>
            <span style={{ fontSize: 14 }}>⏏</span>
          </div>
          {currentUser.isAdmin && <div className="admin-chip">⭐ Admin</div>}
        </div>
      </div>
    </div>
  );
}

/* ─── MAIN APP ───────────────────────────────────────────────────────────── */
function MainApp({ currentUser, complaints, onSaveComplaints, activeTab, setActiveTab, onLogout }) {
  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2800);
  };

  const handleSubmit = (complaint) => {
    onSaveComplaints([complaint, ...complaints]);
    showToast("Complaint submitted successfully!");
    setActiveTab("mine");
  };

  const handleUpdate = (updated) => {
    onSaveComplaints(complaints.map(c => c.id === updated.id ? updated : c));
    showToast("Complaint updated!");
  };

  const mine = complaints.filter(c => c.submittedBy === currentUser.email);
  const water = complaints.filter(c => c.department === "Water Supply");
  const elec = complaints.filter(c => c.department === "Electrical");
  const br = complaints.filter(c => c.department === "B&R");

  const pendingCounts = {
    mine: mine.filter(c => c.status === "Pending").length,
    water: water.filter(c => c.status === "Pending").length,
    electrical: elec.filter(c => c.status === "Pending").length,
    br: br.filter(c => c.status === "Pending").length,
  };

  return (
    <div className="app-shell">
      <GlobalStyles />
      {toast && <Toast msg={toast} />}
      <Header currentUser={currentUser} onLogout={onLogout} />
      <div style={{ flex: 1, overflowY: "hidden", display: "flex", flexDirection: "column" }}>
        {activeTab === "add" && <AddComplaintView currentUser={currentUser} onSubmit={handleSubmit} />}
        {activeTab === "mine" && (
          <ComplaintListView
            title="My Complaints"
            icon="📋"
            complaints={currentUser.isAdmin ? complaints : mine}
            isAdmin={currentUser.isAdmin}
            onUpdate={handleUpdate}
            emptyMsg="No complaints submitted yet"
            accentColor="#0F4C2A"
          />
        )}
        {activeTab === "water" && (
          <ComplaintListView
            title="Water Supply"
            icon="💧"
            complaints={currentUser.isAdmin ? water : mine.filter(c => c.department === "Water Supply")}
            isAdmin={currentUser.isAdmin}
            onUpdate={handleUpdate}
            emptyMsg="No water supply complaints"
            accentColor="#2563EB"
          />
        )}
        {activeTab === "electrical" && (
          <ComplaintListView
            title="Electrical"
            icon="⚡"
            complaints={currentUser.isAdmin ? elec : mine.filter(c => c.department === "Electrical")}
            isAdmin={currentUser.isAdmin}
            onUpdate={handleUpdate}
            emptyMsg="No electrical complaints"
            accentColor="#D97706"
          />
        )}
        {activeTab === "br" && (
          <ComplaintListView
            title="B&R"
            icon="🏗️"
            complaints={currentUser.isAdmin ? br : mine.filter(c => c.department === "B&R")}
            isAdmin={currentUser.isAdmin}
            onUpdate={handleUpdate}
            emptyMsg="No B&R complaints"
            accentColor="#4B5563"
          />
        )}
      </div>
      <TabBar activeTab={activeTab} setActiveTab={setActiveTab} userCounts={pendingCounts} />
    </div>
  );
}

/* ─── ROOT ───────────────────────────────────────────────────────────────── */
function LoadingScreen() {
  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg, #0F2318, #1B6B3A)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <GlobalStyles />
      <div style={{ fontSize: 48, marginBottom: 16 }}>🏛️</div>
      <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 20, color: "white", fontWeight: 700 }}>MES Complaint Group</div>
      <div style={{ marginTop: 24, width: 40, height: 40, border: "3px solid rgba(255,255,255,0.2)", borderTopColor: "white", borderRadius: "50%", animation: "spin 0.8s linear infinite" }}></div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [complaints, setComplaints] = useState(DEMO_COMPLAINTS);
  const [activeTab, setActiveTab] = useState("add");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const sc = await window.storage.get("mes_complaints");
        if (sc) setComplaints(JSON.parse(sc.value));
        const su = await window.storage.get("mes_user");
        if (su) setCurrentUser(JSON.parse(su.value));
      } catch {}
      setLoading(false);
    })();
  }, []);

  const saveComplaints = async (updated) => {
    setComplaints(updated);
    try { await window.storage.set("mes_complaints", JSON.stringify(updated)); } catch {}
  };

  const login = async (user) => {
    setCurrentUser(user);
    try { await window.storage.set("mes_user", JSON.stringify(user)); } catch {}
    setActiveTab("add");
  };

  const logout = async () => {
    setCurrentUser(null);
    try { await window.storage.delete("mes_user"); } catch {}
  };

  if (loading) return <LoadingScreen />;
  if (!currentUser) return <LoginScreen onLogin={login} />;

  return (
    <MainApp
      currentUser={currentUser}
      complaints={complaints}
      onSaveComplaints={saveComplaints}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      onLogout={logout}
    />
  );
}
