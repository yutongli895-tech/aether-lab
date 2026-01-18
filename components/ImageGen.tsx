
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
  // 核心状态管理
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorType, setErrorType] = useState<'none' | 'limit' | 'auth' | 'network'>('none');
  const [history, setHistory] = useState<GeneratedImage[]>([]);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  
  // 访问暗号锁相关状态
  const [authCode, setAuthCode] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showAuthScreen, setShowAuthScreen] = useState(true);

  // 初始化：检查本地存储的暗号
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

  // 执行解锁逻辑
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

  // 手动重新锁定
  const handleRelock = () => {
    try {
      localStorage.removeItem('aether_auth_code');
    } catch (e) {}
    setIsUnlocked(false);
    setShowAuthScreen(true);
    setAuthCode('');
  };

  // 核心图像生成逻辑
  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating || !isUnlocked) return;

    setIsGenerating(true);
    setErrorType('none');
    
    try {
      const imageUrl = await generateAetherImage(prompt, authCode);
      
      // 使用 Image 对象预加载图片，确保加载成功后再展示
      const img = new Image();
      img.src = imageUrl;
      
      img.onload = () => {
        setCurrentImage(imageUrl);
        setHistory(prev => [{
          url: imageUrl,
          prompt: prompt,
          timestamp: Date.now()
        }, ...prev].slice(0, 6)); // 仅保留最近 6 条
        setIsGenerating(false);
      };

      img.onerror = async () => {
        // 如果图片渲染失败，通过 fetch 获取具体的 HTTP 错误状态
        try {
          const resp = await fetch(imageUrl);
          if (resp.status === 429) {
            setErrorType('limit');
          } else if (resp.status === 403) {
            setErrorType('auth');
            // 暗号失效，强制弹出锁屏
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
      case 'limit': return '已达边缘节点速率限制 (10 RPM)';
      case 'auth': return '鉴权失效或访问暗号错误';
      case 'network': return '节点通信波动，请重试';
      default: return '';
    }
  };

  return (
    <section id="design" className="py-24 bg-[#030303] relative min-h-[900px] overflow-hidden">
      {/* 动态背景装饰 */}
      <div className="blob bottom-0 left-0 opacity-10 animate-pulse" />
      <div className="blob top-0 right-0 opacity-5" style={{ animationDelay: '2s' }} />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          
          <div className="animate-fade-in relative">
            
            {/* 顶栏状态指示 */}
            <div className="flex items-center justify-between mb-8">
              <div className="inline-flex items-center gap-2 text-indigo-400">
                <Globe className={`w-5 h-5 ${isGenerating ? 'animate-spin' : ''}`} />
                <span className="font-bold tracking-widest text-[10px] uppercase">Node: Flux-Edge-S1</span>
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
                    {errorType === 'limit' ? 'Rate Limited' : isUnlocked ? 'AES-256 Auth Active' : 'Access Locked'}
                  </span>
                </div>
              </div>
            </div>
            
            <h2 className="text-5xl md:text-7xl font-display font-bold mb-6 italic tracking-tight">Visual Engine.</h2>
            <p className="text-zinc-500 mb-10 text-lg leading-relaxed max-w-xl">
              视觉引擎节点已接入 Flux-1 神经核。验证暗号以解锁边缘算力，所有渲染请求均受 Cloudflare WAF 级防护。
            </p>

            <div className="relative">
              {/* 主操作区 */}
              <div className="space-y-8">
                <div className="relative group">
                  <textarea 
                    className={`w-full bg-zinc-900/40 border ${errorType !== 'none' ? 'border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.1)]' : 'border-white/10'} rounded-[32px] p-8 text-sm min-h-[200px] focus:outline-none focus:border-indigo-500/50 transition-all placeholder:text-zinc-700 resize-none`}
                    placeholder="输入详细的设计构思，例如：极简主义未来派建筑，大理石质感，夕阳余晖..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                  />
                  
                  {errorType !== 'none' && (
                    <div className="absolute top-6 right-6 flex items-center gap-2 text-red-400 text-[10px] font-bold uppercase animate-pulse">
                      <AlertCircle className="w-3.5 h-3.5" />
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

                {/* 历史记录槽位 */}
                {history.length > 0 && isUnlocked && (
                  <div className="pt-8 border-t border-white/5 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2 text-zinc-500">
                            <History className="w-4 h-4" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Neural Asset Slots</span>
                        </div>
                        <span className="text-[9px] text-zinc-700 font-mono tracking-tighter">MAX CAPACITY: 06</span>
                    </div>
                    <div className="grid grid-cols-6 gap-3">
                      {history.map((item) => (
                        <button 
                          key={item.timestamp} 
                          onClick={() => {
                            setCurrentImage(item.url);
                            setErrorType('none');
                          }}
                          className={`aspect-square rounded-2xl overflow-hidden border-2 transition-all hover:scale-105 active:scale-95 ${
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

              {/* 锁屏界面覆盖层 */}
              {showAuthScreen && (
                <div className="absolute inset-[-16px] z-20 backdrop-blur-3xl bg-black/75 rounded-[48px] flex flex-col items-center justify-center p-10 border border-white/10 shadow-[0_0_120px_rgba(0,0,0,1)] animate-in fade-in zoom-in duration-500">
                   <div className="relative mb-10">
                      <div className="absolute -inset-6 bg-indigo-500/30 rounded-full blur-3xl animate-pulse" />
                      <div className="w-24 h-24 bg-zinc-900 rounded-[32px] flex items-center justify-center border border-white/10 relative shadow-inner">
                         <Lock className="w-12 h-12 text-indigo-400" />
                      </div>
                   </div>
                   
                   <h4 className="text-3xl font-display font-bold mb-4 tracking-tight">Access Locked</h4>
                   <p className="text-zinc-500 text-sm mb-12 text-center max-w-[340px] leading-relaxed">
                     为了平衡边缘算力资源并抵御自动化攻击，Visual Engine 已启用节点加密。请输入授权暗号进行验证。
                   </p>
                   
                   <div className="w-full max-w-sm flex flex-col gap-5">
                     <div className="relative group">
                        <input 
                          type="password"
                          value={authCode}
                          onChange={(e) => setAuthCode(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
                          placeholder="ENTER_AUTH_KEY"
                          className="w-full bg-zinc-950 border border-white/10 rounded-[20px] py-6 px-6 text-center tracking-[1.2em] font-mono text-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder:text-zinc-800 placeholder:tracking-normal"
                        />
                        {errorType === 'auth' && (
                          <div className="absolute -bottom-8 left-0 right-0 flex items-center justify-center gap-2 text-red-500 text-[10px] uppercase font-bold tracking-widest animate-shake">
                            <ShieldAlert className="w-3.5 h-3.5" /> Verification Check Failed
                          </div>
                        )}
                     </div>
                     <button 
                       onClick={handleUnlock}
                       className="w-full bg-white text-black py-6 rounded-[20px] font-bold flex items-center justify-center gap-3 hover:bg-indigo-500 hover:text-white transition-all active:scale-[0.98] shadow-2xl"
                     >
                       <Unlock className="w-5 h-5" /> 激活视觉节点
                     </button>
                     <div className="flex justify-center mt-6">
                        <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/5">
                            <ShieldCheck className="w-3 h-3 text-zinc-500" />
                            <span className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest">WAF Shield Active</span>
                        </div>
                     </div>
                   </div>
                </div>
              )}
            </div>
          </div>

          {/* 右侧：实时渲染卡片 */}
          <div className="relative group animate-fade-in" style={{ animationDelay: '0.4s' }}>
            {/* 辉光装饰 */}
            <div className="absolute -inset-16 bg-indigo-500/5 rounded-full blur-[120px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            
            <div className="relative aspect-square glass rounded-[56px] border border-white/10 overflow-hidden flex items-center justify-center p-4 shadow-[0_40px_100px_rgba(0,0,0,0.5)]">
              {currentImage ? (
                <div className="relative w-full h-full group/img overflow-hidden rounded-[42px]">
                  <img 
                    src={currentImage} 
                    alt="Current Render" 
                    className="w-full h-full object-cover shadow-2xl transition-transform duration-[2s] ease-out group-hover/img:scale-110"
                  />
                  {/* 图片底部覆盖层 */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover/img:opacity-100 transition-all duration-500" />
                  
                  <div className="absolute bottom-10 left-10 right-10 flex items-center justify-between translate-y-6 opacity-0 group-hover/img:translate-y-0 group-hover/img:opacity-100 transition-all duration-700">
                    <div className="glass-card px-6 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] border border-white/10">
                        Flux-1 Schnell • 1024px
                    </div>
                    <a 
                      href={currentImage} 
                      target="_blank" 
                      rel="noreferrer"
                      className="p-5 bg-white text-black rounded-[24px] shadow-2xl hover:bg-indigo-500 hover:text-white transition-all active:scale-90"
                    >
                      <ExternalLink className="w-6 h-6" />
                    </a>
                  </div>
                </div>
              ) : (
                <div className="text-center p-16 relative">
                  <div className={`w-28 h-28 ${errorType !== 'none' ? 'bg-red-500/5' : 'bg-white/[0.03]'} rounded-[40px] flex items-center justify-center mx-auto mb-10 border ${errorType !== 'none' ? 'border-red-500/20' : 'border-white/5'} transition-all group-hover:scale-105 duration-500`}>
                    {errorType !== 'none' ? (
                      <AlertCircle className="w-12 h-12 text-red-500/40 animate-pulse" />
                    ) : (
                      <ImageIcon className="w-12 h-12 opacity-10 group-hover:opacity-30 transition-opacity" />
                    )}
                  </div>
                  <h5 className="text-base font-bold uppercase tracking-[0.4em] text-zinc-600 mb-3">Neural Standby</h5>
                  <p className="text-[10px] text-zinc-800 font-bold uppercase tracking-widest">Node Is Waiting For Data Input</p>
                </div>
              )}
            </div>

            {/* 悬浮标签 */}
            <div className="absolute -top-8 -right-8 glass-card px-8 py-4 rounded-[24px] border border-white/10 shadow-2xl hidden md:block animate-bounce-slow">
                <div className="flex items-center gap-4">
                    <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-ping" />
                    <span className="text-[11px] font-bold uppercase tracking-widest text-indigo-100">Live Render Node</span>
                </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
