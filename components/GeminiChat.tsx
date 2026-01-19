
import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../types.ts';
import { getGeminiChatStream } from '../services/geminiService.ts';
import { Send, Bot, Loader2, Globe, Zap, Timer, ExternalLink, ShieldCheck } from 'lucide-react';
import { GenerateContentResponse } from "@google/genai";

export const GeminiChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "神经网络已完全同步。Aether 架构引擎现已接入 Gemini 3 Flash 原生节点，支持地面化搜索。移动端已适配，随时准备为您进行深度分析。"
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

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
      if (error.status === 429) setCooldown(60);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: error.status === 429 
          ? "⚠️ [WAF 预警]：检测到高频访问，请在 60 秒后重试。" 
          : "抱歉，由于神经元连接波动，请求未能送达。请检查网络环境或确保能够直连 AI 节点。"
      }]);
    } finally {
      setIsLoading(false);
      setIsSearching(false);
    }
  };

  return (
    <section id="chat" className="py-12 bg-[#030303]">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto glass rounded-[24px] md:rounded-[32px] overflow-hidden shadow-2xl flex flex-col h-[500px] md:h-[650px]">
          
          <div className="px-4 py-3 md:px-6 md:py-4 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-indigo-400" />
              <p className="font-bold text-xs md:text-sm">Aether Core</p>
            </div>
            <div className="flex items-center gap-2">
                {isSearching && <Globe className="w-3 h-3 text-indigo-400 animate-spin" />}
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-4 rounded-2xl max-w-[92%] md:max-w-[85%] text-xs md:text-sm leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-indigo-600 text-white rounded-tr-none' 
                      : 'bg-zinc-900 border border-white/10 text-zinc-200 rounded-tl-none'
                  }`}>
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-white/10 flex flex-wrap gap-2">
                        {msg.sources.map((s, i) => (
                          <a key={i} href={s.url} target="_blank" rel="noreferrer" className="px-2 py-1 bg-white/5 rounded text-[9px] text-zinc-400 flex items-center gap-1">
                            <ExternalLink className="w-2 h-2" /> {s.title || 'Source'}
                          </a>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 md:p-6 border-t border-white/5 bg-black/40">
            <div className="relative">
              <input 
                type="text" 
                placeholder={cooldown > 0 ? `冷却中 (${cooldown}s)...` : "输入分析指令..."}
                disabled={isLoading || cooldown > 0}
                className="w-full bg-zinc-950 border border-white/10 rounded-2xl py-4 pl-5 pr-14 text-xs md:text-sm focus:outline-none focus:border-indigo-500/50"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              />
              <button 
                onClick={handleSend}
                disabled={isLoading || !input.trim() || cooldown > 0}
                className="absolute right-2 top-2 bottom-2 px-4 rounded-xl bg-white text-black font-bold disabled:bg-zinc-800 transition-all"
              >
                {cooldown > 0 ? <Timer className="w-4 h-4" /> : isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
