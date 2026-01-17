
export interface Message {
  role: 'user' | 'assistant';
  content: string;
  id: string;
}

export interface GeneratedImage {
  url: string;
  prompt: string;
  timestamp: number;
}

export enum AppSection {
  HERO = 'hero',
  FEATURES = 'features',
  CHAT = 'chat',
  DESIGN = 'design',
  PRICING = 'pricing'
}
