
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
  { label: 'About', href: '#about' },
];

/**
 * 发布新文章指南：
 * 1. 在 POSTS 数组的最前端添加一个新对象。
 * 2. id 必须唯一。
 * 3. image 建议使用高质量的 Unsplash 链接。
 */
export const POSTS = [
  {
    id: '4', // 新文章 ID
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
