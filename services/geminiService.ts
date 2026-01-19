
/**
 * Aether Gemini Service - Node Proxy Implementation
 */

const WORKER_URL = "https://odd-credit-b262.yutongli895.workers.dev";

export const getGeminiChatStream = async (message: string, history: any[] = []) => {
  const contents = history.map(msg => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.content }]
  }));
  
  contents.push({ role: 'user', parts: [{ text: message }] });

  const response = await fetch(`${WORKER_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents,
      apiKey: process.env.API_KEY 
    })
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ message: 'Node Connection Failed' }));
    throw { status: response.status, message: err.message || 'Service Unavailable' };
  }

  const reader = response.body?.getReader();
  const decoder = new TextDecoder();

  return (async function* () {
    let buffer = '';
    while (true) {
      const { done, value } = await reader!.read();
      if (done) break;
      
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.trim().startsWith('data: ')) {
          try {
            const data = JSON.parse(line.trim().slice(6));
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text) {
              yield { text };
            }
          } catch (e) { }
        }
      }
    }
  })();
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
