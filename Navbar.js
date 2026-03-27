import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
    setMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-army-800 shadow-lg sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={user ? (user.role === 'admin' ? '/admin/dashboard' : '/my-complaints') : '/'} className="flex items-center gap-2">
            <div className="w-9 h-9 bg-army-400 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm font-display">MES</span>
            </div>
            <div className="hidden sm:block">
              <span className="text-white font-display font-bold text-lg leading-tight block">MES Complaint</span>
              <span className="text-army-300 text-xs">Group Management System</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {user ? (
              <>
                {user.role !== 'admin' && (
                  <>
                    <Link to="/my-complaints" className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive('/my-complaints') ? 'bg-army-600 text-white' : 'text-army-200 hover:bg-army-700 hover:text-white'}`}>
                      My Complaints
                    </Link>
                    <Link to="/add-complaint" className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive('/add-complaint') ? 'bg-army-600 text-white' : 'text-army-200 hover:bg-army-700 hover:text-white'}`}>
                      + New Complaint
                    </Link>
                  </>
                )}
                {user.role === 'admin' && (
                  <Link to="/admin/dashboard" className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive('/admin/dashboard') ? 'bg-army-600 text-white' : 'text-army-200 hover:bg-army-700 hover:text-white'}`}>
                    Dashboard
                  </Link>
                )}
                <div className="flex items-center gap-3 ml-3 pl-3 border-l border-army-600">
                  <div className="text-right">
                    <p className="text-white text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-army-400 text-xs capitalize">{user.role}</p>
                  </div>
                  <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1.5 rounded-lg transition-colors">
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="text-army-200 hover:text-white text-sm px-4 py-2 rounded-lg hover:bg-army-700 transition-colors">Login</Link>
                <Link to="/register" className="bg-army-500 hover:bg-army-400 text-white text-sm px-4 py-2 rounded-lg transition-colors font-medium">Register</Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button className="md:hidden text-white p-2" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-army-700 py-3 space-y-1 pb-4">
            {user ? (
              <>
                <div className="px-3 py-2 mb-2">
                  <p className="text-white font-medium">{user.name}</p>
                  <p className="text-army-400 text-xs capitalize">{user.role}</p>
                </div>
                {user.role !== 'admin' && (
                  <>
                    <Link to="/my-complaints" onClick={() => setMenuOpen(false)} className="block px-3 py-2 text-army-200 hover:bg-army-700 hover:text-white rounded-lg text-sm">My Complaints</Link>
                    <Link to="/add-complaint" onClick={() => setMenuOpen(false)} className="block px-3 py-2 text-army-200 hover:bg-army-700 hover:text-white rounded-lg text-sm">+ New Complaint</Link>
                  </>
                )}
                {user.role === 'admin' && (
                  <Link to="/admin/dashboard" onClick={() => setMenuOpen(false)} className="block px-3 py-2 text-army-200 hover:bg-army-700 hover:text-white rounded-lg text-sm">Dashboard</Link>
                )}
                <button onClick={handleLogout} className="w-full text-left px-3 py-2 text-red-400 hover:bg-army-700 rounded-lg text-sm">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)} className="block px-3 py-2 text-army-200 hover:bg-army-700 hover:text-white rounded-lg text-sm">Login</Link>
                <Link to="/register" onClick={() => setMenuOpen(false)} className="block px-3 py-2 text-army-200 hover:bg-army-700 hover:text-white rounded-lg text-sm">Register</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
