
import React from 'react';
import { POSTS } from '../constants';
import { ArrowLeft, Clock, Share2 } from 'lucide-react';

interface PostDetailProps {
  postId: string;
  onBack: () => void;
}

export const PostDetail: React.FC<PostDetailProps> = ({ postId, onBack }) => {
  const post = POSTS.find(p => p.id === postId);

  if (!post) return null;

  return (
    <div className="pt-32 pb-24 bg-[#09090b] min-h-screen">
      <div className="container mx-auto px-6 max-w-4xl">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-12 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Articles
        </button>

        <header className="mb-12">
          <div className="flex items-center gap-3 text-indigo-400 mb-6 font-bold text-xs uppercase tracking-widest">
            <span>{post.category}</span>
            <span className="w-1 h-1 bg-zinc-700 rounded-full" />
            <span className="text-zinc-500 flex items-center gap-1">
              <Clock className="w-3 h-3" /> 6 min read
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-8 leading-tight">
            {post.title}
          </h1>
          <div className="flex items-center justify-between border-y border-white/5 py-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500" />
              <div>
                <p className="font-bold">Aether Architect</p>
                <p className="text-sm text-zinc-500">{post.date}</p>
              </div>
            </div>
            <button className="p-3 rounded-full border border-white/10 hover:bg-white/5 transition-colors">
              <Share2 className="w-5 h-5 text-zinc-400" />
            </button>
          </div>
        </header>

        <img 
          src={post.image} 
          alt={post.title} 
          className="w-full aspect-video object-cover rounded-[32px] mb-12 shadow-2xl"
        />

        <div className="prose prose-invert max-w-none text-zinc-300 leading-relaxed space-y-6 text-lg">
          <p>{post.content}</p>
          <p>
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
          </p>
          <h2 className="text-2xl font-bold text-white mt-12 mb-4">The Shift to Edge Architectures</h2>
          <p>
            Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.
          </p>
          <div className="bg-white/5 border border-indigo-500/20 p-8 rounded-3xl my-12">
            <p className="italic text-indigo-200">
              "Design is not just what it looks like and feels like. Design is how it works in the decentralized future."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
