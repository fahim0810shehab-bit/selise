/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BlockType } from '../../types';
import { 
  Layout, 
  Type, 
  Image, 
  Mail, 
  Box, 
  Zap, 
  MousePointer2 
} from 'lucide-react';

interface SidebarProps {
  onAddComponent: (type: BlockType) => void;
  availableComponents: string[];
}

const COMPONENT_TABS = [
  { type: 'hero' as BlockType, icon: Layout, label: 'Hero', key: 'Hero' },
  { type: 'text' as BlockType, icon: Type, label: 'Content', key: 'FeatureGrid' }, // Mapping to registry keys
  { type: 'gallery' as BlockType, icon: Image, label: 'Gallery', key: 'Gallery' },
  { type: 'contact' as BlockType, icon: Mail, label: 'Contact', key: 'Contact' },
];

export default function Sidebar({ onAddComponent, availableComponents }: SidebarProps) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-white">
      <div className="p-6 border-b border-[#E5E5E0] bg-[#F8F8F7]/50">
        <h3 className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-slate-400 flex items-center gap-2">
          <Box className="w-3 h-3" />
          Block Library
        </h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 space-y-3 custom-scrollbar">
        {COMPONENT_TABS.map((comp) => {
          const isEnabled = availableComponents.length === 0 || availableComponents.includes(comp.key);
          
          return (
            <button
              key={comp.type}
              onClick={() => isEnabled && onAddComponent(comp.type)}
              disabled={!isEnabled}
              className={`
                w-full group p-4 rounded-[1.25rem] border transition-all duration-300 text-left relative overflow-hidden
                ${isEnabled 
                  ? 'bg-white border-[#E5E5E0] hover:border-black hover:shadow-xl hover:shadow-black/5 cursor-pointer' 
                  : 'bg-slate-50 border-slate-100 opacity-40 cursor-not-allowed'}
              `}
            >
              <div className="flex items-center gap-4 relative z-10">
                <div className={`
                  w-12 h-12 rounded-xl flex items-center justify-center transition-colors
                  ${isEnabled ? 'bg-[#F5F5F0] text-black group-hover:bg-black group-hover:text-white' : 'bg-slate-100 text-slate-300'}
                `}>
                  <comp.icon className="w-6 h-6" />
                </div>
                <div>
                  <span className={`block text-sm font-bold tracking-tight ${isEnabled ? 'text-slate-900' : 'text-slate-400'}`}>
                    {comp.label}
                  </span>
                  <p className="text-[10px] text-slate-400 font-mono mt-1 uppercase tracking-tighter">
                    {isEnabled ? 'Available' : 'Permission Required'}
                  </p>
                </div>
                
                {isEnabled && (
                  <MousePointer2 className="w-4 h-4 ml-auto text-slate-200 group-hover:text-black opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                )}
              </div>
            </button>
          );
        })}
      </div>
      
      <div className="p-6 border-t border-[#E5E5E0] bg-[#F8F8F7]">
         <div className="flex items-start gap-3 p-4 bg-white rounded-2xl border border-[#E5E5E0] shadow-sm">
            <Zap className="w-4 h-4 text-black mt-0.5 shrink-0" />
            <p className="text-[10px] font-mono leading-relaxed text-slate-500 font-medium">
              Powered by Selise Localization Block. Components are restricted based on your role profile.
            </p>
         </div>
      </div>
    </div>
  );
}
