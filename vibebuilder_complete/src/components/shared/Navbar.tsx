import React from 'react';
import { User } from '../../types';
import { LogOut, Layout } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Props {
  user: User;
  setUser: (user: User | null) => void;
}

export default function Navbar({ user, setUser }: Props) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('selise_user_profile');
    setUser(null);
    navigate('/login');
  };

  return (
    <header className="border-b border-[#0f3460] bg-[#16213e] sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#0f3460] rounded-xl flex items-center justify-center shadow-lg">
            <Layout className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="font-bold text-xl tracking-tight block leading-none font-sans text-white">Profile Engine</span>
          </div>
        </div>
        
        <div className="flex items-center gap-8">
          <div className="hidden lg:flex items-center gap-4 pr-8 border-r border-[#0f3460]">
            <div className="text-right">
              <p className="text-sm font-semibold text-white leading-none mb-1">{user.email}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#0f3460] flex items-center justify-center text-white font-bold">
              {user.email[0].toUpperCase()}
            </div>
          </div>
          
          <button 
            onClick={handleLogout}
            className="p-2 text-[#8c9fba] hover:text-white transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
