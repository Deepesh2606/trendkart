'use client';
import { Sparkles, MapPin, TrendingUp, Clock } from 'lucide-react';

export default function HeroSection() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-teal-900 to-slate-900 rounded-2xl p-8 sm:p-10 shadow-lg text-white mb-6 border border-slate-700">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-teal-500/20 blur-3xl mix-blend-screen pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-purple-500/20 blur-3xl mix-blend-screen pointer-events-none"></div>
      
      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="max-w-2xl space-y-4">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-xs font-medium text-teal-100 select-none">
            <MapPin size={12} className="text-teal-400" />
            <span>Jalandhar Electronics Market</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-teal-200">
            Market Intelligence Dashboard
          </h1>
          
          <p className="text-slate-300 text-sm sm:text-base max-w-xl leading-relaxed">
            Real-time analytics for mobile accessories. Discover what's selling fast, identify high-margin wholesale opportunities, and optimize your shop's inventory before competitors do.
          </p>
        </div>
        
        <div className="flex items-center gap-3 sm:gap-4 shrink-0 overflow-x-auto pb-2 md:pb-0 custom-scrollbar">
          <div className="flex flex-col p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md select-none">
            <span className="flex items-center text-slate-400 text-xs mb-1">
              <TrendingUp size={12} className="mr-1 text-emerald-400" /> Bestsellers
            </span>
            <span className="text-xl font-bold text-white tracking-tight">42+</span>
          </div>
          
          <div className="flex flex-col p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md select-none">
            <span className="flex items-center text-slate-400 text-xs mb-1">
              <Sparkles size={12} className="mr-1 text-teal-400" /> Data Freshness
            </span>
            <span className="text-xl font-bold text-white tracking-tight">Live</span>
          </div>
          
          <div className="flex flex-col p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md select-none">
            <span className="flex items-center text-slate-400 text-xs mb-1">
              <Clock size={12} className="mr-1 text-amber-400" /> Market Status
            </span>
            <span className="text-xl font-bold text-white tracking-tight">Highly Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}
