import React, { useEffect, useState } from 'react';
import Navbar from '../components/shared/Navbar';
import { User } from '../types';
import { contentService } from '../services/contentService';
import { SiteData, VibeNode } from '../types/vibe';
import { useNavigate } from 'react-router-dom';

interface Props {
  user: User;
  setUser: (user: User | null) => void;
}

export default function Dashboard({ user, setUser }: Props) {
  const [siteData, setSiteData] = useState<SiteData | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      const data = await contentService.getSiteData(user.id);
      if (data) {
        setSiteData(data);
      }
      setLoading(false);
    };
    loadData();
  }, [user.id]);

  if (loading) {
    return <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-500">Loading...</div>;
  }

  const handleEditSite = () => {
    navigate(`/editor`);
  };

  const countNodes = (node?: VibeNode): number => {
    if (!node) return 0;
    return 1 + (node.children?.reduce((acc, c) => acc + countNodes(c), 0) || 0);
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans">
      <Navbar user={user} setUser={setUser} />
      
      <main className="max-w-6xl mx-auto py-20 px-8">
        <h1 className="text-5xl font-black mb-4 tracking-tighter">Welcome back, {user.email?.split('@')[0] || 'User'}</h1>
        <p className="text-zinc-400 text-xl mb-16 max-w-2xl font-light">
          Your creative workspace. Manage, edit, and publish your visual masterpiece from here.
        </p>

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-10 flex flex-col md:flex-row items-center justify-between gap-12 shadow-2xl">
          <div className="space-y-3 w-full md:w-auto">
            <h2 className="text-3xl font-bold tracking-tight">VibeBuilder Workspace</h2>
            <div className="flex items-center gap-3">
              <span className="relative flex h-3 w-3">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${siteData?.is_published ? 'bg-green-400' : 'bg-amber-400'}`}></span>
                <span className={`relative inline-flex rounded-full h-3 w-3 ${siteData?.is_published ? 'bg-green-500' : 'bg-amber-500'}`}></span>
              </span>
              <p className="text-sm font-semibold text-zinc-300 uppercase tracking-widest">
                {siteData?.is_published ? 'Live in Production' : 'Draft Mode'}
              </p>
            </div>
            <div className="font-mono bg-zinc-950 px-5 py-4 rounded-xl border border-zinc-800 text-sm mt-6 text-zinc-400 truncate max-w-sm">
              {window.location.origin}/site/{siteData?.username || user.id} 
            </div>
          </div>

          <div className="flex flex-col gap-4 w-full md:w-auto">
            <button 
              onClick={handleEditSite}
              className="px-10 py-5 bg-blue-600 text-white font-bold uppercase tracking-widest rounded-xl transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-600/30 w-full"
            >
              Open Editor
            </button>
            <a 
              href={`/site/${siteData?.username || user.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-10 py-5 bg-zinc-800 text-white hover:bg-zinc-700 font-bold uppercase tracking-widest rounded-xl text-center transition-all hover:-translate-y-1 hover:shadow-xl block w-full border border-zinc-700"
            >
              View Live Site
            </a>
          </div>
        </div>

        {siteData && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
              <h3 className="uppercase font-bold text-xs tracking-widest mb-4 text-zinc-500">Total Elements</h3>
              <p className="text-5xl font-black">{countNodes(siteData.rootNode)}</p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
              <h3 className="uppercase font-bold text-xs tracking-widest mb-4 text-zinc-500">Global Font</h3>
              <p className="text-3xl font-bold truncate">{siteData.rootNode?.styles?.fontFamily?.toString() || 'Inherit'}</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
