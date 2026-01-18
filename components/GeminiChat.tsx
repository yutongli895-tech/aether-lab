import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../types.ts';
import { getGeminiChatStream } from '../services/geminiService.ts';
import { Send, Bot, User, Loader2, Cpu, ShieldCheck, Globe, Zap, AlertTriangle, ShieldAlert, Timer } from 'lucide-react';

export const GeminiChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "神经网络已完全同步。Aether 架构引擎现已接入 Gemini 3 Flash 实时节点，支持联网搜索与深度设计分析。"
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [errorType, setErrorType] = useState<'none' | 'limit' | 'other'>('none');
  const [cooldown, setCooldown] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 冷却倒计时逻辑
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (cooldown === 0 && errorType === 'limit') {
      setErrorType('none');
    }
  }, [cooldown]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading || cooldown > 0) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    setIsSearching(true);
    setErrorType('none');

    try {
      const stream = await getGeminiChatStream(input, messages);
      let fullResponse = "";
      
      const assistantMsgId = (Date.now() + 1).toString();
      
      setMessages(prev => [...prev, {
        id: assistantMsgId,
        role: 'assistant',
        content: ""
      }]);

      for await (const chunk of stream) {
        setIsSearching(false);
        const text = chunk.text;
        if (text) {
          fullResponse += text;
          setMessages(prev => prev.map(m => 
            m.id === assistantMsgId ? { ...m, content: fullResponse } : m
          ));
        }
      }
    } catch (error: any) {
      console.error("Chat Error:", error);
      // 识别 429 或 WAF 拦截
      if (error.status === 429 || error.message?.includes('429')) {
        setErrorType('limit');
        setCooldown(30); // 开启 30 秒冷却
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          role: 'assistant',
          content: "⚠️ [边缘节点防护触发]：检测到高频请求。为了确保资源公平分配，Aether 神经核已进入安全冷却模式。请在倒计时结束后重试。"
        }]);
      } else {
        setErrorType('other');
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          role: 'assistant',
          content: "抱歉，由于神经元连接波动（网络异常），我暂时无法处理您的请求。请稍后刷新重试。"
        }]);
      }
    } finally {
      setIsLoading(false);
      setIsSearching(false);
    }
  };

  return (
    <section id="chat" className="py-24 bg-[#030303] relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto glass rounded-[32px] overflow-hidden shadow-2xl border-white/5 flex flex-col h-[700px] relative">
          
          {/* 顶栏优化：增加 WAF 状态指示 */}
          <div className="px-6 py-4 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${errorType === 'limit' ? 'bg-amber-500/20' : 'bg-indigo-500/20'}`}>
                {errorType === 'limit' ? <ShieldAlert className="w-5 h-5 text-amber-500" /> : <Zap className="w-5 h-5 text-indigo-400 fill-indigo-400/20" />}
              </div>
              <div>
                <p className="font-bold text-sm">Aether Neural Core</p>
                <div className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full ${errorType === 'limit' ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`}></span>
                  <p className="text-[9px] text-zinc-500 uppercase font-bold tracking-widest">
                    {errorType === 'limit' ? 'WAF Rate Limited' : 'Edge Verified'}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full border border-white/10">
                  <Globe className={`w-3 h-3 ${isSearching ? 'text-indigo-400 animate-spin' : 'text-zinc-500'}`} />
                  <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-tight">Grounding Active</span>
                </div>
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
            </div>
          </div>

          {/* 消息区域 */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`group relative p-5 rounded-2xl max-w-[85%] text-sm leading-relaxed shadow-sm transition-all ${
                    msg.role === 'user' 
                      ? 'bg-indigo-600/90 text-white rounded-tr-none' 
                      : msg.content.includes('[边缘节点防护触发]')
                        ? 'bg-amber-500/10 border border-amber-500/20 text-amber-200 rounded-tl-none'
                        : 'bg-zinc-900/80 backdrop-blur-sm border border-white/10 text-zinc-200 rounded-tl-none'
                  }`}>
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                  
                  {msg.role === 'assistant' && (
                    <div className="absolute -left-2 top-0 text-zinc-900">
                      {msg.content.includes('[边缘节点防护触发]') ? <ShieldAlert className="w-4 h-4 text-amber-500/60" /> : <Bot className="w-4 h-4 text-indigo-500/40" />}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isSearching && (
              <div className="flex justify-start">
                <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/[0.02] border border-white/5 text-zinc-500 text-xs italic animate-pulse">
                  <Globe className="w-3 h-3 animate-spin text-indigo-400" />
                  正在检索全球数据库...
                </div>
              </div>
            )}
            
            {isLoading && !isSearching && !messages[messages.length-1].content && (
              <div className="flex justify-start">
                <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/[0.02] border border-white/5 text-zinc-500 text-xs italic">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  神经元重构中...
                </div>
              </div>
            )}
          </div>

          {/* 输入区域：增加冷却倒计时显示 */}
          <div className="p-6 border-t border-white/5 bg-black/40 backdrop-blur-xl">
            <div className="relative group">
              <div className={`absolute -inset-1 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition duration-500 ${errorType === 'limit' ? 'bg-amber-500/20' : 'bg-indigo-500/20'}`}></div>
              <input 
                type="text" 
                placeholder={cooldown > 0 ? `安全冷却中 (${cooldown}s)...` : "输入指令..."}
                disabled={isLoading || cooldown > 0}
                className="relative w-full bg-zinc-950 border border-white/10 rounded-2xl py-5 pl-6 pr-16 text-sm focus:outline-none focus:border-indigo-500/50 transition-all placeholder:text-zinc-600 disabled:opacity-50"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              />
              <button 
                onClick={handleSend}
                disabled={isLoading || !input.trim() || cooldown > 0}
                className={`absolute right-3 top-3 bottom-3 px-5 rounded-xl font-bold transition-all active:scale-95 flex items-center justify-center ${
                  cooldown > 0 ? 'bg-zinc-800 text-zinc-500' : 'bg-white text-black hover:bg-indigo-500 hover:text-white'
                }`}
              >
                {cooldown > 0 ? <Timer className="w-4 h-4 animate-pulse" /> : isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </div>
            <p className="mt-3 text-[10px] text-center text-zinc-600 uppercase tracking-[0.2em] font-medium">
              Aether Cloudflare WAF + Gemini 3 Neural Engine
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
