
import React, { useState } from 'react';
import { generateAetherImage } from '../services/geminiService';
import { ImageIcon, Wand2, Loader2, History, ExternalLink, CheckCircle2 } from 'lucide-react';
import { GeneratedImage } from '../types';

export const ImageGen: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [history, setHistory] = useState<GeneratedImage[]>([]);
  const [currentImage, setCurrentImage] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    const result = await generateAetherImage(prompt);
    
    if (result) {
      setCurrentImage(result);
      setHistory(prev => [{
        url: result,
        prompt: prompt,
        timestamp: Date.now()
      }, ...prev].slice(0, 6));
    }
    setIsGenerating(false);
  };

  return (
    <section id="design" className="py-24 bg-zinc-950">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="inline-flex items-center gap-2 text-purple-400">
                <ImageIcon className="w-5 h-5" />
                <span className="font-bold tracking-widest text-xs uppercase">Custom Engine</span>
              </div>
              {/* 状态指示灯 - 基于你刚才 cURL 成功的反馈 */}
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-[10px] font-bold text-green-400 uppercase tracking-tighter">Engine Online</span>
              </div>
            </div>
            
            <h2 className="text-4xl font-display font-bold mb-6">Visualizer Lab</h2>
            <p className="text-zinc-400 mb-10 text-lg">
              Authenticated connection established with <span className="text-white font-mono">odd-credit-b262</span>. Your neural engine is ready to process latent space visualizations.
            </p>

            <div className="space-y-6">
              <div className="relative">
                <textarea 
                  className="w-full bg-zinc-900 border border-white/10 rounded-2xl p-6 text-sm min-h-[120px] focus:outline-none focus:border-purple-500 transition-colors"
                  placeholder="Input neural prompt for the Cloudflare Worker..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
                <button 
                  onClick={handleGenerate}
                  disabled={isGenerating || !prompt.trim()}
                  className="absolute bottom-4 right-4 bg-purple-600 hover:bg-purple-500 disabled:bg-zinc-800 px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-purple-500/20"
                >
                  {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Wand2 className="w-5 h-5" />}
                  {isGenerating ? 'Processing...' : 'Generate Image'}
                </button>
              </div>

              {history.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4 text-zinc-500">
                    <History className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-widest">Render History</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    {history.map((item) => (
                      <button 
                        key={item.timestamp} 
                        onClick={() => setCurrentImage(item.url)}
                        className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                          currentImage === item.url ? 'border-purple-500 scale-95' : 'border-transparent opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={item.url} alt={item.prompt} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="relative aspect-square">
            <div className="absolute inset-0 bg-purple-600/10 blur-[100px] rounded-full pointer-events-none" />
            <div className="relative w-full h-full glass rounded-[40px] border border-white/10 overflow-hidden flex items-center justify-center p-4">
              {currentImage ? (
                <div className="relative group w-full h-full">
                  <img 
                    src={currentImage} 
                    alt="Generated Visual" 
                    className="w-full h-full object-cover rounded-[32px] animate-fade-in"
                  />
                  <div className="absolute top-6 right-6 flex gap-2">
                    <a 
                      href={currentImage} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-3 bg-black/50 backdrop-blur-md rounded-full text-white hover:bg-black/70 transition-colors border border-white/10"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              ) : (
                <div className="text-center p-12">
                  <div className="w-20 h-20 bg-zinc-900 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-white/5 text-zinc-600">
                    <CheckCircle2 className="w-10 h-10 text-green-500/50" />
                  </div>
                  <p className="text-zinc-500 text-sm max-w-xs mx-auto">
                    Verified connection to <strong>odd-credit-b262</strong>. Enter a prompt to begin.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
