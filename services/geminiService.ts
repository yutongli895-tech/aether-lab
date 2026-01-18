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
    return "神经网络已就绪。欢迎来到 Aether 架构控制台。我是您的架构优化助手。";
  }
  
  const randomAdvice = ARCHITECT_KNOWLEDGE[Math.floor(Math.random() * ARCHITECT_KNOWLEDGE.length)];
  return `[本地分析]：关于您的请求“${lastMsg}”，架构建议如下：${randomAdvice}`;
};

/**
 * 核心：生成带有鉴权参数的图片预览 URL
 * 适配最新旗舰版 Worker 逻辑，确保参数完整性
 */
export const generateAetherImage = async (prompt: string) => {
  const workerUrl = "https://odd-credit-b262.yutongli895.workers.dev";
  const password = "P@ssw0rd"; 
  const modelId = "flux-1-schnell"; 
  
  // 必须明确指定 model 和 password，否则 Worker 会返回 403
  const queryParams = new URLSearchParams({
    prompt: prompt,
    model: modelId,
    password: password,
    width: "1024",
    height: "1024",
    steps: "6"
  });
  
  return `${workerUrl}/?${queryParams.toString()}`;
};