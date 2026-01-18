
import React, { useState, useEffect } from 'react';
import { Header } from './components/Header.tsx';
import { Hero } from './components/Hero.tsx';
import { Features } from './components/Features.tsx';
import { GeminiChat } from './components/GeminiChat.tsx';
import { ImageGen } from './components/ImageGen.tsx';
import { BlogSection } from './components/BlogSection.tsx';
import { PostDetail } from './components/PostDetail.tsx';
import { ContactSection } from './components/ContactSection.tsx';
import { Footer } from './components/Footer.tsx';

const App: React.FC = () => {
  const [currentPostId, setCurrentPostId] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPostId]);

  return (
    <div className="min-h-screen bg-[#030303] text-white selection:bg-indigo-500/30 overflow-x-hidden">
      <Header />
      <main>
        {currentPostId ? (
          <PostDetail 
            postId={currentPostId} 
            onBack={() => setCurrentPostId(null)} 
          />
        ) : (
          <>
            <Hero />
            <Features />
            <BlogSection onSelectPost={setCurrentPostId} />
            <GeminiChat />
            <ImageGen />
            <ContactSection />
            
            <section id="pricing" className="py-24 relative overflow-hidden">
               <div className="absolute inset-0 bg-indigo-600/5 -z-10" />
               <div className="container mx-auto px-6 text-center">
                 <h2 className="text-4xl md:text-6xl font-display font-bold mb-8 italic">Stay Ahead.</h2>
                 <p className="text-zinc-400 max-w-2xl mx-auto mb-12 text-lg">
                   Subscribe to our updates for exclusive insights into digital architecture.
                 </p>
                 <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                   <input 
                     type="email" 
                     placeholder="your@email.com"
                     className="flex-1 bg-zinc-900 border border-white/10 rounded-full px-6 py-4 focus:outline-none focus:border-indigo-500 transition-all"
                   />
                   <button className="px-10 py-4 bg-white text-black font-bold rounded-full hover:bg-zinc-200 transition-all active:scale-95">
                     Join
                   </button>
                 </div>
               </div>
            </section>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default App;
