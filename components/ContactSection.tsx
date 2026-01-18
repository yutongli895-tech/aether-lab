
import React from 'react';
import { Mail, MessageCircle, Send, Globe, ShieldCheck } from 'lucide-react';

export const ContactSection: React.FC = () => {
  return (
    <section id="contact" className="py-24 relative overflow-hidden bg-[#030303]">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-[100px] -z-10" />

      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-indigo-400 font-semibold tracking-wider text-sm uppercase mb-4 flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4" /> Secure Communication Channel
            </h2>
            <h3 className="text-4xl md:text-6xl font-display font-bold mb-6 italic">Connect with Aether.</h3>
            <p className="text-zinc-500 max-w-2xl mx-auto text-lg leading-relaxed">
              无论是架构咨询、项目合作，还是技术探讨，我们的神经元节点始终保持开放。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Email Card 1 */}
            <div className="glass-card p-8 rounded-[32px] border border-white/5 hover:border-indigo-500/30 transition-all group flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 transition-transform">
                <Mail className="w-7 h-7" />
              </div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Primary Inbox</h4>
              <p className="text-xl font-display font-semibold text-white group-hover:text-indigo-400 transition-colors">
                lablabe@qq.com
              </p>
              <a href="mailto:lablabe@qq.com" className="mt-6 text-xs text-zinc-500 hover:text-white flex items-center gap-2 transition-colors">
                Click to copy address <Send className="w-3 h-3" />
              </a>
            </div>

            {/* Email Card 2 */}
            <div className="glass-card p-8 rounded-[32px] border border-white/5 hover:border-purple-500/30 transition-all group flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-400 mb-6 group-hover:scale-110 transition-transform">
                <Mail className="w-7 h-7" />
              </div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Secondary Node</h4>
              <p className="text-xl font-display font-semibold text-white group-hover:text-purple-400 transition-colors">
                soralabe@foxmail.com
              </p>
              <a href="mailto:soralabe@foxmail.com" className="mt-6 text-xs text-zinc-500 hover:text-white flex items-center gap-2 transition-colors">
                Send formal inquiry <Send className="w-3 h-3" />
              </a>
            </div>

            {/* WeChat Card */}
            <div className="glass-card p-8 rounded-[32px] border border-white/5 hover:border-emerald-500/30 transition-all group flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
                <MessageCircle className="w-7 h-7" />
              </div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Official Channel</h4>
              <p className="text-xl font-display font-semibold text-white group-hover:text-emerald-400 transition-colors">
                @浅墨青言
              </p>
              <p className="mt-6 text-[10px] text-zinc-600 uppercase tracking-[0.2em] font-medium">
                WeChat Public Account
              </p>
            </div>
          </div>

          <div className="mt-20 p-12 glass rounded-[40px] border border-white/5 text-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5">
               <Globe className="w-48 h-48 text-white animate-spin-slow" />
            </div>
            <h4 className="text-2xl font-bold mb-4 relative z-10 italic">Ready to accelerate your vision?</h4>
            <p className="text-zinc-500 mb-8 relative z-10">
              我们的 AI 架构师通常在 24 小时内建立握手连接。
            </p>
            <button className="px-10 py-4 bg-white text-black font-bold rounded-full hover:bg-zinc-200 transition-all relative z-10 active:scale-95">
              Launch Collaboration
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
