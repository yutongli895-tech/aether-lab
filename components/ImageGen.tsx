
import React, { useState, useEffect } from 'react';
import { generateAetherImage } from '../services/geminiService.ts';
import { 
  ImageIcon, 
  Wand2, 
  Loader2, 
  History, 
  ExternalLink, 
  Globe, 
  AlertCircle, 
  ShieldCheck, 
  Clock, 
  Key,
  Unlock,
  Lock
} from 'lucide-react';
import { GeneratedImage } from '../types.ts';

export const ImageGen: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorType, setErrorType] = useState<'none' | 'limit' | 'auth' | 'network'>('none');
  const [history, setHistory] = useState<GeneratedImage[]>([]);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  
  // 访问暗号相关状态
  const [authCode, setAuthCode] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showAuthScreen, setShowAuthScreen] = useState(true);

  // 初始化检查本地存储的暗号
  useEffect(() => {
    const savedCode = localStorage.getItem('aether_auth_code');
    if (savedCode) {
      setAuthCode(savedCode);
      setIsUnlocked(true);
      setShowAuthScreen(false);
    }
  }, []);

  const handleUnlock = () => {
    if (authCode.trim()) {
      localStorage.setItem('aether_auth_code', authCode);
      setIsUnlocked(true);
      setShowAuthScreen(false);
      setErrorType('none');
    }
  };

  const handleRelock = () => {
    localStorage.removeItem('aether_auth_code');
    setIsUnlocked(false);
    setShowAuthScreen(true);
    setAuthCode('');
  };

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating || !isUnlocked) return;

    setIsGenerating(true);
    setErrorType('none');
    
    try {
      const imageUrl = await generateAetherImage(prompt, authCode);
      
      // 检查图片加载状态
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

      img.onerror = async () => {
        try {
          const resp = await fetch(imageUrl);
          if (resp.status === 429) {
            setErrorType('limit');
          } else if (resp.status === 403) {
            setErrorType('auth');
            setIsUnlocked(false);
            setShowAuthScreen(true); // 鉴权失败重回锁屏
          } else {
            setErrorType('network');
          }
        } catch (e) {
          setErrorType('network');
        }
        setIsGenerating(false);
      };
    } catch (err) {
      setErrorType('network');
      setIsGenerating(false);
    }
  };

  const getErrorMessage = () => {
    switch(errorType) {
      case 'limit': return '触达边缘节点速率限制 (10 RPM)';
      case 'auth': return '暗号失效或校验失败';
      case 'network': return '与边缘节点通信超时';
      default: return '';
    }
  };

  return (
    <section id="design" className="py-24 bg-[#030303] relative">
      <div className="blob bottom-0 left-0 opacity-10" />
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="animate-fade-in relative">
            
            {/* 顶栏状态显示 */}
            <div className="flex items-center justify-between mb-8">
              <div className="inline-flex items-center gap-2 text-indigo-400">
                <Globe className="w-5 h-5" />
                <span className="font-bold tracking-widest text-[10px] uppercase">Node: Cloudflare-Edge</span>
              </div>
              <div className="flex items-center gap-3">
                {isUnlocked && (
                  <button 
                    onClick={handleRelock}
                    className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] font-bold uppercase text-zinc-500 hover:text-white transition-colors"
                  >
                    <Lock className="w-3 h-3" /> Relock Node
                  </button>
                )}
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${errorType === 'limit' ? 'bg-amber-500/10 border-amber-500/20' : isUnlocked ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
                  {errorType === 'limit' ? <Clock className="w-3.5 h-3.5 text-amber-500" /> : isUnlocked ? <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> : <Key className="w-3.5 h-3.5 text-red-500" />}
                  <span className={`text-[9px] font-bold uppercase ${errorType === 'limit' ? 'text-amber-500' : isUnlocked ? 'text-emerald-500' : 'text-red-500'}`}>
                    {errorType === 'limit' ? 'Rate Limited' : isUnlocked ? 'Auth: Verified' : 'Locked'}
                  </span>
                </div>
              </div>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 italic tracking-tight">Visual Engine.</h2>
            <p className="text-zinc-500 mb-10 text-lg leading-relaxed">
              您的视觉引擎节点已接入加密链路。所有生成的资产均受密码验证保护，确保只有授权请求能触达边缘算力。
            </p>

            <div className="relative">
              {/* 功能区域 */}
              <div className="space-y-8">
                <div className="relative group">
                  <textarea 
                    className={`w-full bg-zinc-900/40 border ${errorType !== 'none' ? 'border-red-500/50' : 'border-white/10'} rounded-3xl p-7 text-sm min-h-[160px] focus:outline-none focus:border-indigo-500/50 transition-all placeholder:text-zinc-700`}
                    placeholder="输入您的设计指令..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                  />
                  
                  {errorType !== 'none' && (
                    <div className="absolute top-4 right-4 flex items-center gap-2 text-red-400 text-[10px] font-bold uppercase animate-pulse">
                      <AlertCircle className="w-3 h-3" />
                      {getErrorMessage()}
                    </div>
                  )}

                  <button 
                    onClick={handleGenerate}
                    disabled={isGenerating || !prompt.trim() || errorType === 'limit' || !isUnlocked}
                    className="absolute bottom-5 right-5 bg-white text-black px-7 py-3.5 rounded-2xl font-bold flex items-center gap-3 transition-all active:scale-95 shadow-2xl hover:bg-indigo-500 hover:text-white disabled:opacity-20"
                  >
                    {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Wand2 className="w-5 h-5" />}
                    {isGenerating ? '渲染中...' : '生成图像'}
                  </button>
                </div>

                {history.length > 0 && isUnlocked && (
                  <div className="pt-6 border-t border-white/5 animate-fade-in">
                    <div className="flex items-center gap-2 text-zinc-500 mb-5">
                        <History className="w-4 h-4" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">最近生成的节点资产</span>
                    </div>
                    <div className="grid grid-cols-6 gap-3">
                      {history.map((item) => (
                        <button 
                          key={item.timestamp} 
                          onClick={() => {
                            setCurrentImage(item.url);
                            setErrorType('none');
                          }}
                          className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                            currentImage === item.url ? 'border-indigo-500 shadow-lg shadow-indigo-500/20' : 'border-transparent opacity-40 hover:opacity-100'
                          }`}
                        >
                          <img src={item.url} alt="History" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* 访问暗号锁屏覆盖层 */}
              {showAuthScreen && (
                <div className="absolute inset-[-8px] z-20 backdrop-blur-xl bg-black/60 rounded-[36px] flex flex-col items-center justify-center p-8 border border-white/10 shadow-2xl animate-in fade-in zoom-in duration-300">
                   <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6 border border-white/10 group">
                      <Lock className="w-8 h-8 text-zinc-400 group-hover:text-indigo-400 transition-colors" />
                   </div>
                   <h4 className="text-xl font-display font-bold mb-2">Access Code Required</h4>
                   <p className="text-zinc-500 text-sm mb-8 text-center max-w-[280px]">
                     请输入 Aether 访问暗号以激活边缘视觉生成引擎。
                   </p>
                   
                   <div className="w-full max-w-xs flex flex-col gap-3">
                     <div className="relative">
                        <input 
                          type="password"
                          value={authCode}
                          onChange={(e) => setAuthCode(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
                          placeholder="SECURE_AUTH_KEY"
                          className="w-full bg-zinc-950 border border-white/10 rounded-xl py-4 px-5 text-center tracking-[0.3em] font-mono text-white focus:border-indigo-500 focus:outline-none transition-all placeholder:text-zinc-800"
                        />
                        {errorType === 'auth' && (
                          <p className="text-red-500 text-[10px] mt-2 text-center uppercase font-bold tracking-widest animate-pulse">
                            Authentication Failed
                          </p>
                        )}
                     </div>
                     <button 
                       onClick={handleUnlock}
                       className="w-full bg-white text-black py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-500 hover:text-white transition-all active:scale-95"
                     >
                       <Unlock className="w-4 h-4" /> 激活引擎
                     </button>
                   </div>
                   
                   <p className="mt-8 text-[9px] text-zinc-600 uppercase tracking-widest font-bold">
                     Encrypted Node Connection
                   </p>
                </div>
              )}
            </div>
          </div>

          {/* 图片预览区域 */}
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity rounded-[32px]" />
                  <a 
                    href={currentImage} 
                    target="_blank" 
                    rel="noreferrer"
                    className="absolute top-6 right-6 p-4 bg-black/50 backdrop-blur-md rounded-2xl text-white opacity-0 group-hover/img:opacity-100 transition-all border border-white/10"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </a>
                </div>
              ) : (
                <div className="text-center p-12">
                  <div className={`w-20 h-20 ${errorType !== 'none' ? 'bg-red-500/5' : 'bg-white/[0.03]'} rounded-3xl flex items-center justify-center mx-auto mb-6 border ${errorType !== 'none' ? 'border-red-500/20' : 'border-white/5'}`}>
                    {errorType !== 'none' ? <AlertCircle className="w-8 h-8 text-red-500/40" /> : <ImageIcon className="w-8 h-8 opacity-20" />}
                  </div>
                  <p className="text-zinc-600 text-xs tracking-widest uppercase font-bold leading-relaxed">
                    {errorType === 'limit' ? '触发速率限制' : !isUnlocked ? '鉴权拦截' : '渲染器已就绪'}
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
