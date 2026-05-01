/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ComponentProps } from '../../types';
import { Mail, ArrowRight, ArrowUpRight, Layout } from 'lucide-react';
import { motion } from 'motion/react';

export default function BlockRenderer({ component }: { component: ComponentProps, key?: string }) {
  const { type, content } = component;
  const styles = content.styles || {};

  const customStyle = {
    padding: styles.padding || undefined,
    width: styles.width !== 'Auto' ? styles.width : undefined,
    height: styles.height !== 'Auto' ? styles.height : undefined,
    margin: styles.margin || undefined,
  };

  switch (type) {
    case 'hero':
      return (
        <section 
          style={customStyle}
          className="relative py-32 px-10 bg-white overflow-hidden border-b border-[#E5E5E0]"
        >
          <div className="relative max-w-7xl mx-auto flex flex-col items-center">
            <motion.span 
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               className="text-[10px] font-mono font-bold uppercase tracking-[0.4em] text-slate-300 mb-8"
            >
              System Propagation 01
            </motion.span>
            
            <motion.h1 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.1 }}
               className="text-7xl md:text-9xl font-serif italic text-black mb-10 tracking-tight leading-[0.85] text-center"
            >
              {content.title}
            </motion.h1>
            
            <motion.p 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.2 }}
               className="text-lg md:text-xl text-slate-400 mb-16 max-w-2xl text-center leading-relaxed font-medium"
            >
              {content.subtitle}
            </motion.p>
            
            {content.buttonText && (
              <motion.button 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="group relative bg-black text-white px-12 py-5 rounded-full font-bold text-xs uppercase tracking-[0.2em] shadow-2xl shadow-black/20 hover:bg-slate-800 transition-all flex items-center gap-4 overflow-hidden"
              >
                <span className="relative z-10">{content.buttonText}</span>
                <ArrowUpRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              </motion.button>
            )}
          </div>
        </section>
      );

    case 'text':
      return (
        <section 
          style={customStyle}
          className="py-24 px-10 bg-white border-b border-[#E5E5E0]"
        >
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-serif italic text-black mb-12 tracking-tight">{content.title}</h2>
            <div className="text-lg text-slate-500 leading-[1.8] space-y-8 font-medium">
              {content.body?.split('\n').map((p: string, i: number) => (
                <p key={i}>{p}</p>
              )) || <p className="opacity-30 italic">Awaiting narrative input...</p>}
            </div>
            
            <div className="mt-16 pt-8 border-t border-[#F5F5F0] flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-slate-300">Section Reference</span>
              <div className="h-px w-20 bg-[#F5F5F0]" />
            </div>
          </div>
        </section>
      );

    case 'gallery':
      const images = content.images || [];
      return (
        <section 
          style={customStyle}
          className="py-24 px-10 bg-[#F8F8F7]"
        >
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
               <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-[0.4em] text-slate-300 mb-4 block">Visual Index</span>
                  <h2 className="text-5xl font-serif italic text-black tracking-tight">{content.title || 'Collection'}</h2>
               </div>
               <p className="text-xs font-mono font-bold uppercase tracking-widest text-slate-400 max-w-[200px] leading-loose">
                  Total Assets: {images.length.toString().padStart(2, '0')}
               </p>
            </div>

            <div className={`grid gap-12 ${images.length < 3 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-3'}`}>
              {images.length > 0 ? (
                images.map((img: string, i: number) => (
                  <motion.div 
                    key={i} 
                    whileHover={{ y: -10 }}
                    className="aspect-[4/5] bg-white rounded-[2rem] overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] group relative border border-[#E5E5E0]"
                  >
                    <img src={img} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 grayscale group-hover:grayscale-0" />
                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  </motion.div>
                ))
              ) : (
                [1, 2, 3].map(i => (
                  <div key={i} className="aspect-[4/5] bg-white border border-[#E5E5E0] rounded-[2rem] flex flex-col items-center justify-center text-slate-200">
                    <Layout className="w-12 h-12 mb-4 opacity-5" />
                    <span className="text-[9px] font-mono font-bold uppercase tracking-[0.2em] opacity-40">Asset Missing</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      );

    case 'contact':
      return (
        <section 
          style={customStyle}
          className="py-32 px-10 bg-black text-white"
        >
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-24">
            <div className="flex-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-[0.4em] text-slate-600 mb-8 block">Network Module</span>
              <h2 className="text-6xl md:text-8xl font-serif italic text-white mb-10 tracking-tight leading-[0.85]">
                {content.title || 'Initiate Connection'}
              </h2>
              <p className="text-lg text-slate-400 mb-16 max-w-md leading-relaxed font-medium">
                Sync with our core engine for bespoke visual architecture and brand propagation.
              </p>
              <div className="flex items-center gap-6 group cursor-pointer">
                <div className="w-14 h-14 rounded-full border border-slate-700 flex items-center justify-center text-white group-hover:bg-white group-hover:text-black transition-all">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                   <span className="block text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-slate-600">Secure Direct</span>
                   <span className="block text-xl font-medium group-hover:underline underline-offset-8">{content.email}</span>
                </div>
              </div>
            </div>
            
            <div className="w-full lg:w-[450px] bg-white p-12 rounded-[3rem] shadow-2xl relative overflow-hidden text-black">
              <div className="absolute top-0 right-0 p-8 opacity-[0.05]">
                <ArrowRight className="w-32 h-32 rotate-[-45deg]" />
              </div>
              
              <form className="space-y-8 relative z-10" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-slate-400 mb-4">Identification</label>
                  <input type="text" placeholder="Full Name" className="w-full bg-[#F8F8F7] border border-[#E5E5E0] rounded-2xl p-5 text-black focus:border-black focus:ring-4 focus:ring-black/5 outline-none transition-all" disabled />
                </div>
                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-slate-400 mb-4">Brief Narrative</label>
                  <textarea rows={4} placeholder="Project scope..." className="w-full bg-[#F8F8F7] border border-[#E5E5E0] rounded-2xl p-5 text-black focus:border-black focus:ring-4 focus:ring-black/5 outline-none transition-all resize-none" disabled />
                </div>
                <button className="w-full py-5 bg-black text-white rounded-2xl font-bold text-xs uppercase tracking-[0.2em] hover:bg-slate-800 transition-all active:scale-[0.98]">
                  Submit Request
                </button>
              </form>
            </div>
          </div>
        </section>
      );

    default:
      return <div className="p-20 text-center border-2 border-dashed border-[#E5E5E0] rounded-[2rem] text-slate-300 font-serif italic text-2xl">Module Type Unknown</div>;
  }
}
