
import React from 'react';
import { Twitter, Github, Linkedin, ArrowUpRight } from 'lucide-react';

const AetherLogo = () => (
  <svg className="w-10 h-10" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="footerLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#6366f1" />
        <stop offset="100%" stopColor="#a855f7" />
      </linearGradient>
    </defs>
    <path d="M50 5 L90 27.5 L90 72.5 L50 95 L10 72.5 L10 27.5 Z" stroke="url(#footerLogoGrad)" strokeWidth="4" opacity="0.5" />
    <path d="M35 70 L50 30 L65 70 M42 55 L58 55" stroke="url(#footerLogoGrad)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const Footer: React.FC = () => {
  return (
    <footer className="bg-zinc-950 pt-24 pb-12 border-t border-white/5 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-4 mb-8 group cursor-pointer">
              <AetherLogo />
              <span className="text-3xl font-bold font-display tracking-tighter uppercase">Aether</span>
            </div>
            <p className="text-zinc-500 max-w-sm mb-10 leading-relaxed text-sm font-medium">
              Pioneering the intersection of artificial intelligence and human-centric design. We build the interfaces of tomorrow, today.
            </p>
            <div className="flex items-center gap-4">
              {[Twitter, Github, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="p-3.5 bg-white/5 rounded-2xl text-zinc-500 hover:text-white hover:bg-indigo-600 transition-all hover:-translate-y-1">
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-8 uppercase tracking-[0.3em] text-[10px] text-zinc-600">Resources</h4>
            <ul className="space-y-4">
              {['Documentation', 'API Reference', 'Case Studies', 'Changelog'].map(item => (
                <li key={item}>
                  <a href="#" className="text-zinc-500 hover:text-white transition-colors flex items-center group text-sm font-medium">
                    {item} <ArrowUpRight className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-all" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-8 uppercase tracking-[0.3em] text-[10px] text-zinc-600">Platform</h4>
            <ul className="space-y-4">
              {['Pricing', 'Enterprise', 'Security', 'Privacy Policy'].map(item => (
                <li key={item}>
                  <a href="#" className="text-zinc-500 hover:text-white transition-colors flex items-center group text-sm font-medium">
                    {item} <ArrowUpRight className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-all" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest">
            © 2026 Aether Generative Systems Inc. All rights reserved.
          </p>
          <div className="flex gap-8">
            <p className="text-[9px] text-zinc-700 font-mono tracking-tighter">NODE_ENV: PRODUCTION</p>
            <p className="text-[9px] text-zinc-700 font-mono tracking-tighter">ENCRYPTION: AES-256-GCM</p>
          </div>
        </div>
      </div>
    </footer>
  );
};
