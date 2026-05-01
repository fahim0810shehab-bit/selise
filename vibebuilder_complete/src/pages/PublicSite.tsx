import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { contentService } from '../services/contentService';
import { SiteData } from '../types/vibe';
import VibeRenderer from '../components/vibe/VibeRenderer';

export default function PublicSite() {
  const { username } = useParams<{ username: string }>();
  const [siteData, setSiteData] = useState<SiteData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (username) {
      contentService.getSiteDataByUsername(username).then(data => {
        setSiteData(data);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [username]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!siteData || !siteData.is_published) {
    return (
      <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center text-zinc-900 font-sans">
         <h1 className="text-6xl font-black tracking-tight mb-4 text-center">404</h1>
         <p className="text-zinc-500 text-lg">Site not found or not yet published.</p>
      </div>
    );
  }

  return (
    <>
      <VibeRenderer 
        node={siteData.rootNode} 
        mode="preview" 
        selectedId={null} 
        hoveredId={null} 
      />
      <div className="fixed bottom-4 right-4 bg-white/50 backdrop-blur-md px-4 py-2 rounded-full shadow-xl border border-zinc-200/50 text-[10px] font-bold tracking-widest uppercase text-zinc-600 pointer-events-none z-50">
        Built with VibeBuilder Pro
      </div>
    </>
  );
}
