
import { Message } from "../types";

// Static mock service for Chat
export const getGeminiResponse = async (messages: Message[]) => {
  await new Promise(resolve => setTimeout(resolve, 800));
  const lastUserMessage = messages[messages.length - 1].content.toLowerCase();
  
  if (lastUserMessage.includes('hello')) {
    return "Welcome to my personal architecture blog. I write about the future of tech. How can I guide you today?";
  }
  
  return "This is Aether Consultant in static mode. In a production environment with an API key, I would provide a deep analysis. For now, enjoy the UI and the linked Visualizer Engine below.";
};

/**
 * INTEGRATION: Connecting to your custom Cloudflare Worker
 * URL: https://odd-credit-b262.yutongli895.workers.dev/
 */
export const generateAetherImage = async (prompt: string) => {
  try {
    const workerUrl = `https://odd-credit-b262.yutongli895.workers.dev/?prompt=${encodeURIComponent(prompt)}`;
    
    // 我们添加一个 timeout 防止请求无限挂起
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30秒超时

    const response = await fetch(workerUrl, {
      method: 'GET',
      signal: controller.signal,
      mode: 'cors', // 显式要求跨域模式
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Worker returned status: ${response.status}`);
    }

    const blob = await response.blob();
    return URL.createObjectURL(blob);

  } catch (error: any) {
    console.error("Worker Integration Error:", error);
    
    // 如果是类型为 TypeError 且消息包含 fetch，通常就是 CORS 错误
    if (error.name === 'TypeError' || error.message.includes('fetch')) {
      return `https://placehold.co/800x800/1e1e20/ef4444?text=CORS+Error:+Check+Worker+Headers`;
    }
    
    return `https://placehold.co/800x800/1e1e20/a5b4fc?text=Worker+Error:+${encodeURIComponent(error.message)}`;
  }
};
