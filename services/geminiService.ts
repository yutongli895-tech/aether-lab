
// 本地架构模式智库
const ARCHITECT_KNOWLEDGE = [
  "建议采用分布式边缘计算架构，以减少端到端延迟。",
  "当前的视觉趋势正向‘空间计算（Spatial Computing）’演进，建议增加景深层次。",
  "对于高并发场景，建议在 Cloudflare Workers 层进行状态缓存。",
  "设计系统应基于原子化理论，确保跨平台的一致性体验。",
  "建议集成 WebAssembly 模块来处理重度计算任务。",
  "考虑使用玻璃拟态（Glassmorphism）结合动态光影，提升界面的高级感。",
  "架构的生命力在于解耦，建议将 UI 逻辑与业务状态彻底分离。"
];

export const getGeminiResponse = async (messages: any[]) => {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const lastMsg = messages[messages.length - 1].content.toLowerCase();
  
  // 简单的关键词匹配逻辑
  if (lastMsg.includes("你好") || lastMsg.includes("hello")) {
    return "神经网络已就绪。我是 Aether 架构顾问，今天我们要构建什么样的未来？";
  }
  
  // 随机返回一条专业建议
  const randomAdvice = ARCHITECT_KNOWLEDGE[Math.floor(Math.random() * ARCHITECT_KNOWLEDGE.length)];
  return `[本地分析完成]：${randomAdvice} 关于您提到的“${messages[messages.length - 1].content}”，这在 2026 年的设计范式中非常关键。`;
};

export const generateAetherImage = async (prompt: string) => {
  try {
    // 引用用户绑定的自定义域名
    const workerUrl = `https://blog.aitishici.de5.net/?prompt=${encodeURIComponent(prompt)}`;
    
    // 直接返回 URL。由于该接口返回的是图片流，前端 <img> 标签可以直接使用此 URL
    return workerUrl;
  } catch (error) {
    console.error("Custom Engine Error:", error);
    return null;
  }
};
