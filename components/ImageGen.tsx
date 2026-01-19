
import React, { useState } from 'react';
import { generateAetherImage } from '../services/geminiService.ts';
import { 
  Wand2, Loader2, History, Globe, 
  Settings, Lock, Maximize2, ShieldAlert, RefreshCw, 
  Download, ChevronDown, ImageIcon, Monitor, Sliders, Dices, ShieldCheck, Key,
  Clock
} from 'lucide-react';
import { GeneratedImage } from '../types.ts';

const MODELS = [
  { id: 'flux-1-schnell', name: 'FLUX.1 [schnell] - 高性能边缘节点' },
  { id: 'stable-diffusion-xl-base-1.0', name: 'SDXL Base 1.0 - 工业级模型' },
  { id: 'dreamshaper-8-lcm', name: 'DreamShaper 8 LCM - 真实感优化' },
  { id: 'stable-diffusion-xl-lightning', name: 'SDXL Lightning - 超高速渲染' }
];

export const ImageGen: React.FC = () => {
  const [isVerified, setIsVerified] = useState(false);
  const [password, setPassword] = useState('');
  const [prompt, setPrompt] = useState('cyberpunk cat');
  const [negPrompt, setNegPrompt] = useState('');
  const [model, setModel] = useState(MODELS[0].id);
  const [width, setWidth] = useState(1024);
  const [height, setHeight] = useState(1024);
  const [steps, setSteps] = useState(20);
  const [guidance, setGuidance] = useState(7.5);
  const [seed, setSeed] = useState<string>('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<'none' | 'auth' | 'limit' | 'network'>('none');
  const [history, setHistory] = useState<GeneratedImage[]>([]);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [genTime, setGenTime] = useState<string>('-');

  const handleVerify = () => {
    // 对应 worker.js 里的 PASSWORDS = ['P@ssw0rd']
    if (password === 'P@ssw0rd') {
      setIsVerified(true);
      setError('none');
    } else {
      setError('auth');
      const el = document.getElementById('pass-input');
      el?.classList.add('animate-shake');
      setTimeout(() => el?.classList.remove('animate-shake'), 400);
    }
  };

  const handleRandomPrompt = () => {
    const prompts = [
      'cyberpunk cat samurai graphic art, blood splattered, beautiful colors',
      'minimalist villa on Mars, dusty red horizon, architectural photography',
      'cyberpunk cityscape with glowing holographic koi fish swimming in air',
      'biophilic design futuristic library inside a giant luminous tree'
    ];
    setPrompt(prompts[Math.floor(Math.random() * prompts.length)]);
  };

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;
    setIsGenerating(true);
    setError('none');
    const startTime = Date.now();

    try {
      const finalSeed = seed === '' ? undefined : parseInt(seed);
      const imageUrl = await generateAetherImage({
        prompt,
        negative_prompt: negPrompt,
        model,
        password, 
        width,
        height,
        steps,
        guidance,
        seed: finalSeed
      });

      // 通过创建 Image 对象来预加载
      const img = new Image();
      img.src = imageUrl;
      img.onload = () => {
        setCurrentImage(imageUrl);
        setGenTime(((Date.now() - startTime) / 1000).toFixed(1) + 's');
        setHistory(prev => [{ url: imageUrl, prompt, timestamp: Date.now() }, ...prev].slice(0, 6));
        setIsGenerating(false);
      };
      img.onerror = async () => {
        // 尝试获取具体错误原因
        try {
          const resp = await fetch(imageUrl);
          if (resp.status === 403) setError('auth');
          else if (resp.status === 429) setError('limit');
          else setError('network');
        } catch {
          setError('network');
        }
        setIsGenerating(false);
      };
    } catch (e) {
      setError('network');
      setIsGenerating(false);
    }
  };

  if (!isVerified) {
    return (
      <section id="design" className="py-12 md:py-24 bg-[#030303] flex items-center justify-center min-h-[500px]">
        <div className="max-w-md w-full mx-4 glass rounded-[32px] p-8 md:p-12 border-white/5 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 opacity-30" />
          <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-indigo-500/20">
            <Key className="w-8 h-8 text-indigo-400" />
          </div>
          <h2 className="text-xl md:text-2xl font-display font-bold mb-3">神经网络协议</h2>
          <p className="text-zinc-500 text-[10px] md:text-xs mb-8 uppercase tracking-widest font-bold">
            请输入访问密码（邀请码）初始化视觉实验室
          </p>
          <div className="space-y-4">
            <div id="pass-input" className="relative group">
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
                placeholder="密码..."
                className="w-full bg-zinc-950 border border-white/10 rounded-2xl px-4 py-4 text-center text-sm focus:border-indigo-500/50 outline-none transition-all group-hover:border-white/20"
              />
            </div>
            {error === 'auth' && <p className="text-red-500 text-[9px] font-bold uppercase tracking-widest">凭证验证失败</p>}
            <button 
              onClick={handleVerify}
              className="w-full py-4 bg-white text-black rounded-2xl font-bold hover:bg-indigo-600 hover:text-white transition-all active:scale-95 shadow-lg shadow-white/5"
            >
              解锁实验室
            </button>
          </div>
          <div className="mt-8 flex items-center justify-center gap-2 text-[8px] text-zinc-600 font-bold uppercase tracking-tighter">
            <ShieldCheck className="w-3 h-3" /> Encrypted Endpoint Ready
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="design" className="py-12 md:py-24 bg-[#030303] relative min-h-screen">
      <div className="container mx-auto px-4 md:px-6">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h2 className="text-2xl md:text-4xl font-display font-bold italic tracking-tight">Visual Lab.</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">Node: odd-credit-b262 (Verified)</p>
            </div>
          </div>
          <button onClick={() => setIsVerified(false)} className="self-start md:self-auto px-4 py-2 bg-white/5 rounded-xl border border-white/10 text-[9px] font-bold uppercase tracking-widest text-zinc-500 hover:text-red-400 hover:bg-red-400/10 transition-all flex items-center gap-2">
            <Lock className="w-3 h-3" /> 锁定会话
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <div className="lg:col-span-5 space-y-6 order-2 lg:order-1">
            <div className="bg-[#09090b] border border-white/5 rounded-[24px] md:rounded-[32px] p-6 md:p-8 shadow-2xl">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <Sliders className="w-4 h-4 text-indigo-400" />
                  <h3 className="text-sm md:text-lg font-bold">渲染架构</h3>
                </div>
                <button onClick={handleRandomPrompt} className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-[8px] font-bold uppercase tracking-widest flex items-center gap-1.5 border border-white/5">
                  <Dices className="w-3 h-3" /> 随机词库
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-[9px] font-bold uppercase text-zinc-500 mb-2 block tracking-widest">Positive Prompt</label>
                  <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-4 text-xs h-28 focus:border-indigo-500/40 outline-none resize-none" />
                </div>

                <div>
                  <label className="text-[9px] font-bold uppercase text-zinc-500 mb-2 block tracking-widest">视觉架构模型</label>
                  <div className="relative group">
                    <select value={model} onChange={(e) => setModel(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-4 text-xs appearance-none focus:border-indigo-500/40 outline-none">
                      {MODELS.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 pointer-events-none group-hover:text-indigo-400" />
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5">
                  <button onClick={() => setShowAdvanced(!showAdvanced)} className="w-full flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2"><Settings className="w-3.5 h-3.5 text-zinc-500" /><span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">高级节点配置</span></div>
                    <span className="text-[9px] text-zinc-700">{showAdvanced ? '收起' : '展开'}</span>
                  </button>

                  {showAdvanced && (
                    <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-[8px] font-bold text-zinc-600 uppercase mb-2 block">Width ({width})</label>
                          <input type="range" min="256" max="1024" step="64" value={width} onChange={(e)=>setWidth(Number(e.target.value))} className="w-full" />
                        </div>
                        <div>
                          <label className="text-[8px] font-bold text-zinc-600 uppercase mb-2 block">Height ({height})</label>
                          <input type="range" min="256" max="1024" step="64" value={height} onChange={(e)=>setHeight(Number(e.target.value))} className="w-full" />
                        </div>
                      </div>
                      <div>
                        <label className="text-[8px] font-bold text-zinc-600 uppercase mb-2 block">Steps ({steps})</label>
                        <input type="range" min="1" max="50" value={steps} onChange={(e)=>setSteps(Number(e.target.value))} className="w-full" />
                      </div>
                      <div>
                        <label className="text-[8px] font-bold text-zinc-600 uppercase mb-2 block">Seed (Optional)</label>
                        <div className="flex gap-2">
                          <input type="number" value={seed} onChange={(e) => setSeed(e.target.value)} placeholder="随机值" className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-xs outline-none focus:border-indigo-500/40" />
                          <button onClick={() => setSeed(Math.floor(Math.random()*999999).toString())} className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors"><RefreshCw className="w-3.5 h-3.5 text-zinc-500" /></button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <button onClick={handleGenerate} disabled={isGenerating} className="w-full mt-10 py-5 bg-indigo-600 text-white rounded-[20px] font-bold flex items-center justify-center gap-3 hover:bg-indigo-500 transition-all active:scale-[0.98] disabled:opacity-40">
                {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Wand2 className="w-5 h-5" />}
                {isGenerating ? '重构像素中...' : '启动渲染'}
              </button>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6 order-1 lg:order-2">
            <div className="bg-[#09090b] border border-white/5 rounded-[24px] md:rounded-[40px] p-2 flex flex-col shadow-2xl">
              <div className="p-6 md:p-8 flex items-center justify-between border-b border-white/5">
                <div className="flex items-center gap-3">
                  <Monitor className="w-5 h-5 text-zinc-500" />
                  <span className="font-display font-bold text-xs md:text-lg tracking-tight uppercase">主监视器</span>
                </div>
                {error !== 'none' && (
                  <div className="px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-[9px] font-bold uppercase flex items-center gap-2">
                    <ShieldAlert className="w-3 h-3" /> {error === 'limit' ? '边缘节点受限' : '连接超时'}
                  </div>
                )}
              </div>

              <div className="aspect-square m-4 md:m-6 rounded-[20px] md:rounded-[32px] bg-black border border-white/5 flex flex-col items-center justify-center relative overflow-hidden group">
                {currentImage ? (
                  <div className="w-full h-full relative">
                    <img src={currentImage} className="w-full h-full object-contain" alt="Aether Render" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                      <a href={currentImage} target="_blank" className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center hover:scale-110 transition-transform"><Maximize2 className="w-5 h-5" /></a>
                      <a href={currentImage} download className="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform"><Download className="w-5 h-5" /></a>
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-8">
                    <div className="w-16 h-16 bg-white/[0.03] rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/5"><ImageIcon className="w-8 h-8 text-zinc-800" /></div>
                    <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-[0.2em]">等待指令启动</p>
                  </div>
                )}
                {isGenerating && (
                  <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center z-10">
                    <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
                    <p className="mt-6 text-[10px] font-bold tracking-widest text-white/50 animate-pulse uppercase">计算渲染路径...</p>
                  </div>
                )}
              </div>

              <div className="p-6 md:p-8 flex justify-between items-center border-t border-white/5">
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-zinc-600" />
                  <div><p className="text-[8px] font-bold uppercase text-zinc-600">耗时</p><p className="text-xs font-mono text-zinc-400">{genTime}</p></div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right hidden sm:block"><p className="text-[8px] font-bold uppercase text-zinc-600">节点状态</p><p className="text-xs font-mono text-zinc-400">ACTIVE</p></div>
                  <Globe className="w-4 h-4 text-emerald-500/50" />
                </div>
              </div>
            </div>

            {history.length > 0 && (
              <div className="bg-[#09090b] border border-white/5 rounded-[24px] p-6">
                <div className="flex items-center gap-2 mb-4 text-zinc-600"><History className="w-3 h-3" /><span className="text-[9px] font-bold uppercase tracking-widest">历史缓冲</span></div>
                <div className="grid grid-cols-6 gap-2">
                  {history.map((h, i) => (
                    <button key={i} onClick={() => setCurrentImage(h.url)} className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${currentImage === h.url ? 'border-indigo-500' : 'border-transparent opacity-40 hover:opacity-100'}`}>
                      <img src={h.url} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};
