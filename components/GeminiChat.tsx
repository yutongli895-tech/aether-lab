
import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../types.ts';
import { getGeminiChatStream } from '../services/geminiService.ts';
import { Send, Bot, Loader2, Globe, Zap, Timer, ExternalLink, ShieldCheck, Copy, Check } from 'lucide-react';
import { GenerateContentResponse } from "@google/genai";

// 简单的 Markdown 解析组件
const MarkdownText: React.FC<{ text: string }> = ({ text }) => {
  const lines = text.split('\n');
  return (
    <div className="space-y-2">
      {lines.map((line, i) => {
        // 处理标题
        if (line.startsWith('### ')) return <h4 key={i} className="text-lg font-bold text-indigo-300 mt-4 mb-2">{line.slice(4)}</h4>;
        if (line.startsWith('## ')) return <h3 key={i} className="text-xl font-bold text-indigo-400 mt-6 mb-3">{line.slice(3)}</h3>;
        
        // 处理无序列表
        if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
          return <li key={i} className="ml-4 list-disc text-zinc-300">{line.trim().slice(2)}</li>;
        }
        
        // 处理有序列表
        if (line.trim().match(/^\d+\. /)) {
          return <li key={i} className="ml-4 list-decimal text-zinc-300">{line.trim().slice(line.indexOf('.') + 2)}</li>;
        }

        // 处理粗体和普通文本
        const parts = line.split(/(\*\*.*?\*\*|`.*?`)/g);
        return (
          <p key={i} className="leading-relaxed">
            {parts.map((part, j) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={j} className="text-white font-bold">{part.slice(2, -2)}</strong>;
              }
              if (part.startsWith('`') && part.endsWith('`')) {
                return <code key={j} className="bg-white/10 px-1.5 py-0.5 rounded font-mono text-indigo-300 text-[0.9em]">{part.slice(1, -1)}</code>;
              }
              return part;
            })}
          </p>
        );
      })}
    </div>
  );
};

export const GeminiChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "### 核心架构已就绪\n\nAether V3.0 神经链路已激活。我已接入 **Gemini 3 Flash** 实时节点，支持全球范围内的技术趋势检索与架构深度分析。\n\n你可以试着问我：\n- 如何在边缘计算中部署容器化应用？\n- 帮我拟定一个基于 GitHub Pages 的博客部署手册。\n- 分析 2026 年生成式 UI 的发展趋势。"
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, isLoading, isSearching]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading || cooldown > 0) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    setIsSearching(true);

    try {
      const stream = await getGeminiChatStream(input, messages);
      let fullResponse = "";
      const assistantMsgId = (Date.now() + 1).toString();
      let groundingSources: { title: string; url: string }[] = [];
      
      setMessages(prev => [...prev, { id: assistantMsgId, role: 'assistant', content: "" }]);

      for await (const chunk of stream) {
        const c = chunk as GenerateContentResponse;
        setIsSearching(false);
        const text = c.text;
        
        const chunks = c.candidates?.[0]?.groundingMetadata?.groundingChunks;
        if (chunks) {
           chunks.forEach((chunk: any) => {
             if (chunk.web) {
               const exists = groundingSources.some(s => s.url === chunk.web.uri);
               if (!exists) groundingSources.push({ title: chunk.web.title, url: chunk.web.uri });
             }
           });
        }

        if (text) {
          fullResponse += text;
          setMessages(prev => prev.map(m => 
            m.id === assistantMsgId ? { 
              ...m, 
              content: fullResponse, 
              sources: groundingSources.length > 0 ? groundingSources : m.sources 
            } : m
          ));
        }
      }
    } catch (error: any) {
      console.error("Chat Error:", error);
      const isRateLimit = error.status === 429 || error.message?.includes('429');
      if (isRateLimit) setCooldown(60);
      
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: isRateLimit 
          ? "⚠️ **[系统级限流]**：检测到当前节点请求过于频繁。为了确保公平算力，请在 60 秒后重连。" 
          : "❌ **[链路中断]**：神经元连接异常。这可能是由于本地网络无法直接访问 AI 核心节点导致的。请检查您的网络配置或 API 有效性。"
      }]);
    } finally {
      setIsLoading(false);
      setIsSearching(false);
    }
  };

  return (
    <section id="chat" className="py-20 bg-[#030303] relative">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto flex flex-col h-[750px] bg-[#09090b] rounded-[40px] border border-white/5 shadow-3xl overflow-hidden relative">
          
          {/* 顶部状态栏 */}
          <div className="px-8 py-5 border-b border-white/5 bg-white/[0.01] flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center border border-indigo-500/20">
                <Zap className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <h3 className="font-display font-bold text-sm tracking-tight uppercase">Aether Architect Core</h3>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  Neural Link: Active
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
               {isSearching && (
                 <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20">
                   <Globe className="w-3 h-3 text-indigo-400 animate-spin" />
                   <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-tighter">Searching Web...</span>
                 </div>
               )}
               <div className="p-2 rounded-lg hover:bg-white/5 transition-colors cursor-help group relative">
                 <ShieldCheck className="w-5 h-5 text-emerald-500/70" />
                 <span className="absolute bottom-full right-0 mb-2 w-48 p-2 bg-zinc-900 border border-white/10 text-[10px] text-zinc-400 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                   已通过端到端加密连接到 Gemini 3 Flash 原生节点。
                 </span>
               </div>
            </div>
          </div>

          {/* 消息区域 */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-10 scroll-smooth">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`group relative max-w-[90%] md:max-w-[75%] ${msg.role === 'user' ? 'w-auto' : 'w-full'}`}>
                  
                  {msg.role === 'assistant' && (
                    <div className="flex items-center gap-2 mb-3 text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
                      <Bot className="w-3 h-3" /> Aether Intelligence
                    </div>
                  )}

                  <div className={`p-6 md:p-8 rounded-[24px] md:rounded-[32px] text-sm md:text-[15px] shadow-sm transition-all ${
                      msg.role === 'user' 
                        ? 'bg-indigo-600 text-white rounded-tr-none' 
                        : 'bg-zinc-900/50 border border-white/5 text-zinc-200 rounded-tl-none hover:border-white/10'
                    }`}>
                    <MarkdownText text={msg.content} />
                    
                    {msg.sources && msg.sources.length > 0 && (
                      <div className="mt-8 pt-6 border-t border-white/5">
                        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">Grounding Sources:</p>
                        <div className="flex flex-wrap gap-2">
                            {msg.sources.map((s, i) => (
                              <a key={i} href={s.url} target="_blank" rel="noreferrer" className="px-3 py-1.5 bg-white/5 hover:bg-indigo-500/20 rounded-xl text-[10px] text-zinc-400 hover:text-indigo-300 transition-all flex items-center gap-2 border border-white/5">
                                <ExternalLink className="w-3 h-3" /> {s.title || 'Source Node'}
                              </a>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 操作栏 */}
                  <div className={`absolute top-0 ${msg.role === 'user' ? 'right-full mr-2' : 'left-full ml-2'} opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-2`}>
                    <button 
                      onClick={() => copyToClipboard(msg.content, msg.id)}
                      className="p-2 rounded-full bg-white/5 border border-white/10 text-zinc-500 hover:text-white transition-all"
                      title="Copy content"
                    >
                      {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && isSearching && (
              <div className="flex justify-start">
                <div className="bg-zinc-900/30 border border-white/5 p-6 rounded-[32px] rounded-tl-none animate-pulse flex items-center gap-4">
                  <Loader2 className="w-4 h-4 text-indigo-500 animate-spin" />
                  <span className="text-xs text-zinc-500 font-medium tracking-wide">神经网络正在检索全球资讯...</span>
                </div>
              </div>
            )}
          </div>

          {/* 输入区域 */}
          <div className="p-8 border-t border-white/5 bg-black/20">
            <div className="max-w-4xl mx-auto relative group">
              <div className="absolute inset-0 bg-indigo-500/10 blur-xl rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
              <div className="relative flex items-center gap-3">
                <div className="flex-1 relative">
                  <input 
                    type="text" 
                    placeholder={cooldown > 0 ? `WAF 冷却中 (${cooldown}s)...` : "输入分析指令，按回车发送..."}
                    disabled={isLoading || cooldown > 0}
                    className="w-full bg-zinc-950/80 border border-white/10 rounded-[24px] py-5 pl-7 pr-16 text-[15px] focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all placeholder:text-zinc-600"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    <span className="text-[10px] font-bold text-zinc-700 hidden md:block">ENTER TO SEND</span>
                  </div>
                </div>
                <button 
                  onClick={handleSend}
                  disabled={isLoading || !input.trim() || cooldown > 0}
                  className="w-14 h-14 rounded-2xl bg-white text-black flex items-center justify-center hover:bg-indigo-500 hover:text-white transition-all transform active:scale-90 disabled:bg-zinc-800 disabled:text-zinc-600 shadow-xl"
                >
                  {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6" />}
                </button>
              </div>
            </div>
            <p className="text-center mt-4 text-[9px] text-zinc-600 font-bold uppercase tracking-[0.3em]">
              Architectural Engine V3.0 • Secure Neural Link • Distributed by Aether
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
