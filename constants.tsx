
import React from 'react';
import { 
  Zap, 
  Cpu, 
  Layers, 
  Sparkles, 
  BookOpen,
  Terminal,
  Cpu as ChipIcon
} from 'lucide-react';

export const NAV_LINKS = [
  { label: 'Articles', href: '#blog' },
  { label: 'Design', href: '#design' },
  { label: 'Contact', href: '#contact' },
];

/**
 * 发布新文章指南：
 * 1. 在 POSTS 数组的最前端添加一个新对象。
 * 2. id 必须 unique。
 */
export const POSTS = [
  {
    id: '5',
    title: 'Aether V3.0 深度解析：当 Gemini 3 遇见边缘视觉引擎',
    date: 'Nov 10, 2025',
    excerpt: '欢迎来到 Aether 架构的新纪元。本次更新带来了实时联网搜索增强与全新的 WAF 边缘防护系统。',
    content: `今天，我们正式发布 Aether V3.0。这不仅仅是一个版本的迭代，更是生成式架构的一次跨越。

核心亮点一：Gemini 3 Flash 神经核
我们深度集成了 Google 最新的 Gemini 3 Flash 模型。它不仅拥有亚秒级的响应速度，更通过 Google Search Grounding 技术实现了实时联网。这意味着 Aether 不再局限于训练数据，它能感知今天早晨刚刚发生的科技动态或设计趋势。

核心亮点二：Flux 视觉引擎
依托于部署在 Cloudflare 边缘节点的 Flux-1 Schnell 模型，我们的图像生成不仅画质细腻，更能在短短 4 秒内完成从构思到像素的转化。无论是最复杂的赛博朋克城市景观，还是极简主义的 UI 界面，它都能精准捕捉您的灵感。

核心亮点三：WAF 级边缘防御
安全是创新的前提。我们自研的 Web Application Firewall (WAF) 机制已在边缘节点上线。它能实时拦截异常频率的自动化请求，确保每一位人类创作者都能获得公平、高速的算力支持。

Aether V3.0 现已全量推送，邀请您共同探索这一神经网络与边缘计算完美结合的杰作。`,
    category: 'Innovation',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '4',
    title: 'Aether 架构节点正式迁移至原生 Worker',
    date: 'Oct 28, 2025',
    excerpt: '为了追求极致的渲染稳定性，我们将视觉引擎节点回退至原生边缘节点。',
    content: '在本次更新中，我们重点优化了 API 的调用链路。通过直接连接 Cloudflare 的边缘 Worker 节点，我们避开了复杂的 SSL 握手延迟，使得图片生成的响应速度提升了约 15%。这是我们在追求“零延迟”架构道路上的又一重要里程碑。',
    category: 'System Update',
    image: 'https://images.unsplash.com/photo-1639322537228-f710d846310a?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '1',
    title: 'The Future of Neural Interfaces in 2026',
    date: 'Oct 24, 2025',
    excerpt: 'Exploring how low-latency brain-computer links are redefining the concept of user experience.',
    content: 'Long form content about neural interfaces... In the year 2026, we see a massive shift from screen-based interaction to direct neural synthesis. The interfaces are no longer perceived as external tools but as extensions of our cognitive processing.',
    category: 'Future Tech',
    image: 'https://images.unsplash.com/photo-1614728263952-84ea256f9679?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '2',
    title: 'Glassmorphism vs. Neomorphism: The Visual War',
    date: 'Sep 12, 2025',
    excerpt: 'Why transparency and blurring became the dominant aesthetic for the modern high-end web.',
    content: 'Visual trends cycle every 5 years. Glassmorphism provides the depth needed for spatial computing while maintaining the cleanliness of minimalist design.',
    category: 'Design',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '3',
    title: 'Deploying High-Performance Apps to the Edge',
    date: 'Aug 05, 2025',
    excerpt: 'How Cloudflare and modern CDNs are eliminating the 100ms latency barrier globally.',
    content: 'Edge computing is the backbone of the decentralized web. By moving logic closer to the user, we achieve sub-millisecond response times.',
    category: 'Engineering',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800'
  }
];

export const FEATURES = [
  {
    title: 'Curated Thoughts',
    description: 'Weekly deep dives into the intersection of tech, philosophy, and modern design.',
    icon: <BookOpen className="w-6 h-6 text-indigo-400" />,
  },
  {
    title: 'Code Snippets',
    description: 'Practical examples and patterns for building at the edge of the web.',
    icon: <Terminal className="w-6 h-6 text-purple-400" />,
  },
  {
    title: 'Future Roadmap',
    description: 'Tracking the evolution of generative systems and their impact on creative work.',
    icon: <ChipIcon className="w-6 h-6 text-blue-400" />,
  }
];
