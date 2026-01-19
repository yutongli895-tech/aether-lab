
import { GoogleGenAI } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });
const WORKER_URL = "https://odd-credit-b262.yutongli895.workers.dev";

export const getGeminiChatStream = async (message: string, history: any[] = []) => {
  const ai = getAI();
  
  // 关键修复：Gemini 要求对话历史必须以 'user' 开始。
  // 过滤掉首条如果它是 assistant (欢迎语)，确保发送的数据流合法。
  let validHistory = history.map(msg => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.content }]
  }));

  // 确保第一条消息是 user
  const firstUserIndex = validHistory.findIndex(h => h.role === 'user');
  if (firstUserIndex !== -1) {
    validHistory = validHistory.slice(firstUserIndex);
  } else {
    validHistory = []; // 如果没找到 user，干脆清空
  }

  try {
    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: "你是一个专业的 AI 架构核。回复应当简洁、专业，并利用搜索能力提供最新资讯。",
        tools: [{ googleSearch: {} }]
      },
      history: validHistory
    });

    const response = await chat.sendMessageStream({ message });
    return response;
  } catch (error) {
    console.error("Gemini SDK Chat Error:", error);
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
