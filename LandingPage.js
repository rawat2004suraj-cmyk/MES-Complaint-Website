import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const features = [
  { icon: '📋', title: 'Track Complaints', desc: 'Submit and monitor every complaint with a unique ID in real time.' },
  { icon: '🏢', title: 'Multi-Department', desc: 'Route issues to Water Supply, Electrical, or B&R automatically.' },
  { icon: '🔒', title: 'Secure & Private', desc: 'Your data is protected. Only you can see your complaints.' },
  { icon: '⚡', title: 'Instant Updates', desc: 'Get status updates from Pending to In Progress to Completed.' },
];

const locations = ['Yogendra Vihar', 'VRC', 'Bana Singh', 'APS'];

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="relative bg-army-800 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)', backgroundSize: '20px 20px' }} />
        <div className="relative max-w-5xl mx-auto px-4 py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-army-700 border border-army-500 rounded-full px-4 py-1.5 mb-6">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            <span className="text-army-200 text-xs font-medium">Government Complaint Management System</span>
          </div>

          <h1 className="font-display text-5xl md:text-7xl font-bold mb-4 leading-tight">
            MES Complaint<br />
            <span className="text-army-300">Group</span>
          </h1>
          <p className="text-army-300 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
            Replace WhatsApp-based complaints with a professional, trackable, and transparent system. Your issues — resolved faster.
          </p>

          {user ? (
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to={user.role === 'admin' ? '/admin/dashboard' : '/my-complaints'} className="bg-army-400 hover:bg-army-300 text-white font-semibold px-8 py-3 rounded-xl transition-all shadow-lg">
                Go to Dashboard →
              </Link>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/register" className="bg-army-400 hover:bg-army-300 text-white font-semibold px-8 py-3 rounded-xl transition-all shadow-lg">
                Register Now
              </Link>
              <Link to="/login" className="bg-transparent border border-army-400 hover:bg-army-700 text-white font-semibold px-8 py-3 rounded-xl transition-all">
                Login
              </Link>
            </div>
          )}

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-6 max-w-md mx-auto">
            {[['3', 'Departments'], ['4', 'Locations'], ['24/7', 'Access']].map(([n, l]) => (
              <div key={l} className="text-center">
                <div className="font-display text-3xl font-bold text-army-300">{n}</div>
                <div className="text-army-400 text-xs mt-1">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-3xl font-bold text-center text-army-800 mb-10">Why MES Complaint Group?</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f) => (
              <div key={f.title} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="font-display text-lg font-bold text-army-800 mb-1">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Locations */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-3xl font-bold text-army-800 mb-3">Serving Locations</h2>
          <p className="text-gray-500 mb-8">Covering all MES-managed residential areas</p>
          <div className="flex flex-wrap justify-center gap-3">
            {locations.map((loc) => (
              <span key={loc} className="bg-army-50 border border-army-200 text-army-700 px-5 py-2.5 rounded-full font-medium text-sm">
                📍 {loc}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      {!user && (
        <section className="py-16 px-4 bg-army-800 text-white text-center">
          <h2 className="font-display text-3xl font-bold mb-3">Ready to Submit Your Complaint?</h2>
          <p className="text-army-300 mb-8">Join the system and get your issues resolved faster than ever.</p>
          <Link to="/register" className="bg-army-400 hover:bg-army-300 text-white font-semibold px-8 py-3 rounded-xl transition-all shadow-lg inline-block">
            Get Started Free
          </Link>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-500 text-center py-6 px-4">
        <p className="text-sm">© 2024 MES Complaint Group. All rights reserved.</p>
        <p className="text-xs mt-1 text-gray-600">Created by Suraj Rawat</p>
      </footer>
    </div>
  );
}
