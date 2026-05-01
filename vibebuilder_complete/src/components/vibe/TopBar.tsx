import React from 'react';
import { Monitor, Smartphone, Tablet, Undo, Redo, Play, ArrowLeft, Loader2 } from 'lucide-react';

interface Props {
  viewport: 'desktop' | 'tablet' | 'mobile';
  setViewport: (v: 'desktop' | 'tablet' | 'mobile') => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onSave: () => void;
  isSaving: boolean;
  username: string;
}

export default function TopBar({ viewport, setViewport, onUndo, onRedo, canUndo, canRedo, onSave, isSaving, username }: Props) {
  return (
    <div className="h-14 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between px-4 text-zinc-100 z-20">
      
      <div className="flex items-center gap-4 w-1/3">
        <a href="/dashboard" className="p-2 hover:bg-zinc-800 rounded-md transition-colors text-zinc-400 hover:text-white" title="Back to Dashboard">
          <ArrowLeft className="w-4 h-4" />
        </a>
        <div className="flex border border-zinc-800 bg-zinc-900 rounded-md p-0.5 shadow-sm">
          <button disabled={!canUndo} onClick={onUndo} className="p-1.5 rounded hover:bg-zinc-800 disabled:opacity-30 disabled:hover:bg-transparent text-zinc-400"><Undo className="w-4 h-4" /></button>
          <button disabled={!canRedo} onClick={onRedo} className="p-1.5 rounded hover:bg-zinc-800 disabled:opacity-30 disabled:hover:bg-transparent text-zinc-400"><Redo className="w-4 h-4" /></button>
        </div>
      </div>

      <div className="flex justify-center w-1/3">
        <div className="flex bg-zinc-900 border border-zinc-800 rounded-full p-1 shadow-sm">
          <button onClick={() => setViewport('desktop')} className={`px-4 py-1.5 rounded-full flex items-center gap-2 transition-all ${viewport === 'desktop' ? 'bg-zinc-800 text-white shadow' : 'text-zinc-500 hover:text-zinc-300'}`}>
            <Monitor className="w-4 h-4" /> <span className="text-xs font-semibold">1200px</span>
          </button>
          <button onClick={() => setViewport('tablet')} className={`px-4 py-1.5 rounded-full flex items-center gap-2 transition-all ${viewport === 'tablet' ? 'bg-zinc-800 text-white shadow' : 'text-zinc-500 hover:text-zinc-300'}`}>
            <Tablet className="w-4 h-4" /> <span className="text-xs font-semibold">768px</span>
          </button>
          <button onClick={() => setViewport('mobile')} className={`px-4 py-1.5 rounded-full flex items-center gap-2 transition-all ${viewport === 'mobile' ? 'bg-zinc-800 text-white shadow' : 'text-zinc-500 hover:text-zinc-300'}`}>
            <Smartphone className="w-4 h-4" /> <span className="text-xs font-semibold">375px</span>
          </button>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 w-1/3">
        <a href={`/site/${username}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-zinc-300 hover:text-white transition-colors">
          <Play className="w-4 h-4" /> Preview
        </a>
        <button onClick={onSave} disabled={isSaving} className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-bold transition-colors disabled:opacity-70 shadow-lg shadow-blue-500/20">
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Publish Updates'}
        </button>
      </div>

    </div>
  );
}
