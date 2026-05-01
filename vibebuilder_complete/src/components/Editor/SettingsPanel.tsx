/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ComponentProps } from '../../types';
import { 
  Trash2, 
  Upload, 
  Plus, 
  X, 
  Settings2, 
  Palette, 
  Database,
  ChevronDown,
  Maximize2,
  Type as TypeIcon,
  Layout,
  Link2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const media = {
  uploadAsset: async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsDataURL(file);
    });
  }
};

interface SettingsPanelProps {
  component: ComponentProps;
  onUpdate: (content: any) => void;
  onDelete: () => void;
}

type Tab = 'config' | 'style' | 'data';

export default function SettingsPanel({ component, onUpdate, onDelete }: SettingsPanelProps) {
  const { type, content } = component;
  const [activeTab, setActiveTab] = useState<Tab>('config');
  const [uploading, setUploading] = useState(false);

  const handleFieldChange = (field: string, value: any) => {
    onUpdate({ ...content, [field]: value });
  };

  const handleStyleChange = (key: string, value: any) => {
    const styles = content.styles || {};
    handleFieldChange('styles', { ...styles, [key]: value });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isGallery = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await media.uploadAsset(file);
      if (isGallery) {
        const currentImages = content.images || [];
        handleFieldChange('images', [...currentImages, url]);
      } else {
        handleFieldChange('image', url);
      }
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setUploading(false);
    }
  };

  const removeGalleryImage = (index: number) => {
    const currentImages = [...(content.images || [])];
    currentImages.splice(index, 1);
    handleFieldChange('images', currentImages);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-white">
      {/* Functional Header */}
      <div className="px-6 py-4 border-b border-[#E5E5E0] flex items-center justify-between bg-[#F8F8F7]/50">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-black" />
          <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em]">{type} Module</span>
        </div>
        <button onClick={onDelete} className="p-2 text-slate-300 hover:text-red-500 transition-colors">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Tabs - Webflow Style */}
      <div className="grid grid-cols-3 border-b border-[#E5E5E0]">
        {[
          { id: 'style', icon: Palette, label: 'Style' },
          { id: 'config', icon: Settings2, label: 'Config' },
          { id: 'data', icon: Database, label: 'Data' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as Tab)}
            className={`
              flex flex-col items-center py-3 gap-1 transition-all relative
              ${activeTab === tab.id ? 'text-black' : 'text-slate-300 hover:text-slate-500'}
            `}
          >
            <tab.icon className="w-4 h-4" />
            <span className="text-[9px] font-bold uppercase tracking-widest">{tab.label}</span>
            {activeTab === tab.id && (
              <motion.div layoutId="settingTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />
            )}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 5 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -5 }}
            transition={{ duration: 0.2 }}
            className="p-6 space-y-8"
          >
            {activeTab === 'config' && (
              <div className="space-y-6">
                <SectionHeader icon={TypeIcon} title="Content Parameters" />
                {type === 'hero' && (
                  <>
                    <InputField label="Heading" value={content.title} onChange={(v) => handleFieldChange('title', v)} />
                    <TextareaField label="Subtext" value={content.subtitle} onChange={(v) => handleFieldChange('subtitle', v)} />
                    <InputField label="CTA Label" value={content.buttonText} onChange={(v) => handleFieldChange('buttonText', v)} />
                  </>
                )}
                {type === 'text' && (
                  <>
                    <InputField label="Focus Title" value={content.title} onChange={(v) => handleFieldChange('title', v)} />
                    <TextareaField label="Narrative" value={content.body} onChange={(v) => handleFieldChange('body', v)} rows={8} />
                  </>
                )}
                {type === 'gallery' && (
                  <>
                    <InputField label="Exhibition Name" value={content.title} onChange={(v) => handleFieldChange('title', v)} />
                    <ImageGrid 
                      images={content.images || []} 
                      onRemove={removeGalleryImage} 
                      onUpload={(e) => handleImageUpload(e, true)}
                      uploading={uploading}
                    />
                  </>
                )}
              </div>
            )}

            {activeTab === 'style' && (
              <div className="space-y-8">
                <div>
                  <SectionHeader icon={Layout} title="Architecture" />
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <PropertyControl label="Width" value={content.styles?.width || 'Auto'} />
                    <PropertyControl label="Height" value={content.styles?.height || 'Auto'} />
                    <PropertyControl label="Padding" value={content.styles?.padding || '64px'} />
                    <PropertyControl label="Margin" value={content.styles?.margin || '0px'} />
                  </div>
                </div>

                <div>
                  <SectionHeader icon={Palette} title="Visual Identity" />
                  <div className="space-y-4 mt-4">
                    <div className="flex items-center justify-between p-3 bg-[#F5F5F0] rounded-xl border border-[#E5E5E0]">
                      <span className="text-[10px] font-bold uppercase text-slate-500">Theme Base</span>
                      <div className="flex gap-2">
                        <div className="w-5 h-5 rounded-full bg-white border border-[#E5E5E0] cursor-pointer ring-2 ring-black" />
                        <div className="w-5 h-5 rounded-full bg-black cursor-pointer" />
                        <div className="w-5 h-5 rounded-full bg-[#F27D26] cursor-pointer" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'data' && (
              <div className="space-y-6">
                <SectionHeader icon={Database} title="Data Binding" />
                <div className="p-4 bg-slate-900 rounded-2xl text-white">
                  <div className="flex items-center gap-3 mb-4">
                    <Link2 className="w-4 h-4 text-blue-400" />
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400">Selise DG Connector</span>
                  </div>
                  <p className="text-[11px] font-medium leading-relaxed opacity-80">
                    This module is currently bound to local state. Connect it to a live GQL endpoint to sync with production data.
                  </p>
                  <button className="w-full mt-6 py-3 bg-white text-black rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-slate-100 transition-all">
                    Establish Connection
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="p-6 border-t border-[#E5E5E0] bg-[#F8F8F7]">
         <div className="flex items-center gap-3 opacity-30 group grayscale hover:grayscale-0 transition-all duration-700">
            <Database className="w-4 h-4 text-black" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-slate-500">Selise Node Sync</span>
         </div>
      </div>
    </div>
  );
}

function SectionHeader({ icon: Icon, title }: { icon: any, title: string }) {
  return (
    <div className="flex items-center gap-3 pb-2 border-b border-[#F5F5F0]">
      <Icon className="w-4 h-4 text-black" />
      <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">{title}</h3>
    </div>
  );
}

function PropertyControl({ label, value }: { label: string, value: string }) {
  return (
    <div className="p-3 bg-white border border-[#E5E5E0] rounded-xl hover:border-black transition-colors cursor-pointer group">
      <span className="block text-[8px] font-bold uppercase tracking-widest text-slate-400 group-hover:text-slate-600 transition-colors mb-1">{label}</span>
      <span className="block text-xs font-mono font-bold text-black">{value}</span>
    </div>
  );
}

function ImageGrid({ images, onRemove, onUpload, uploading }: any) {
  return (
    <div className="grid grid-cols-2 gap-3 mt-4">
      {images.map((img: string, i: number) => (
        <div key={i} className="aspect-square relative rounded-[1.25rem] overflow-hidden border border-[#E5E5E0] group">
          <img src={img} alt="" className="w-full h-full object-cover" />
          <button 
            onClick={() => onRemove(i)}
            className="absolute top-2 right-2 p-1.5 bg-black text-white rounded-full opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ))}
      <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-[#E5E5E0] rounded-[1.25rem] hover:border-black hover:bg-[#F5F5F0] transition-all cursor-pointer">
        {uploading ? (
          <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-black" />
        ) : (
          <>
            <Plus className="w-6 h-6 text-slate-300" />
            <span className="text-[9px] mt-2 text-slate-400 font-bold uppercase tracking-widest">Add Asset</span>
          </>
        )}
        <input type="file" className="hidden" accept="image/*" onChange={onUpload} />
      </label>
    </div>
  );
}

function InputField({ label, value, onChange }: { label: string, value: string, onChange: (v: string) => void }) {
  return (
    <div className="space-y-3">
      <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">{label}</label>
      <input 
        type="text" 
        value={value || ''} 
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-4 bg-[#F8F8F7] border border-[#E5E5E0] rounded-2xl text-sm font-medium text-black focus:border-black focus:ring-4 focus:ring-black/5 outline-none transition-all placeholder:text-slate-300"
      />
    </div>
  );
}

function TextareaField({ label, value, onChange, rows = 4 }: { label: string, value: string, onChange: (v: string) => void, rows?: number }) {
  return (
    <div className="space-y-3">
      <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">{label}</label>
      <textarea 
        rows={rows}
        value={value || ''} 
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-4 bg-[#F8F8F7] border border-[#E5E5E0] rounded-2xl text-sm font-medium text-black focus:border-black focus:ring-4 focus:ring-black/5 outline-none transition-all resize-none placeholder:text-slate-300"
      />
    </div>
  );
}
