import React, { useState } from 'react';
import { generateAetherImage } from '../services/geminiService.ts';
import { ImageIcon, Wand2, Loader2, History, ExternalLink, Globe, AlertCircle, ShieldCheck } from 'lucide-react';
import { GeneratedImage } from '../types.ts';

export const ImageGen: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [history, setHistory] = useState<GeneratedImage[]>([]);
  const [currentImage, setCurrentImage] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    setHasError(false);
    
    try {
      const imageUrl = await generateAetherImage(prompt);
      
      // 创建一个新的图片对象用于检测加载状态
      const img = new Image();
      img.src = imageUrl;
      
      img.onload = () => {
        setCurrentImage(imageUrl);
        setHistory(prev => [{
          url: imageUrl,
          prompt: prompt,
          timestamp: Date.now()
        }, ...prev].slice(0, 6));
        setIsGenerating(false);
      };

      img.onerror = () => {
        console.error("Image load failed, likely 401 Unauthorized");
        setHasError(true);
        setIsGenerating(false);
      };
    } catch (err) {
      setHasError(true);
      setIsGenerating(false);
    }
  };

  return (
    <section id="design" className="py-24 bg-[#030303] relative">
      <div className="blob bottom-0 left-0 opacity-10" />
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-8">
              <div className="inline-flex items-center gap-2 text-indigo-400">
                <Globe className="w-5 h-5" />
                <span className="font-bold tracking-widest text-[10px] uppercase">Node: CF-Workers-Edge</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-[9px] font-bold text-emerald-500 uppercase">Secure Auth: P@ssw0rd</span>
              </div>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 italic">Visual Engine.</h2>
            <p className="text-zinc-500 mb-10 text-lg leading-relaxed">
              您的视觉引擎节点已接入加密链路。所有生成的资产均受密码验证保护，确保只有授权请求能触达边缘算力。
            </p>

            <div className="space-y-8">
              <div className="relative group">
                <textarea 
                  className={`w-full bg-zinc-900/40 border ${hasError ? 'border-red-500/50' : 'border-white/10'} rounded-3xl p-7 text-sm min-h-[160px] focus:outline-none focus:border-indigo-500/50 transition-all placeholder:text-zinc-700`}
                  placeholder="输入提示词（例如：一张暗黑风格的未来主义空间站内景）..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
                
                {hasError && (
                  <div className="absolute top-4 right-4 flex items-center gap-2 text-red-400 text-[10px] font-bold uppercase">
                    <AlertCircle className="w-3 h-3" />
                    鉴权失败或 Worker 密码不匹配
                  </div>
                )}

                <button 
                  onClick={handleGenerate}
                  disabled={isGenerating || !prompt.trim()}
                  className="absolute bottom-5 right-5 bg-white text-black px-7 py-3.5 rounded-2xl font-bold flex items-center gap-3 transition-all active:scale-95 shadow-2xl hover:bg-indigo-500 hover:text-white disabled:opacity-20"
                >
                  {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Wand2 className="w-5 h-5" />}
                  {isGenerating ? '正在穿越加密网关...' : '生成图像'}
                </button>
              </div>

              {history.length > 0 && (
                <div className="pt-6 border-t border-white/5">
                  <div className="flex items-center gap-2 text-zinc-500 mb-5">
                      <History className="w-4 h-4" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">历史轨迹</span>
                  </div>
                  <div className="grid grid-cols-6 gap-3">
                    {history.map((item) => (
                      <button 
                        key={item.timestamp} 
                        onClick={() => {
                          setCurrentImage(item.url);
                          setHasError(false);
                        }}
                        className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                          currentImage === item.url ? 'border-indigo-500' : 'border-transparent opacity-40 hover:opacity-100'
                        }`}
                      >
                        <img src={item.url} alt="History" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="relative group animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="absolute -inset-4 bg-indigo-500/10 rounded-[48px] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative aspect-square glass-card rounded-[40px] border border-white/10 overflow-hidden flex items-center justify-center p-4">
              {currentImage ? (
                <div className="relative w-full h-full group/img">
                  <img 
                    src={currentImage} 
                    alt="Current Render" 
                    className="w-full h-full object-cover rounded-[32px] shadow-2xl transition-transform duration-700 group-hover/img:scale-105"
                  />
                  <a 
                    href={currentImage} 
                    target="_blank" 
                    className="absolute top-6 right-6 p-4 bg-black/50 backdrop-blur-md rounded-2xl text-white opacity-0 group-hover/img:opacity-100 transition-opacity border border-white/10"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </a>
                </div>
              ) : (
                <div className="text-center p-12">
                  <div className={`w-20 h-20 ${hasError ? 'bg-red-500/5' : 'bg-white/[0.03]'} rounded-3xl flex items-center justify-center mx-auto mb-6 border ${hasError ? 'border-red-500/20' : 'border-white/5'}`}>
                    {hasError ? <AlertCircle className="w-8 h-8 text-red-500/40" /> : <ImageIcon className="w-8 h-8 opacity-20" />}
                  </div>
                  <p className="text-zinc-600 text-xs tracking-widest uppercase font-bold leading-relaxed">
                    {hasError ? '鉴权异常：请检查 Worker 密码' : '加密节点待命'}
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