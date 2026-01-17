
import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../types';
import { getGeminiResponse } from '../services/geminiService';
import { Send, Bot, User, Loader2, Sparkles } from 'lucide-react';

export const GeminiChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm Aether, your architectural consultant. How can I help you modernize your digital ecosystem today?"
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const responseText = await getGeminiResponse([...messages, userMsg]);
    
    setMessages(prev => [...prev, {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: responseText
    }]);
    setIsLoading(false);
  };

  return (
    <section id="chat" className="py-24 bg-[#09090b]">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 text-indigo-400 mb-4">
            <Sparkles className="w-5 h-5" />
            <span className="font-bold tracking-widest text-xs uppercase">Consultancy</span>
          </div>
          <h2 className="text-4xl font-display font-bold mb-4">Talk to an AI Architect</h2>
          <p className="text-zinc-400 max-w-xl mx-auto">
            Our agent is trained on thousands of 2026 design paradigms to help you blueprint your next big move.
          </p>
        </div>

        <div className="max-w-4xl mx-auto glass rounded-3xl overflow-hidden shadow-2xl border-white/5 flex flex-col h-[600px]">
          {/* Chat Header */}
          <div className="p-4 border-b border-white/5 bg-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-bold text-sm">Aether Consultant</p>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-[10px] text-zinc-400 uppercase font-semibold">Active Engine</span>
                </div>
              </div>
            </div>
            <div className="text-[10px] font-mono text-zinc-500">GEMINI-3-FLASH</div>
          </div>

          {/* Messages Area */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex gap-4 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    msg.role === 'user' ? 'bg-zinc-800' : 'bg-indigo-600'
                  }`}>
                    {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user' ? 'bg-zinc-800 text-zinc-200' : 'bg-white/5 border border-white/10 text-zinc-300'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0">
                    <Loader2 className="w-4 h-4 animate-spin" />
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-zinc-500 italic text-sm">
                    Aether is calculating your response...
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-white/5 bg-white/5">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Ask about design strategy, tech stacks, or future trends..."
                className="w-full bg-zinc-950 border border-white/10 rounded-2xl py-4 pl-6 pr-14 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              />
              <button 
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="absolute right-2 top-2 bottom-2 px-4 bg-indigo-600 rounded-xl text-white hover:bg-indigo-500 disabled:opacity-50 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[10px] text-zinc-500 text-center mt-3 uppercase tracking-tighter">
              Aether AI may produce inaccurate information. System latency: ~450ms
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
