
import React from 'react';
import { Hexagon, Twitter, Github, Linkedin, ArrowUpRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-zinc-950 pt-24 pb-12 border-t border-white/5">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <Hexagon className="w-8 h-8 text-indigo-500 fill-indigo-500/20" />
              <span className="text-2xl font-bold font-display tracking-tight uppercase">Aether</span>
            </div>
            <p className="text-zinc-400 max-w-sm mb-8 leading-relaxed">
              Pioneering the intersection of artificial intelligence and human-centric design. We build the interfaces of tomorrow, today.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="p-3 bg-white/5 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-all">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="p-3 bg-white/5 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-all">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="p-3 bg-white/5 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-all">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-6 uppercase tracking-widest text-xs">Resources</h4>
            <ul className="space-y-4">
              {['Documentation', 'API Reference', 'Case Studies', 'Changelog'].map(item => (
                <li key={item}>
                  <a href="#" className="text-zinc-400 hover:text-white transition-colors flex items-center group">
                    {item} <ArrowUpRight className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-all" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 uppercase tracking-widest text-xs">Platform</h4>
            <ul className="space-y-4">
              {['Pricing', 'Enterprise', 'Security', 'Privacy Policy'].map(item => (
                <li key={item}>
                  <a href="#" className="text-zinc-400 hover:text-white transition-colors flex items-center group">
                    {item} <ArrowUpRight className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-all" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-zinc-500 text-xs">
            © 2026 Aether Generative Systems Inc. All rights reserved.
          </p>
          <div className="flex gap-6">
            <p className="text-[10px] text-zinc-600 font-mono">NODE_ENV: PRODUCTION</p>
            <p className="text-[10px] text-zinc-600 font-mono">LATENCY: OPTIMIZED</p>
          </div>
        </div>
      </div>
    </footer>
  );
};
