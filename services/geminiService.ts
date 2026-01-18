
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

// 初始化 Gemini API
// 注意：process.env.API_KEY 会由系统自动注入，无需手动修改
const genAI = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * 获取 Gemini 文本响应（支持流式传输）
 */
export const getGeminiChatStream = async (message: string, history: any[] = []) => {
  try {
    const chat = genAI.chats.create({
      model: "gemini-3-flash-preview",
      config: {
        systemInstruction: `你是一位世界顶级的 AI 建筑架构师和技术顾问。
        你的名字是 Aether AI。
        你擅长：
        1. 建筑美学分析与现代 UI/UX 设计建议。
        2. Cloudflare Worker, 边缘计算等高并发架构咨询。
        3. 能够提供具体的代码片段和设计范式。
        你的回答应该专业、简洁且富有前瞻性珍惜。`,
        tools: [{ googleSearch: {} }], // 开启联网搜索增强
      },
    });

    const result = await chat.sendMessageStream({ message });
    return result;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

/**
 * 核心：生成图片 URL
 * @param prompt 提示词
 * @param authCode 访问密码
 */
export const generateAetherImage = async (prompt: string, authCode: string) => {
  const workerUrl = "https://odd-credit-b262.yutongli895.workers.dev";
  const modelId = "flux-1-schnell"; 
  
  const queryParams = new URLSearchParams({
    prompt: prompt,
    model: modelId,
    password: authCode, // 使用用户输入的密码
    width: "1024",
    height: "1024",
    steps: "6"
  });
  
  return `${workerUrl}/?${queryParams.toString()}`;
};
