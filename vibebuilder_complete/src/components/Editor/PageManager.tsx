/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Website, Page } from '../../types';
import { X, Plus, FileText, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PageManagerProps {
  website: Website;
  currentIndex: number;
  onClose: () => void;
  onSwitch: (index: number) => void;
  onUpdate: (website: Website) => void;
}

export default function PageManager({ website, currentIndex, onClose, onSwitch, onUpdate }: PageManagerProps) {
  const [newPageName, setNewPageName] = useState('');

  const addPage = () => {
    if (!newPageName) return;
    const slug = newPageName.toLowerCase().replace(/ /g, '-');
    const newPage: Page = {
      id: Math.random().toString(36).substring(7),
      name: newPageName,
      slug,
      components: []
    };

    const updatedWebsite = { ...website, pages: [...website.pages, newPage] };
    onUpdate(updatedWebsite);
    setNewPageName('');
  };

  const deletePage = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (website.pages.length <= 1) return;
    if (confirm('Delete this page? All components will be lost.')) {
      const updatedPages = website.pages.filter(p => p.id !== id);
      onUpdate({ ...website, pages: updatedPages });
      if (website.pages[currentIndex].id === id) {
        onSwitch(0);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="p-6 border-b border-neutral-800 flex items-center justify-between">
          <h2 className="text-xl font-bold">Manage Pages</h2>
          <button onClick={onClose} className="p-2 hover:bg-neutral-800 rounded-full text-neutral-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <label className="block text-xs font-mono uppercase tracking-widest text-neutral-500">All Pages</label>
            <div className="space-y-2">
              {website.pages.map((page, idx) => (
                <div 
                  key={page.id}
                  onClick={() => onSwitch(idx)}
                  className={`
                    group flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all
                    ${idx === currentIndex ? 'bg-blue-600/10 border-blue-500 text-white' : 'bg-neutral-800/50 border-neutral-700 text-neutral-400 hover:border-neutral-500'}
                  `}
                >
                  <div className="flex items-center gap-4">
                    <FileText className={`w-5 h-5 ${idx === currentIndex ? 'text-blue-400' : 'text-neutral-500'}`} />
                    <div className="flex flex-col">
                      <span className="font-bold">{page.name}</span>
                      <span className="text-[10px] font-mono opacity-50">/{page.slug}</span>
                    </div>
                  </div>
                  {website.pages.length > 1 && (
                    <button 
                      onClick={(e) => deletePage(page.id, e)}
                      className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-500/20 hover:text-red-500 rounded-lg transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-neutral-800">
            <label className="block text-xs font-mono uppercase tracking-widest text-neutral-500 mb-3">Add New Page</label>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={newPageName}
                onChange={(e) => setNewPageName(e.target.value)}
                placeholder="e.g. Services"
                className="flex-1 bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500 transition-colors"
              />
              <button 
                onClick={addPage}
                disabled={!newPageName}
                className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-6 py-2 rounded-lg font-bold transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
