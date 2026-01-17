
import React, { useState } from 'react';
import { generateAetherImage } from '../services/geminiService';
import { ImageIcon, Wand2, Loader2, History, ExternalLink, Globe, Zap, ShieldCheck } from 'lucide-react';
import { GeneratedImage } from '../types';

export const ImageGen: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [history, setHistory] = useState<GeneratedImage[]>([]);
  const [currentImage, setCurrentImage] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    // 调用更新后的自定义域名接口
    const imageUrl = await generateAetherImage(prompt);
    
    if (imageUrl) {
      setCurrentImage(imageUrl);
      setHistory(prev => [{
        url: imageUrl,
        prompt: prompt,
        timestamp: Date.now()
      }, ...prev].slice(0, 6));
    }
    
    // 给 UI 一个缓冲感，增强渲染体验
    setTimeout(() => setIsGenerating(false), 1500);
  };

  return (
    <section id="design" className="py-24 bg-[#030303] relative">
      <div className="blob bottom-0 left-0 opacity-10" />
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <div className="flex items-center justify-between mb-8">
              <div className="inline-flex items-center gap-2 text-indigo-400">
                <Globe className="w-5 h-5" />
                <span className="font-bold tracking-widest text-xs uppercase">Domain: blog.aitishici.de5.net</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20">
                <ShieldCheck className="w-3 h-3 text-indigo-400" />
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-tighter">Private Engine Active</span>
              </div>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">Manifest Art</h2>
            <p className="text-zinc-500 mb-10 text-lg leading-relaxed">
              您的专属 Cloudflare 边缘渲染节点已就绪。通过自定义域名进行加密通信，确保生成过程的安全与私密。
            </p>

            <div className="space-y-8">
              <div className="relative group">
                <textarea 
                  className="w-full bg-zinc-900/40 border border-white/10 rounded-3xl p-7 text-sm min-h-[160px] focus:outline-none focus:border-indigo-500/50 transition-all placeholder:text-zinc-700"
                  placeholder="描述一个带有极简主义家具和落地窗的未来主义起居室..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
                <button 
                  onClick={handleGenerate}
                  disabled={isGenerating || !prompt.trim()}
                  className="absolute bottom-5 right-5 bg-white text-black px-7 py-3.5 rounded-2xl font-bold flex items-center gap-3 transition-all active:scale-95 shadow-2xl hover:bg-zinc-200 disabled:opacity-20"
                >
                  {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Wand2 className="w-5 h-5" />}
                  {isGenerating ? '正在通过边缘节点渲染...' : '开始渲染'}
                </button>
              </div>

              {history.length > 0 && (
                <div className="pt-6 border-t border-white/5">
                  <div className="flex items-center gap-2 text-zinc-500 mb-5">
                      <History className="w-4 h-4" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">渲染历史</span>
                  </div>
                  <div className="grid grid-cols-6 gap-3">
                    {history.map((item) => (
                      <button 
                        key={item.timestamp} 
                        onClick={() => setCurrentImage(item.url)}
                        className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                          currentImage === item.url ? 'border-indigo-500 ring-2 ring-indigo-500/20' : 'border-transparent opacity-40 hover:opacity-100'
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

          <div className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-tr from-indigo-500/20 to-blue-500/20 rounded-[48px] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="relative aspect-square glass-card rounded-[40px] border border-white/10 overflow-hidden flex items-center justify-center p-3 shadow-2xl transition-transform duration-500 group-hover:scale-[1.01]">
              {currentImage ? (
                <div className="relative w-full h-full">
                  <img 
                    src={currentImage} 
                    key={currentImage}
                    alt="Generated Art" 
                    className="w-full h-full object-cover rounded-[32px] animate-fade-in"
                  />
                  <div className="absolute bottom-6 right-6 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
                    <a 
                      href={currentImage} 
                      target="_blank" 
                      className="p-4 bg-black/60 backdrop-blur-xl rounded-2xl text-white hover:bg-white hover:text-black transition-all border border-white/10"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              ) : (
                <div className="text-center p-12">
                  <div className="w-24 h-24 bg-white/[0.02] rounded-3xl flex items-center justify-center mx-auto mb-8 border border-white/5 text-zinc-800">
                    <ImageIcon className="w-12 h-12 opacity-20" />
                  </div>
                  <h4 className="text-zinc-400 font-bold mb-2">等待边缘响应</h4>
                  <p className="text-zinc-600 text-xs max-w-[200px] mx-auto leading-relaxed">
                    输入 Prompt 并通过自定义域名接口进行安全渲染。
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
