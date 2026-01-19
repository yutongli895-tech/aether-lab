
import { GoogleGenAI } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });
const WORKER_URL = "https://odd-credit-b262.yutongli895.workers.dev";

export const getGeminiChatStream = async (message: string, history: any[] = []) => {
  const ai = getAI();
  
  // 严格过滤历史：必须是 user 和 model 交替，且必须以 user 开始
  let contents = history
    .filter(msg => msg.content && msg.content.trim() !== "")
    .map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

  // 强制确保第一条是 user
  const firstUserIndex = contents.findIndex(c => c.role === 'user');
  if (firstUserIndex !== -1) {
    contents = contents.slice(firstUserIndex);
  } else {
    contents = [];
  }

  // 添加当前消息
  contents.push({ role: 'user', parts: [{ text: message }] });

  try {
    // 使用 generateContentStream 获得最高级别的配置控制
    const response = await ai.models.generateContentStream({
      model: 'gemini-3-flash-preview',
      contents: contents,
      config: {
        systemInstruction: "你是一个高级 AI 架构顾问（Aether Core）。你的回复应当专业、客观、逻辑严密，并擅长使用 Markdown 格式（如列表、粗体、代码块）。对于实时信息，请利用内置的搜索工具进行核实。",
        tools: [{ googleSearch: {} }],
        temperature: 0.7,
        topP: 0.95,
      }
    });
    return response;
  } catch (error: any) {
    console.error("Aether Core Neural Link Error:", error);
    // 如果是工具调用报错，尝试不带工具重试
    if (error.message?.includes('tool')) {
       return await ai.models.generateContentStream({
          model: 'gemini-3-flash-preview',
          contents: contents
       });
    }
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
  const queryParams = new URLSearchParams({
    prompt: params.prompt,
    model: params.model,
    password: params.password || "",
    negative_prompt: params.negative_prompt || "",
    width: params.width.toString(),
    height: params.height.toString(),
    num_steps: params.steps.toString(),
    guidance: params.guidance.toString()
  });

  if (params.seed !== undefined && params.seed !== null) {
    queryParams.append("seed", params.seed.toString());
  }
  
  return `${WORKER_URL}/?${queryParams.toString()}`;
};
