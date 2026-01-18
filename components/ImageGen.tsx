
import React, { useState } from 'react';
import { generateAetherImage } from '../services/geminiService.ts';
import { 
  Wand2, Loader2, History, Globe, 
  Settings, Lock, Unlock, Maximize2, ShieldAlert, RefreshCw, 
  Download, ChevronDown, ChevronUp, Layers, Clock, 
  ImageIcon, Monitor, Sliders, Dices, ShieldCheck, Key
} from 'lucide-react';
import { GeneratedImage } from '../types.ts';

const MODELS = [
  { id: 'flux-1-schnell', name: 'FLUX.1 [schnell] - 高性能边缘节点' },
  { id: 'stable-diffusion-xl-base-1.0', name: 'SDXL Base 1.0 - 工业级模型' },
  { id: 'dreamshaper-8-lcm', name: 'DreamShaper 8 LCM - 真实感优化' },
  { id: 'stable-diffusion-xl-lightning', name: 'SDXL Lightning - 超高速渲染' }
];

export const ImageGen: React.FC = () => {
  // 核心状态
  const [isVerified, setIsVerified] = useState(false);
  const [password, setPassword] = useState('');
  
  // 生成参数
  const [prompt, setPrompt] = useState('cyberpunk cat');
  const [negPrompt, setNegPrompt] = useState('');
  const [model, setModel] = useState(MODELS[0].id);
  const [width, setWidth] = useState(1024);
  const [height, setHeight] = useState(1024);
  const [steps, setSteps] = useState(20);
  const [guidance, setGuidance] = useState(7.5);
  const [seed, setSeed] = useState<string>('');
  const [showAdvanced, setShowAdvanced] = useState(true);
  
  // 运行状态
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<'none' | 'auth' | 'limit' | 'network'>('none');
  const [history, setHistory] = useState<GeneratedImage[]>([]);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [genTime, setGenTime] = useState<string>('-');

  // 验证逻辑
  const handleVerify = () => {
    // 匹配 worker.js 中的 PASSWORDS 逻辑
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
      'architectural photography of a minimalist villa on Mars, dusty red horizon',
      'cyberpunk cityscape with glowing holographic koi fish swimming in air',
      'organic architecture, biophilic design, futuristic library inside a tree',
      'close-up portrait of an android monk, golden circuitry, peaceful expression'
    ];
    setPrompt(prompts[Math.floor(Math.random() * prompts.length)]);
  };

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;
    setIsGenerating(true);
    setError('none');
    const startTime = Date.now();

    try {
      const finalSeed = seed === '' ? Math.floor(Math.random() * 9999999) : parseInt(seed);
      const imageUrl = await generateAetherImage({
        prompt,
        negative_prompt: negPrompt,
        model,
        password, // 使用已验证的密码
        width,
        height,
        steps: model === 'flux-1-schnell' ? Math.min(steps, 8) : steps,
        guidance,
        seed: finalSeed
      });

      const img = new Image();
      img.src = imageUrl;
      img.onload = () => {
        setCurrentImage(imageUrl);
        setGenTime(((Date.now() - startTime) / 1000).toFixed(1) + 's');
        setHistory(prev => [{ url: imageUrl, prompt, timestamp: Date.now() }, ...prev].slice(0, 6));
        setIsGenerating(false);
      };
      img.onerror = async () => {
        const resp = await fetch(imageUrl);
        if (resp.status === 403) setError('auth');
        else if (resp.status === 429) setError('limit');
        else setError('network');
        setIsGenerating(false);
      };
    } catch (e) {
      setError('network');
      setIsGenerating(false);
    }
  };

  // --- 登录/验证界面 ---
  if (!isVerified) {
    return (
      <section id="design" className="py-24 bg-[#030303] relative min-h-[600px] flex items-center justify-center">
        <div className="blob top-1/4 left-1/4 opacity-10" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-md mx-auto glass rounded-[40px] p-12 border-white/5 shadow-2xl text-center">
            <div className="w-20 h-20 bg-indigo-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-indigo-500/20">
              <Key className="w-10 h-10 text-indigo-400" />
            </div>
            <h2 className="text-2xl font-display font-bold mb-4 tracking-tight">Neural Protocol</h2>
            <p className="text-zinc-500 text-sm mb-10 leading-relaxed uppercase tracking-widest font-medium">
              请输入您的神经节点访问密码（邀请码）以初始化视觉实验室。
            </p>
            
            <div className="space-y-4">
              <div id="pass-input" className="relative">
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
                  placeholder="Password..."
                  className="w-full bg-black border border-white/10 rounded-2xl px-6 py-5 text-center text-lg focus:border-indigo-500/50 outline-none transition-all"
                />
                {error === 'auth' && (
                  <p className="text-red-500 text-[10px] font-bold uppercase mt-3 tracking-widest">验证失败：无效的访问凭证</p>
                )}
              </div>
              <button 
                onClick={handleVerify}
                className="w-full py-5 bg-white text-black rounded-2xl font-bold hover:bg-indigo-500 hover:text-white transition-all active:scale-95 shadow-xl shadow-white/5"
              >
                解锁控制台
              </button>
            </div>
            
            <div className="mt-8 flex items-center justify-center gap-2 text-[9px] text-zinc-600 font-bold uppercase tracking-widest">
              <ShieldCheck className="w-3 h-3" /> Encrypted Endpoint Verified
            </div>
          </div>
        </div>
      </section>
    );
  }

  // --- 解锁后的专业实验室界面 ---
  return (
    <section id="design" className="py-24 bg-[#030303] relative min-h-screen">
      <div className="blob top-1/4 right-0 opacity-10" />
      <div className="container mx-auto px-6 relative z-10">
        
        <div className="flex items-center justify-between mb-12">
            <div>
                <h2 className="text-3xl md:text-5xl font-display font-bold italic tracking-tight">Visual Lab.</h2>
                <div className="flex items-center gap-2 mt-2">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Aether Node Connected (Verified)</p>
                </div>
            </div>
            <button 
                onClick={() => setIsVerified(false)} 
                className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/10 text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:bg-red-500/10 hover:text-red-400 transition-all"
            >
                <Lock className="w-3 h-3" /> 锁定会话
            </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* 左侧控制面板 */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#09090b] border border-white/5 rounded-[32px] p-8 shadow-2xl">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                    <Sliders className="w-4 h-4 text-indigo-400" />
                  </div>
                  <h3 className="text-lg font-bold tracking-tight">参数架构</h3>
                </div>
                <button onClick={handleRandomPrompt} className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 border border-white/5 transition-all">
                  <Dices className="w-3 h-3" /> 随机灵感
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-bold uppercase text-zinc-500 mb-3 block tracking-[0.2em]">正向提示词 (Positive)</label>
                  <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-sm h-32 focus:border-indigo-500/40 outline-none resize-none transition-all" />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-zinc-500 mb-3 block tracking-[0.2em] text-red-900/40">反向提示词 (Negative)</label>
                  <textarea value={negPrompt} onChange={(e) => setNegPrompt(e.target.value)} placeholder="描述要排除的视觉元素..." className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-sm h-24 focus:border-indigo-500/40 outline-none resize-none opacity-60" />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-zinc-500 mb-3 block tracking-[0.2em]">文生图模型</label>
                  <div className="relative group">
                    <select value={model} onChange={(e) => setModel(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-sm appearance-none focus:border-indigo-500/40 outline-none">
                      {MODELS.map(m => <option key={m.id} value={m.id} className="bg-zinc-900">{m.name}</option>)}
                    </select>
                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 pointer-events-none group-hover:text-indigo-400" />
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-white/5">
                <button onClick={() => setShowAdvanced(!showAdvanced)} className="w-full flex items-center justify-between mb-6 group">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center"><Settings className="w-4 h-4 text-purple-400" /></div>
                    <h4 className="text-sm font-bold tracking-tight">高级实验室选项</h4>
                  </div>
                  <div className="px-3 py-1 rounded-lg bg-white/5 text-[9px] font-bold uppercase text-zinc-500 group-hover:text-white transition-all">
                    {showAdvanced ? '收起控制台' : '展开控制台'}
                  </div>
                </button>

                {showAdvanced && (
                  <div className="space-y-6 animate-in slide-in-from-top-2 duration-300">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="flex justify-between text-[10px] font-bold uppercase text-zinc-500 mb-3"><span>宽度</span> <span>{width}px</span></div>
                        <input type="range" min="256" max="1024" step="64" value={width} onChange={(e)=>setWidth(Number(e.target.value))} className="w-full" />
                      </div>
                      <div>
                        <div className="flex justify-between text-[10px] font-bold uppercase text-zinc-500 mb-3"><span>高度</span> <span>{height}px</span></div>
                        <input type="range" min="256" max="1024" step="64" value={height} onChange={(e)=>setHeight(Number(e.target.value))} className="w-full" />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-[10px] font-bold uppercase text-zinc-500 mb-3"><span>迭代步数 (Steps)</span> <span>{steps}</span></div>
                      <input type="range" min="1" max="50" value={steps} onChange={(e)=>setSteps(Number(e.target.value))} className="w-full" />
                    </div>
                    <div>
                      <div className="flex justify-between text-[10px] font-bold uppercase text-zinc-500 mb-3"><span>引导系数 (CFG)</span> <span>{guidance}</span></div>
                      <input type="range" min="1" max="20" step="0.5" value={guidance} onChange={(e)=>setGuidance(Number(e.target.value))} className="w-full" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase text-zinc-500 mb-3 block tracking-[0.2em]">随机种子 (Seed)</label>
                      <div className="flex gap-2">
                        <input type="number" value={seed} onChange={(e) => setSeed(e.target.value)} placeholder="随机种子值" className="flex-1 bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-sm outline-none focus:border-indigo-500/40" />
                        <button onClick={() => setSeed(Math.floor(Math.random()*9999999).toString())} className="p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors"><RefreshCw className="w-4 h-4 text-zinc-400" /></button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <button onClick={handleGenerate} disabled={isGenerating} className="w-full mt-10 py-5 bg-indigo-600 text-white rounded-[24px] font-bold flex items-center justify-center gap-3 hover:bg-indigo-500 transition-all active:scale-[0.98] disabled:opacity-40">
                {isGenerating ? <Loader2 className="w-6 h-6 animate-spin" /> : <Wand2 className="w-6 h-6" />}
                {isGenerating ? '正在重构神经像素...' : '初始化渲染'}
              </button>
            </div>
          </div>

          {/* 右侧预览区 */}
          <div className="lg:col-span-7 space-y-6 sticky top-24">
            <div className="bg-[#09090b] border border-white/5 rounded-[40px] p-2 flex flex-col shadow-2xl h-fit overflow-hidden">
              <div className="p-8 flex items-center justify-between border-b border-white/5 bg-white/[0.01]">
                <div className="flex items-center gap-3">
                  <Monitor className="w-5 h-5 text-zinc-500" />
                  <span className="font-display font-bold text-lg tracking-tight uppercase">预览监视器</span>
                </div>
                {error !== 'none' && (
                  <div className="px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-bold uppercase flex items-center gap-2 animate-shake">
                    <ShieldAlert className="w-4 h-4" /> {error === 'limit' ? '边缘限流中' : '网络连接波动'}
                  </div>
                )}
              </div>

              <div className="flex-1 m-4 min-h-[500px] rounded-[32px] bg-black/60 border border-white/5 flex flex-col items-center justify-center relative group">
                {currentImage ? (
                  <div className="w-full h-full relative overflow-hidden rounded-[32px]">
                    <img src={currentImage} className="w-full h-full object-contain" alt="Render" />
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center gap-5">
                      <a href={currentImage} target="_blank" className="w-16 h-16 bg-white text-black rounded-full flex items-center justify-center hover:scale-110 transition-transform"><Maximize2 className="w-6 h-6" /></a>
                      <a href={currentImage} download className="w-16 h-16 bg-indigo-600 text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform"><Download className="w-6 h-6" /></a>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="w-24 h-24 bg-white/[0.03] rounded-[32px] flex items-center justify-center mx-auto mb-8 border border-white/5"><ImageIcon className="w-10 h-10 text-zinc-700" /></div>
                    <h5 className="text-zinc-500 font-bold uppercase tracking-[0.3em] text-sm mb-4">Neural Standby</h5>
                    <p className="text-[11px] text-zinc-700 font-medium uppercase tracking-widest text-center px-12">等待神经信号输入以启动渲染进程</p>
                  </div>
                )}
                {isGenerating && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-md flex flex-col items-center justify-center z-20">
                    <Loader2 className="w-16 h-16 text-indigo-500 animate-spin" />
                    <p className="mt-8 text-sm font-bold tracking-[0.5em] text-white/80 animate-pulse">渲染中...</p>
                  </div>
                )}
              </div>

              <div className="p-8 grid grid-cols-2 gap-8 border-t border-white/5 bg-white/[0.01]">
                <div className="flex items-center gap-3 text-zinc-500">
                  <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center border border-white/5"><Clock className="w-4 h-4" /></div>
                  <div><p className="text-[9px] font-bold uppercase text-zinc-600">生成耗时</p><p className="text-xs font-mono text-zinc-300">{genTime}</p></div>
                </div>
                <div className="flex items-center gap-3 text-zinc-500 justify-end text-right">
                  <div><p className="text-[9px] font-bold uppercase text-zinc-600">渲染节点</p><p className="text-xs font-mono text-zinc-300 truncate max-w-[200px]">{MODELS.find(m=>m.id===model)?.id}</p></div>
                  <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center border border-white/5"><Globe className="w-4 h-4" /></div>
                </div>
              </div>
            </div>

            {history.length > 0 && (
              <div className="bg-[#09090b] border border-white/5 rounded-[32px] p-8">
                <div className="flex items-center gap-3 mb-6"><History className="w-4 h-4 text-zinc-500" /><span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">最近生成的神经资产</span></div>
                <div className="grid grid-cols-6 gap-4">
                  {history.map((h, i) => (
                    <button key={i} onClick={() => setCurrentImage(h.url)} className={`aspect-square rounded-2xl overflow-hidden border-2 transition-all hover:scale-105 ${currentImage === h.url ? 'border-indigo-500' : 'border-transparent opacity-40'}`}>
                      <img src={h.url} className="w-full h-full object-cover" alt="History" />
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
