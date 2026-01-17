
import React from 'react';
import { FEATURES } from '../constants';

export const Features: React.FC = () => {
  return (
    <section id="features" className="py-24 bg-zinc-950 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="mb-16">
          <h2 className="text-indigo-400 font-semibold tracking-wider text-sm uppercase mb-4">The Engine</h2>
          <h3 className="text-3xl md:text-5xl font-display font-bold max-w-2xl">
            Everything you need to scale your digital presence.
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {FEATURES.map((feature, idx) => (
            <div 
              key={idx} 
              className="p-8 rounded-2xl glass border border-white/5 hover:border-indigo-500/30 transition-all duration-300 group"
            >
              <div className="mb-6 inline-flex p-3 bg-white/5 rounded-xl group-hover:bg-indigo-500/10 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h4 className="text-xl font-bold mb-3">{feature.title}</h4>
              <p className="text-zinc-400 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-20 p-1 rounded-2xl bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-blue-500/20">
          <div className="bg-[#09090b] rounded-[14px] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-xl">
              <h4 className="text-2xl font-bold mb-4">Enterprise-Grade Security</h4>
              <p className="text-zinc-400">
                Your data is protected by AES-256 encryption at rest and TLS 1.3 in transit. We prioritize privacy so you can focus on innovation.
              </p>
            </div>
            <button className="px-8 py-4 glass rounded-full font-bold hover:bg-white/5 transition-colors border-white/10 shrink-0">
              Read Security Whitepaper
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
