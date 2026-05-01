import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { User } from './types';

import Login from './pages/Login';
import Register from './pages/Register';
import OidcCallback from './pages/OidcCallback';
import Dashboard from './pages/Dashboard';
import Editor from './pages/Editor';
import PublicSite from './pages/PublicSite';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedProfile = localStorage.getItem('selise_user_profile');
    try {
      if (savedProfile) {
        setUser(JSON.parse(savedProfile));
      }
    } catch {
      // ignore
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F8F8F7]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-black" />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public auth routes */}
        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login setUser={setUser} />} />
        <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />
        <Route path="/oidc" element={<OidcCallback setUser={setUser} />} />

        {/* Protected routes */}
        <Route path="/dashboard" element={user ? <Dashboard user={user} setUser={setUser} /> : <Navigate to="/login" />} />
        <Route path="/editor" element={user ? <Editor user={user} /> : <Navigate to="/login" />} />

        {/* Public site — no auth needed */}
        <Route path="/site/:username" element={<PublicSite />} />

        {/* Redirects */}
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="*" element={
          <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-white">
            <h1 className="text-5xl font-black mb-4">404</h1>
            <p className="text-zinc-400 mb-8">Page not found.</p>
            <a href="/dashboard" className="px-6 py-3 bg-white text-black rounded-xl font-bold">
              Go to Dashboard
            </a>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
}
