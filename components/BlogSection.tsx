
import React from 'react';
import { POSTS } from '../constants';
import { ArrowRight, Calendar, Tag } from 'lucide-react';

interface BlogSectionProps {
  onSelectPost: (postId: string) => void;
}

export const BlogSection: React.FC<BlogSectionProps> = ({ onSelectPost }) => {
  return (
    <section id="blog" className="py-24 bg-zinc-950">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-xl">
            <h2 className="text-indigo-400 font-semibold tracking-wider text-sm uppercase mb-4">Writings</h2>
            <h3 className="text-4xl font-display font-bold">Latest Insights</h3>
          </div>
          <p className="text-zinc-500 max-w-xs text-sm">
            Reflections on design, technology, and the future of human-machine interaction.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {POSTS.map((post) => (
            <article 
              key={post.id}
              className="group cursor-pointer flex flex-col bg-zinc-900/50 rounded-3xl overflow-hidden border border-white/5 hover:border-indigo-500/30 transition-all duration-500 hover:-translate-y-2"
              onClick={() => onSelectPost(post.id)}
            >
              <div className="relative aspect-video overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-black/50 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-widest text-indigo-300 border border-white/10">
                    {post.category}
                  </span>
                </div>
              </div>
              
              <div className="p-8 flex-1 flex flex-col">
                <div className="flex items-center gap-4 text-zinc-500 text-xs mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {post.date}
                  </div>
                </div>
                
                <h4 className="text-xl font-bold mb-4 group-hover:text-indigo-400 transition-colors">
                  {post.title}
                </h4>
                
                <p className="text-zinc-400 text-sm leading-relaxed mb-6 flex-1">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center text-sm font-bold text-white group-hover:gap-2 transition-all">
                  Read Article <ArrowRight className="w-4 h-4 ml-2 text-indigo-500" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
