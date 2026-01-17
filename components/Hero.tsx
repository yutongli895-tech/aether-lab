
import React from 'react';
import { ChevronRight, Play } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section id="hero" className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-1/4 -left-20 w-72 h-72 bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 -right-20 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-indigo-300 mb-8 animate-fade-in">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>
          V3.0 PLATFORM NOW LIVE
        </div>
        
        <h1 className="text-5xl md:text-8xl font-display font-bold tracking-tight leading-[1.1] mb-8 max-w-5xl mx-auto">
          Design the <span className="gradient-text">Future</span> with Generative Architecture.
        </h1>
        
        <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          The next generation of SaaS infrastructure. Build, iterate, and deploy at the speed of thought with Aether’s proprietary neural engine.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button className="w-full sm:w-auto px-8 py-4 bg-white text-black rounded-full font-bold flex items-center justify-center gap-2 hover:bg-zinc-200 transition-all transform hover:scale-105 active:scale-95 shadow-xl shadow-white/5">
            Start Building <ChevronRight className="w-4 h-4" />
          </button>
          <button className="w-full sm:w-auto px-8 py-4 bg-zinc-900 border border-white/10 text-white rounded-full font-bold flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all">
            <Play className="w-4 h-4 fill-current" /> Watch Demo
          </button>
        </div>

        {/* Dashboard Preview */}
        <div className="mt-20 relative max-w-6xl mx-auto">
          <div className="relative glass rounded-2xl p-2 shadow-2xl">
            <img 
              src="https://picsum.photos/seed/aether-dashboard/1200/600" 
              alt="Dashboard Preview" 
              className="rounded-xl border border-white/10 opacity-80"
            />
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-transparent to-transparent opacity-60 rounded-xl" />
          </div>
          
          {/* Floating Feature cards for visual interest */}
          <div className="absolute -bottom-10 -left-6 hidden lg:block glass p-4 rounded-xl border border-indigo-500/20 shadow-lg animate-bounce-slow">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-500/20 rounded-lg flex items-center justify-center text-indigo-400">
                <Zap className="w-6 h-6" />
              </div>
              <div className="text-left">
                <p className="text-xs text-zinc-400">Optimization</p>
                <p className="text-sm font-bold">99.9% Efficiency</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Helper components for icons to avoid extra imports in this file
const Zap = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/></svg>
);
