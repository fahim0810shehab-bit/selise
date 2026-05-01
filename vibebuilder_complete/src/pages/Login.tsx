import React, { useState } from 'react';
import { User } from '../types';
import { motion } from 'motion/react';
import { iam } from '../lib/selise';

interface LoginProps {
  setUser: (user: User) => void;
}

export default function Login({ setUser }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    setError('');
    try {
      const user = await iam.authenticate(email, password);
      setUser(user);
    } catch (err: any) {
      setError(err.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    window.location.href = iam.getOIDCUrl();
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
          <h1 className="text-4xl font-bold text-black tracking-tighter mb-2">VibeBuilder</h1>
          <p className="text-slate-400 text-xs font-mono uppercase tracking-widest">Sign in to your account</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm font-semibold p-4 rounded-xl border border-red-100">
              {error}
            </div>
          )}

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
              <span className="uppercase tracking-widest text-xs font-bold">Sign In</span>
            )}
          </button>

          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-slate-200" />
            <span className="mx-4 text-slate-400 text-[10px] font-mono uppercase tracking-widest">Or</span>
            <div className="flex-grow border-t border-slate-200" />
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full py-4 bg-white text-black font-bold rounded-2xl border border-[#E5E5E0] hover:bg-[#F8F8F7] flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.16v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.16C1.43 8.55 1 10.22 1 12s.43 3.45 1.16 4.93l3.68-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.16 7.07l3.68 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span className="uppercase tracking-widest text-xs font-bold">Sign In with Google</span>
          </button>
        </form>

        <p className="text-center text-slate-400 text-sm mt-8">
          Don't have an account?{' '}
          <a href="/register" className="text-black font-bold hover:underline">Register</a>
        </p>
      </motion.div>

      <div className="absolute top-20 right-[10%] w-64 h-64 bg-black/[0.02] rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-[10%] w-96 h-96 bg-black/[0.03] rounded-full blur-3xl" />
    </div>
  );
}
