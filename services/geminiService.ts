
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const WORKER_URL = "https://odd-credit-b262.yutongli895.workers.dev";

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
        systemInstruction: "你是一个专业的 AI 架构核。回复应当简洁、专业，并利用搜索能力提供最新资讯。",
        tools: [{ googleSearch: {} }]
      }
    });
    return response;
  } catch (error) {
    console.error("Gemini SDK Connection Error:", error);
    throw error;
  }
};

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
  // 严格映射 Worker 的 searchParams.get 参数名
  const queryParams = new URLSearchParams({
    prompt: params.prompt,
    model: params.model,
    password: params.password || "",
    negative_prompt: params.negative_prompt || "",
    width: params.width.toString(),
    height: params.height.toString(),
    num_steps: params.steps.toString(), // 对应 worker.js 中的 num_steps/steps 逻辑
    guidance: params.guidance.toString()
  });

  if (params.seed !== undefined && params.seed !== null) {
    queryParams.append("seed", params.seed.toString());
  }
  
  // 返回带参数的 URL，前端 Image 对象的 onload 会触发 worker 的生成逻辑
  return `${WORKER_URL}/?${queryParams.toString()}`;
};
