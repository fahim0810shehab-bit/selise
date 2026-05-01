import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';

export default function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !email || !password) return;
    setLoading(true);
    setError('');

    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'https://api.seliseblocks.com';
      const projectKey = import.meta.env.VITE_X_BLOCKS_KEY || '';

      const response = await fetch(`${baseUrl}/idp/v1/Authentication/Register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-blocks-key': projectKey,
        },
        body: JSON.stringify({ username, email, password })
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || err.error_description || 'Registration failed');
      }

      navigate('/login');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#F8F8F7] font-sans overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-[0.05]"
        style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-lg p-12 bg-white border border-[#E5E5E0] rounded-[3rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.08)] relative z-10"
      >
        <div className="flex flex-col items-center mb-12">
          <div className="w-20 h-20 bg-black rounded-[2rem] flex items-center justify-center mb-8 shadow-2xl">
            <div className="flex gap-1.5 pt-1">
              <div className="w-1.5 h-8 bg-white rounded-full animate-[bounce_1.5s_infinite_100ms] opacity-40" />
              <div className="w-1.5 h-8 bg-white rounded-full animate-[bounce_1.5s_infinite_300ms]" />
              <div className="w-1.5 h-8 bg-white rounded-full animate-[bounce_1.5s_infinite_500ms] opacity-40" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-black tracking-tighter mb-2">Create Account</h1>
          <p className="text-slate-400 text-xs font-mono uppercase tracking-widest">Start building your site</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm font-semibold p-4 rounded-xl border border-red-100">
              {error}
            </div>
          )}

          <div>
            <label className="block text-[10px] font-mono font-bold text-slate-400 mb-2 uppercase tracking-widest">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="yourname"
              className="w-full px-6 py-4 bg-[#F8F8F7] border border-[#E5E5E0] rounded-2xl text-black placeholder-slate-300 focus:outline-none focus:border-black focus:ring-4 focus:ring-black/5 transition-all text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono font-bold text-slate-400 mb-2 uppercase tracking-widest">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-6 py-4 bg-[#F8F8F7] border border-[#E5E5E0] rounded-2xl text-black placeholder-slate-300 focus:outline-none focus:border-black focus:ring-4 focus:ring-black/5 transition-all text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono font-bold text-slate-400 mb-2 uppercase tracking-widest">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-6 py-4 bg-[#F8F8F7] border border-[#E5E5E0] rounded-2xl text-black placeholder-slate-300 focus:outline-none focus:border-black focus:ring-4 focus:ring-black/5 transition-all text-sm"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-black text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
          >
            {loading ? (
              <div className="flex gap-1.5">
                <div className="w-2 h-2 bg-white rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.15s]" />
                <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.3s]" />
              </div>
            ) : (
              <span className="uppercase tracking-widest text-xs font-bold">Create Account</span>
            )}
          </button>
        </form>

        <p className="text-center text-slate-400 text-sm mt-8">
          Already have an account?{' '}
          <a href="/login" className="text-black font-bold hover:underline">Sign In</a>
        </p>
      </motion.div>
    </div>
  );
}
