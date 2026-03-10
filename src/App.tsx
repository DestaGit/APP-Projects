/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  ChevronRight, 
  ArrowLeft, 
  Sparkles, 
  Clock, 
  User, 
  Plus, 
  Search,
  CheckCircle2,
  AlertCircle,
  Send
} from 'lucide-react';
import Markdown from 'react-markdown';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Post, View } from './types';
import { MOCK_POSTS } from './constants';
import { generatePostDraft } from './services/geminiService';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function App() {
  const [view, setView] = useState<View>('home');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [isDrafting, setIsDrafting] = useState(false);
  const [draftTopic, setDraftTopic] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleReadPost = (post: Post) => {
    setSelectedPost(post);
    setView('post');
    window.scrollTo(0, 0);
  };

  const handleBack = () => {
    setView('home');
    setSelectedPost(null);
  };

  const handleDraftPost = async () => {
    if (!draftTopic.trim()) return;
    setIsDrafting(true);
    try {
      const draft = await generatePostDraft(draftTopic);
      const newPost: Post = {
        id: Date.now().toString(),
        title: draft.title || "Untitled Draft",
        excerpt: draft.excerpt || "No excerpt provided.",
        problem: draft.problem || "Problem not defined.",
        solution: draft.solution || "Solution not defined.",
        content: draft.content || "No content generated.",
        author: "AI Assistant",
        date: new Date().toLocaleDateString(),
        readTime: "5 min",
        category: draft.category || "General",
        image: `https://picsum.photos/seed/${encodeURIComponent(draft.title || 'post')}/1000/600`
      };
      setPosts([newPost, ...posts]);
      setSelectedPost(newPost);
      setView('post');
      setDraftTopic('');
    } catch (error) {
      console.error(error);
    } finally {
      setIsDrafting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-brand-cream/80 backdrop-blur-md border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer group"
            onClick={handleBack}
          >
            <div className="w-10 h-10 bg-zinc-900 rounded-full flex items-center justify-center text-brand-cream group-hover:scale-110 transition-transform">
              <BookOpen size={20} />
            </div>
            <span className="text-2xl font-serif font-bold tracking-tight">ClarifyPoint</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium uppercase tracking-widest text-zinc-500">
            <button onClick={() => setView('home')} className={cn("hover:text-zinc-900 transition-colors", view === 'home' && "text-zinc-900")}>Archive</button>
            <button onClick={() => setView('draft')} className={cn("hover:text-zinc-900 transition-colors", view === 'draft' && "text-zinc-900")}>Draft</button>
            <button className="hover:text-zinc-900 transition-colors">About</button>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
              <input 
                type="text" 
                placeholder="Search the point..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-zinc-100 border-none rounded-full text-sm focus:ring-2 focus:ring-zinc-900 transition-all w-48 lg:w-64"
              />
            </div>
            <button 
              onClick={() => setView('draft')}
              className="bg-zinc-900 text-brand-cream px-6 py-2 rounded-full text-sm font-medium hover:bg-zinc-800 transition-colors flex items-center gap-2"
            >
              <Plus size={16} />
              <span className="hidden xs:inline">New Post</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="flex-grow">
        <AnimatePresence mode="wait">
          {view === 'home' && (
            <motion.div 
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-7xl mx-auto px-6 py-12 lg:py-20"
            >
              {/* Hero Section */}
              <div className="mb-20">
                <h1 className="text-6xl md:text-8xl font-serif font-bold leading-[0.9] tracking-tighter mb-8">
                  Get Straight <br />
                  <span className="text-zinc-400 italic">To The Point.</span>
                </h1>
                <p className="max-w-2xl text-xl text-zinc-600 leading-relaxed">
                  We believe the best content doesn't just inform—it clarifies. 
                  Discover actionable insights written for humans, by humans.
                </p>
              </div>

              {/* Posts Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                {filteredPosts.map((post, idx) => (
                  <motion.div 
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="group cursor-pointer"
                    onClick={() => handleReadPost(post)}
                  >
                    <div className="aspect-[4/5] overflow-hidden rounded-2xl mb-6 bg-zinc-200">
                      <img 
                        src={post.image} 
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 text-xs font-mono uppercase tracking-widest text-zinc-400">
                        <span>{post.category}</span>
                        <span className="w-1 h-1 bg-zinc-300 rounded-full" />
                        <span>{post.readTime}</span>
                      </div>
                      <h3 className="text-2xl font-serif font-bold group-hover:text-brand-orange transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-zinc-600 line-clamp-2 leading-relaxed">
                        {post.excerpt}
                      </p>
                      <div className="pt-2 flex items-center text-sm font-bold uppercase tracking-widest group-hover:translate-x-2 transition-transform">
                        Read Post <ChevronRight size={16} className="ml-1" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {view === 'post' && selectedPost && (
            <motion.div 
              key="post"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white min-h-screen"
            >
              {/* Post Header */}
              <div className="relative h-[60vh] w-full">
                <img 
                  src={selectedPost.image} 
                  alt={selectedPost.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 w-full p-8 md:p-20">
                  <div className="max-w-4xl mx-auto">
                    <button 
                      onClick={handleBack}
                      className="mb-8 flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest"
                    >
                      <ArrowLeft size={16} /> Back to Archive
                    </button>
                    <div className="flex items-center gap-3 text-xs font-mono uppercase tracking-widest text-white/60 mb-4">
                      <span>{selectedPost.category}</span>
                      <span className="w-1 h-1 bg-white/30 rounded-full" />
                      <span>{selectedPost.date}</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-white leading-tight mb-6">
                      {selectedPost.title}
                    </h1>
                    <div className="flex items-center gap-4 text-white/80">
                      <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                        <User size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-bold">{selectedPost.author}</p>
                        <p className="text-xs opacity-60">{selectedPost.readTime} read</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Post Content */}
              <div className="max-w-4xl mx-auto px-6 py-20">
                {/* Problem/Solution Summary Box */}
                <div className="grid md:grid-cols-2 gap-8 mb-16 p-8 bg-zinc-50 rounded-3xl border border-zinc-100">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-red-500 font-mono text-xs uppercase tracking-widest font-bold">
                      <AlertCircle size={14} /> The Problem
                    </div>
                    <p className="text-zinc-800 font-medium leading-relaxed">
                      {selectedPost.problem}
                    </p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-emerald-600 font-mono text-xs uppercase tracking-widest font-bold">
                      <CheckCircle2 size={14} /> The Solution
                    </div>
                    <p className="text-zinc-800 font-medium leading-relaxed">
                      {selectedPost.solution}
                    </p>
                  </div>
                </div>

                <div className="markdown-body prose prose-zinc lg:prose-xl max-w-none">
                  <Markdown>{selectedPost.content}</Markdown>
                </div>

                <div className="mt-20 pt-10 border-t border-zinc-100 flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center text-brand-cream mb-6">
                    <Sparkles size={32} />
                  </div>
                  <h4 className="text-2xl font-serif font-bold mb-2">Did this hit the point?</h4>
                  <p className="text-zinc-500 mb-8">Share this insight with someone who needs it.</p>
                  <div className="flex gap-4">
                    <button className="px-8 py-3 bg-zinc-900 text-white rounded-full font-bold text-sm uppercase tracking-widest hover:bg-zinc-800 transition-all">
                      Share Post
                    </button>
                    <button 
                      onClick={handleBack}
                      className="px-8 py-3 border border-zinc-200 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-zinc-50 transition-all"
                    >
                      Keep Reading
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {view === 'draft' && (
            <motion.div 
              key="draft"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-3xl mx-auto px-6 py-20"
            >
              <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-brand-orange text-white mb-6 rotate-3">
                  <Sparkles size={40} />
                </div>
                <h2 className="text-5xl font-serif font-bold mb-4">Find Your ClarifyPoint</h2>
                <p className="text-xl text-zinc-600">
                  Tell us what problem you want to solve. Our AI will help you get straight to the point.
                </p>
              </div>

              <div className="bg-white p-8 rounded-3xl shadow-xl shadow-zinc-200/50 border border-zinc-100">
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-widest text-zinc-400 mb-3">Topic or Problem</label>
                    <textarea 
                      value={draftTopic}
                      onChange={(e) => setDraftTopic(e.target.value)}
                      placeholder="e.g., How to manage remote teams effectively, or Why we always procrastinate on big projects..."
                      className="w-full h-40 p-6 bg-zinc-50 border-none rounded-2xl text-lg focus:ring-2 focus:ring-zinc-900 transition-all resize-none"
                    />
                  </div>
                  
                  <button 
                    onClick={handleDraftPost}
                    disabled={isDrafting || !draftTopic.trim()}
                    className={cn(
                      "w-full py-6 rounded-2xl font-bold text-lg uppercase tracking-widest flex items-center justify-center gap-3 transition-all",
                      isDrafting ? "bg-zinc-100 text-zinc-400" : "bg-zinc-900 text-white hover:bg-zinc-800 active:scale-[0.98]"
                    )}
                  >
                    {isDrafting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin" />
                        Clarifying the point...
                      </>
                    ) : (
                      <>
                        <Send size={20} />
                        Generate Draft
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[
                  { icon: <Clock size={20} />, title: "Save Time", desc: "Structure in seconds" },
                  { icon: <CheckCircle2 size={20} />, title: "Proven Format", desc: "Problem-Solution-Action" },
                  { icon: <Sparkles size={20} />, title: "Engaging Tone", desc: "Accessible & Interesting" }
                ].map((item, i) => (
                  <div key={i} className="p-6 bg-zinc-50 rounded-2xl border border-zinc-100 text-center">
                    <div className="text-zinc-900 flex justify-center mb-3">{item.icon}</div>
                    <h5 className="font-bold text-sm mb-1">{item.title}</h5>
                    <p className="text-xs text-zinc-500">{item.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-zinc-900 text-brand-cream py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-brand-cream rounded-full flex items-center justify-center text-zinc-900">
                  <BookOpen size={16} />
                </div>
                <span className="text-2xl font-serif font-bold tracking-tight">ClarifyPoint</span>
              </div>
              <p className="text-zinc-400 max-w-sm leading-relaxed">
                The world is full of noise. We're here to provide the signal. 
                High-impact, problem-solving content that gets straight to the point.
              </p>
            </div>
            <div>
              <h5 className="font-mono text-xs uppercase tracking-widest text-zinc-500 mb-6">Platform</h5>
              <ul className="space-y-4 text-sm font-medium">
                <li><a href="#" className="hover:text-brand-orange transition-colors">Archive</a></li>
                <li><a href="#" className="hover:text-brand-orange transition-colors">Drafting Tool</a></li>
                <li><a href="#" className="hover:text-brand-orange transition-colors">Newsletter</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-mono text-xs uppercase tracking-widest text-zinc-500 mb-6">Connect</h5>
              <ul className="space-y-4 text-sm font-medium">
                <li><a href="#" className="hover:text-brand-orange transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-brand-orange transition-colors">LinkedIn</a></li>
                <li><a href="#" className="hover:text-brand-orange transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-10 border-t border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-zinc-500">
            <p>© 2024 Clarify Brand. All rights reserved.</p>
            <div className="flex gap-8">
              <a href="#" className="hover:text-brand-cream transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-brand-cream transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
