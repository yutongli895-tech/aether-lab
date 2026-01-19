
import { GoogleGenAI } from "@google/genai";

// 初始化官方 SDK
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const WORKER_URL = "https://odd-credit-b262.yutongli895.workers.dev";

/**
 * 聊天服务：使用 SDK 驱动。
 * 注意：如果需要彻底解决中国 IP 访问，建议通过 VPN 或将 SDK 的 API 请求通过 Worker 代理。
 * 此处遵循 SDK 规范调用。
 */
export const getGeminiChatStream = async (message: string, history: any[] = []) => {
  const contents = history.map(msg => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.content }]
  }));
  
  contents.push({ role: 'user', parts: [{ text: message }] });

  try {
    const response = await ai.models.generateContentStream({
      model: 'gemini-3-flash-preview',
      contents: contents,
      config: {
        systemInstruction: "你是一个专业的 AI 架构核。你提供深度的设计分析和架构洞察。请务必使用联网搜索功能来确保你的回答基于最新的科技趋势。回复应当简洁专业。",
        tools: [{ googleSearch: {} }]
      }
    });

    return response;
  } catch (error) {
    console.error("Gemini SDK Connection Error:", error);
    throw error;
  }
};

/**
 * 图像生成：继续使用 Worker 代理以利用边缘算力和 WAF 防护
 */
export const generateAetherImage = async (params: {
  prompt: string;
  negative_prompt?: string;
  model: string;
  password?: string;
  width: number;
  height: number;
  steps: number;
  guidance: number;
  seed?: number;
}) => {
  const queryParams = new URLSearchParams({
    prompt: params.prompt,
    model: params.model,
    password: params.password || "",
    width: params.width.toString(),
    height: params.height.toString(),
    steps: params.steps.toString(),
    guidance: params.guidance.toString()
  });

  if (params.seed !== undefined && params.seed !== null) {
    queryParams.append("seed", params.seed.toString());
  }
  
  return `${WORKER_URL}/?${queryParams.toString()}`;
};
