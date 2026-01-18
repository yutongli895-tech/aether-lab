
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
  Lock,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { GeneratedImage } from '../types.ts';

export const ImageGen: React.FC = () => {
  // 核心状态
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorType, setErrorType] = useState<'none' | 'limit' | 'auth' | 'network'>('none');
  const [history, setHistory] = useState<GeneratedImage[]>([]);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  
  // 访问暗号锁相关状态
  const [authCode, setAuthCode] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showAuthScreen, setShowAuthScreen] = useState(true);

  // 初始化检查本地存储的暗号
  useEffect(() => {
    try {
      const savedCode = localStorage.getItem('aether_auth_code');
      if (savedCode) {
        setAuthCode(savedCode);
        setIsUnlocked(true);
        setShowAuthScreen(false);
      }
    } catch (e) {
      console.warn("LocalStorage access failed - checking privacy settings.");
    }
  }, []);

  // 执行解锁
  const handleUnlock = () => {
    if (authCode.trim()) {
      try {
        localStorage.setItem('aether_auth_code', authCode);
      } catch (e) {}
      setIsUnlocked(true);
      setShowAuthScreen(false);
      setErrorType('none');
    }
  };

  // 重新锁定（用于用户手动锁定或鉴权失效）
  const handleRelock = () => {
    try {
      localStorage.removeItem('aether_auth_code');
    } catch (e) {}
    setIsUnlocked(false);
    setShowAuthScreen(true);
    setAuthCode('');
  };

  // 生成逻辑
  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating || !isUnlocked) return;

    setIsGenerating(true);
    setErrorType('none');
    
    try {
      const imageUrl = await generateAetherImage(prompt, authCode);
      
      // 预加载图片以检查状态
      const img = new Image();
      img.src = imageUrl;
      
      img.onload = () => {
        setCurrentImage(imageUrl);
        setHistory(prev => [{
          url: imageUrl,
          prompt: prompt,
          timestamp: Date.now()
        }, ...prev].slice(0, 6)); // 保留最近 6 个历史记录
        setIsGenerating(false);
      };

      img.onerror = async () => {
        // 如果图片加载失败，通过 fetch 获取具体的错误码
        try {
          const resp = await fetch(imageUrl);
          if (resp.status === 429) {
            setErrorType('limit');
          } else if (resp.status === 403) {
            setErrorType('auth');
            // 鉴权失效时，强制要求重新解锁
            setIsUnlocked(false);
            setShowAuthScreen(true);
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
      case 'auth': return '鉴权失效或暗号不匹配';
      case 'network': return '与边缘节点通信异常';
      default: return '';
    }
  };

  return (
    <section id="design" className="py-24 bg-[#030303] relative min-h-[800px] overflow-hidden">
      {/* 装饰性背景 */}
      <div className="blob bottom-0 left-0 opacity-10 animate-pulse" />
      <div className="blob top-0 right-0 opacity-5" style={{ animationDelay: '2s' }} />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          
          <div className="animate-fade-in relative">
            
            {/* 顶栏状态显示 - 完整保留 */}
            <div className="flex items-center justify-between mb-8">
              <div className="inline-flex items-center gap-2 text-indigo-400">
                <Globe className={`w-5 h-5 ${isGenerating ? 'animate-spin' : ''}`} />
                <span className="font-bold tracking-widest text-[10px] uppercase">Node: CF-Workers-Edge</span>
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
                    {errorType === 'limit' ? 'Rate Limited' : isUnlocked ? 'Secure Auth: Active' : 'Auth Locked'}
                  </span>
                </div>
              </div>
            </div>
            
            <h2 className="text-5xl md:text-6xl font-display font-bold mb-6 italic tracking-tight">Visual Engine.</h2>
            <p className="text-zinc-500 mb-10 text-lg leading-relaxed max-w-xl">
              您的视觉引擎节点已接入加密链路。请验证访问暗号以激活 Flux-1 边缘算力，所有生成的资产均受 WAF 防御保护。
            </p>

            <div className="relative">
              {/* 功能区域容器 */}
              <div className="space-y-8">
                <div className="relative group">
                  <textarea 
                    className={`w-full bg-zinc-900/40 border ${errorType !== 'none' ? 'border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.1)]' : 'border-white/10'} rounded-3xl p-7 text-sm min-h-[180px] focus:outline-none focus:border-indigo-500/50 transition-all placeholder:text-zinc-700 resize-none`}
                    placeholder="Describe your architectural vision in detail..."
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
                    className="absolute bottom-6 right-6 bg-white text-black px-8 py-4 rounded-2xl font-bold flex items-center gap-3 transition-all active:scale-95 shadow-2xl hover:bg-indigo-500 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed group/btn"
                  >
                    {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Wand2 className="w-5 h-5 group-hover/btn:rotate-12 transition-transform" />}
                    {isGenerating ? 'Rendering...' : '生成图像'}
                  </button>
                </div>

                {/* 历史记录部分 - 完整恢复 */}
                {history.length > 0 && isUnlocked && (
                  <div className="pt-8 border-t border-white/5 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-2 text-zinc-500">
                            <History className="w-4 h-4" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Node Asset History</span>
                        </div>
                        <span className="text-[9px] text-zinc-700 font-mono">6 SLOTS ACTIVE</span>
                    </div>
                    <div className="grid grid-cols-6 gap-3">
                      {history.map((item) => (
                        <button 
                          key={item.timestamp} 
                          onClick={() => {
                            setCurrentImage(item.url);
                            setErrorType('none');
                          }}
                          className={`aspect-square rounded-xl overflow-hidden border-2 transition-all hover:scale-105 active:scale-95 ${
                            currentImage === item.url ? 'border-indigo-500 shadow-lg shadow-indigo-500/20 ring-4 ring-indigo-500/10' : 'border-white/5 opacity-40 hover:opacity-100'
                          }`}
                        >
                          <img src={item.url} alt="History" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* 访问暗号锁屏覆盖层 - 极致视觉增强 */}
              {showAuthScreen && (
                <div className="absolute inset-[-12px] z-20 backdrop-blur-2xl bg-black/70 rounded-[40px] flex flex-col items-center justify-center p-8 border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.8)] animate-in fade-in zoom-in duration-500">
                   <div className="relative mb-8">
                      <div className="absolute -inset-4 bg-indigo-500/20 rounded-full blur-2xl animate-pulse" />
                      <div className="w-20 h-20 bg-white/5 rounded-[28px] flex items-center justify-center border border-white/10 relative">
                         <Lock className="w-10 h-10 text-indigo-400" />
                      </div>
                   </div>
                   
                   <h4 className="text-2xl font-display font-bold mb-3 tracking-tight">Access Code Required</h4>
                   <p className="text-zinc-500 text-sm mb-10 text-center max-w-[320px] leading-relaxed">
                     为了保护边缘算力资源，Visual Engine 已启用节点加密。请输入您的授权暗号。
                   </p>
                   
                   <div className="w-full max-w-sm flex flex-col gap-4">
                     <div className="relative group">
                        <input 
                          type="password"
                          value={authCode}
                          onChange={(e) => setAuthCode(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
                          placeholder="••••••••"
                          className="w-full bg-zinc-950/80 border border-white/10 rounded-2xl py-5 px-6 text-center tracking-[1em] font-mono text-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder:text-zinc-800 placeholder:tracking-normal"
                        />
                        {errorType === 'auth' && (
                          <div className="absolute -bottom-8 left-0 right-0 flex items-center justify-center gap-2 text-red-500 text-[10px] uppercase font-bold tracking-widest animate-shake">
                            <ShieldAlert className="w-3 h-3" /> Auth Verification Failed
                          </div>
                        )}
                     </div>
                     <button 
                       onClick={handleUnlock}
                       className="w-full bg-white text-black py-5 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-indigo-500 hover:text-white transition-all active:scale-[0.98] shadow-xl"
                     >
                       <Unlock className="w-5 h-5" /> 激活视觉引擎
                     </button>
                     <p className="text-center mt-4">
                        <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noreferrer" className="text-[10px] text-zinc-600 hover:text-zinc-400 transition-colors uppercase font-bold tracking-[0.2em] inline-flex items-center gap-1">
                          Billing Docs <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                     </p>
                   </div>
                </div>
              )}
            </div>
          </div>

          {/* 右侧：图片预览预览卡片 - 完整保留 */}
          <div className="relative group animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="absolute -inset-10 bg-indigo-500/5 rounded-[60px] blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            
            <div className="relative aspect-square glass rounded-[48px] border border-white/10 overflow-hidden flex items-center justify-center p-3 shadow-2xl">
              {currentImage ? (
                <div className="relative w-full h-full group/img overflow-hidden rounded-[38px]">
                  <img 
                    src={currentImage} 
                    alt="Neural Render" 
                    className="w-full h-full object-cover shadow-2xl transition-transform duration-[1.5s] ease-out group-hover/img:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/img:opacity-100 transition-all duration-500" />
                  
                  {/* 操作按钮 */}
                  <div className="absolute bottom-8 left-8 right-8 flex items-center justify-between translate-y-4 opacity-0 group-hover/img:translate-y-0 group-hover/img:opacity-100 transition-all duration-500">
                    <div className="glass-card px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider">
                        1024 x 1024 • Flux
                    </div>
                    <a 
                      href={currentImage} 
                      target="_blank" 
                      rel="noreferrer"
                      className="p-4 bg-white text-black rounded-2xl shadow-xl hover:bg-indigo-500 hover:text-white transition-all active:scale-90"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              ) : (
                <div className="text-center p-12 relative">
                  <div className={`w-24 h-24 ${errorType !== 'none' ? 'bg-red-500/5' : 'bg-white/[0.03]'} rounded-[32px] flex items-center justify-center mx-auto mb-8 border ${errorType !== 'none' ? 'border-red-500/20' : 'border-white/5'} transition-colors`}>
                    {errorType !== 'none' ? (
                      <AlertCircle className="w-10 h-10 text-red-500/40 animate-pulse" />
                    ) : (
                      <ImageIcon className="w-10 h-10 opacity-20 group-hover:scale-110 transition-transform duration-500" />
                    )}
                  </div>
                  <h5 className="text-sm font-bold uppercase tracking-[0.3em] text-zinc-500 mb-2">Neural Link Ready</h5>
                  <p className="text-[10px] text-zinc-700 font-medium">WAITING FOR GENERATIVE PARAMETERS</p>
                </div>
              )}
            </div>

            {/* 装饰性的小标签 */}
            <div className="absolute -top-6 -right-6 glass-card px-6 py-3 rounded-2xl border border-white/10 shadow-xl hidden md:block animate-bounce-slow">
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Real-time Node</span>
                </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
