
import React, { useState, useEffect } from 'react';
import { NAV_LINKS } from '../constants.tsx';
import { Menu, X } from 'lucide-react';

const AetherLogo = () => (
  <svg className="w-9 h-9" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#6366f1" />
        <stop offset="100%" stopColor="#a855f7" />
      </linearGradient>
      <filter id="glow">
        <feGaussianBlur stdDeviation="2" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    <path 
      d="M50 5 L90 27.5 L90 72.5 L50 95 L10 72.5 L10 27.5 Z" 
      stroke="url(#logoGrad)" 
      strokeWidth="4" 
      className="drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]"
    />
    <path 
      d="M35 70 L50 30 L65 70 M42 55 L58 55" 
      stroke="url(#logoGrad)" 
      strokeWidth="6" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      filter="url(#glow)"
    />
  </svg>
);

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? 'py-4 bg-[#030303]/80 backdrop-blur-xl border-b border-white/5 shadow-2xl' : 'py-6 bg-transparent'
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-3 group cursor-pointer">
          <AetherLogo />
          <span className="text-2xl font-bold font-display tracking-tighter uppercase group-hover:text-indigo-400 transition-colors">Aether</span>
        </div>

        <nav className="hidden md:flex items-center gap-10">
          {NAV_LINKS.map((link) => (
            <a 
              key={link.label} 
              href={link.href}
              className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-500 hover:text-white transition-all"
            >
              {link.label}
            </a>
          ))}
          <button 
            onClick={scrollToContact}
            className="bg-white text-black px-6 py-2.5 rounded-full text-xs font-bold hover:bg-indigo-500 hover:text-white transition-all active:scale-95 shadow-lg shadow-white/5"
          >
            Contact
          </button>
        </nav>

        <button 
          className="md:hidden text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-[#09090b] border-b border-white/5 p-8 flex flex-col gap-6 animate-in slide-in-from-top-4 duration-300">
          {NAV_LINKS.map((link) => (
            <a 
              key={link.label} 
              href={link.href}
              className="text-lg font-bold uppercase tracking-widest text-zinc-400"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <button 
            onClick={scrollToContact}
            className="w-full bg-white text-black py-4 rounded-2xl font-bold"
          >
            Contact Node
          </button>
        </div>
      )}
    </header>
  );
};
