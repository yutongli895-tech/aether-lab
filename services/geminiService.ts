
import { GoogleGenAI } from "@google/genai";

let genAI: any = null;
try {
  genAI = new GoogleGenAI({ apiKey: process.env.API_KEY });
} catch (e) {}

export const getGeminiChatStream = async (message: string, history: any[] = []) => {
  if (!genAI) throw new Error("Aether Engine disconnected");
  const chat = genAI.chats.create({
    model: "gemini-3-flash-preview",
    config: { 
      systemInstruction: "You are Aether AI, a high-end architectural and design AI advisor. Respond with professional, futuristic insights.", 
      tools: [{ googleSearch: {} }] 
    },
  });
  return await chat.sendMessageStream({ message });
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
  const workerUrl = "https://odd-credit-b262.yutongli895.workers.dev";
  
  const queryParams = new URLSearchParams({
    prompt: params.prompt,
    model: params.model,
    password: params.password || "",
    negative_prompt: params.negative_prompt || "",
    width: params.width.toString(),
    height: params.height.toString(),
    steps: params.steps.toString(),
    guidance: params.guidance.toString()
  });

  if (params.seed !== undefined && params.seed !== null) {
    queryParams.append("seed", params.seed.toString());
  }
  
  return `${workerUrl}/?${queryParams.toString()}`;
};
