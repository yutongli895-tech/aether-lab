
// 本地架构智库内容
const ARCHITECT_KNOWLEDGE = [
  "建议在 Cloudflare Pages 层面开启边缘压缩，提升 LCP 指标。",
  "当前的视觉范式正转向‘暗色微光’风格，建议保持域名接口的低延迟响应。",
  "架构的核心在于解耦，您的图片生成 Worker 已经独立于 UI 运行。",
  "建议对生成后的视觉资产进行 WebP 转换，优化移动端体验。",
  "目前的私有节点已针对 2026 年的渲染规范进行了预热。"
];

export const getGeminiResponse = async (messages: any[]) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  const lastMsg = messages[messages.length - 1].content;
  if (lastMsg.includes("你好") || lastMsg.includes("Hello")) {
    return "神经网络已就绪。欢迎来到 Aether 架构控制台。";
  }
  const randomAdvice = ARCHITECT_KNOWLEDGE[Math.floor(Math.random() * ARCHITECT_KNOWLEDGE.length)];
  return `[本地分析]：关于“${lastMsg}”，我的建议是：${randomAdvice}`;
};

export const generateAetherImage = async (prompt: string) => {
  // 回退至原生的 Cloudflare Worker 域名
  const workerUrl = "https://odd-credit-b262.yutongli895.workers.dev";
  return `${workerUrl}/?prompt=${encodeURIComponent(prompt)}`;
};
