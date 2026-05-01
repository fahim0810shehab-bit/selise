
import { Website, Page, ComponentProps } from '../../types';
import { Layers, ChevronRight, Eye, MoreHorizontal, GripVertical } from 'lucide-react';
import { motion, Reorder } from 'motion/react';

interface NavigatorProps {
  page: Page;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onReorder: (newComponents: ComponentProps[]) => void;
}

export default function Navigator({ page, selectedId, onSelect, onReorder }: NavigatorProps) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-white">
      <div className="p-6 border-b border-[#E5E5E0] bg-[#F8F8F7]/50">
        <h3 className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-slate-400 flex items-center gap-2">
          <Layers className="w-3 h-3" />
          Navigator
        </h3>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4 custom-scrollbar">
        <Reorder.Group 
          axis="y" 
          values={page.components} 
          onReorder={onReorder}
          className="space-y-1"
        >
          {page.components.map((comp) => (
            <Reorder.Item
              key={comp.id}
              value={comp}
              className={`
                group px-6 py-2 flex items-center gap-3 cursor-pointer transition-all
                ${selectedId === comp.id ? 'bg-black text-white' : 'hover:bg-[#F5F5F0] text-slate-600'}
              `}
              onClick={() => onSelect(comp.id)}
            >
              <div className="shrink-0 opacity-20 group-hover:opacity-100 transition-opacity">
                <GripVertical className="w-3 h-3" />
              </div>
              
              <div className={`
                w-6 h-6 rounded flex items-center justify-center shrink-0
                ${selectedId === comp.id ? 'bg-white/20' : 'bg-slate-100'}
              `}>
                <span className="text-[8px] font-mono font-bold uppercase">
                  {comp.type[0]}
                </span>
              </div>
              
              <div className="flex-1 min-w-0">
                <span className="text-[11px] font-bold truncate block">
                  {comp.type === 'hero' ? 'Hero Section' : 
                   comp.type === 'text' ? 'Content Block' : 
                   comp.type === 'gallery' ? 'Gallery Grid' : 'Contact Module'}
                </span>
                <span className={`text-[8px] font-mono uppercase tracking-tighter opacity-50 block`}>
                  {comp.id.substring(0, 8)}
                </span>
              </div>

              <div className="hidden group-hover:flex items-center gap-2">
                <button className="p-1 hover:bg-white/10 rounded transition-colors">
                  <Eye className="w-3 h-3" />
                </button>
                <button className="p-1 hover:bg-white/10 rounded transition-colors">
                  <MoreHorizontal className="w-3 h-3" />
                </button>
              </div>
            </Reorder.Item>
          ))}
        </Reorder.Group>

        {page.components.length === 0 && (
          <div className="px-6 py-12 text-center">
            <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest leading-loose">
              Hierarchy is empty.<br/>Drop an element to start.
            </p>
          </div>
        )}
      </div>
      
      <div className="p-4 bg-white border-t border-[#E5E5E0]">
        <div className="flex items-center justify-between px-2">
          <span className="text-[9px] font-mono text-slate-400 font-bold uppercase tracking-widest">Page Depth</span>
          <span className="text-[9px] font-mono font-bold text-black">{page.components.length} Levels</span>
        </div>
      </div>
    </div>
  );
}
