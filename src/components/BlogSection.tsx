import React, { useState } from 'react';
import { BLOG_POSTS, BlogPost } from '../data/blogs';
import { BookOpen, Calendar, Clock, Tag, X, ChevronRight, Phone, MessageSquare, Search, Sparkles } from 'lucide-react';

export const BlogSection: React.FC = () => {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    'All',
    'Local History & Heritage',
    'Nilgiri Heritage',
    'Pilgrimage & Spiritual',
    'Wildlife & Nature',
    'Taxi Pricing Guide',
    'Airport Transfers',
    'Corporate & IT Transit',
    'Highway & Outstation Drops',
    'Suburban Travel & Taxi Safety',
    'Tour Packages'
  ];

  const filteredPosts = BLOG_POSTS.filter((post) => {
    const matchesCategory = activeCategory === 'All' || post.category === activeCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="blog" className="py-16 bg-slate-950 text-white border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-400 border border-amber-500/30 px-3.5 py-1.5 rounded-full text-xs font-bold mb-3 shadow-sm">
            <BookOpen className="w-3.5 h-3.5" />
            25 Local Travel Guides, History & Taxi Articles
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-3">
            Coimbatore Travel & Local Heritage Blog
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            Explore 25 expert travel guides covering Kongu Nadu heritage, John Sullivan's Nilgiri discovery, Isha Yoga routes, Ooty, Valparai, Tiruppur Texvalley, Chennai drops, and Coimbatore local taxi tips.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <div className="flex flex-wrap gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition shrink-0 ${
                  activeCategory === cat
                    ? 'bg-amber-400 text-slate-950 border-amber-400 font-bold shadow-md shadow-amber-500/20'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search history, Ooty, Isha..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-full pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        {/* Blog Post Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <article
              key={post.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-amber-500/40 transition flex flex-col justify-between group shadow-xl"
            >
              <div>
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    onError={(e) => {
                      if (post.fallbackImage) {
                        (e.target as HTMLImageElement).src = post.fallbackImage;
                      }
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md text-amber-300 border border-amber-400/30 text-[10px] font-bold px-2.5 py-1 rounded-full">
                    {post.category}
                  </span>
                </div>

                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-3 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-amber-400" /> {post.date}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-400" /> {post.readTime}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-base text-white group-hover:text-amber-400 transition leading-snug">
                    {post.title}
                  </h3>

                  <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              <div className="px-5 pb-5 pt-2 border-t border-slate-800/80 flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {post.tags.slice(0, 2).map((t, idx) => (
                    <span key={idx} className="text-[10px] text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                      #{t}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => setSelectedPost(post)}
                  className="bg-amber-400/10 hover:bg-amber-400 text-amber-400 hover:text-slate-950 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition cursor-pointer shrink-0"
                >
                  <span>Read Article</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Reader Modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full max-h-[90vh] shadow-2xl overflow-hidden flex flex-col text-white">
            {/* Modal Header */}
            <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex justify-between items-center shrink-0">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                {selectedPost.category}
              </span>
              <button
                onClick={() => setSelectedPost(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-200">
              <div className="space-y-3">
                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <span>By {selectedPost.author}</span>
                  <span>•</span>
                  <span>{selectedPost.date}</span>
                  <span>•</span>
                  <span>{selectedPost.readTime}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                  {selectedPost.title}
                </h2>
              </div>

              <div className="rounded-xl overflow-hidden h-64 border border-slate-800">
                <img
                  src={selectedPost.image}
                  alt={selectedPost.title}
                  onError={(e) => {
                    if (selectedPost.fallbackImage) {
                      (e.target as HTMLImageElement).src = selectedPost.fallbackImage;
                    }
                  }}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-4 text-sm leading-relaxed text-slate-300">
                {selectedPost.content.map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>

              {/* CTA Box inside Blog Post */}
              <div className="bg-gradient-to-r from-amber-500/20 via-slate-900 to-amber-500/20 border border-amber-500/40 rounded-xl p-5 text-center space-y-3">
                <h4 className="font-extrabold text-base text-amber-300">
                  Planning a Trip in Coimbatore or to Ooty / Isha Yoga?
                </h4>
                <p className="text-xs text-slate-300 max-w-lg mx-auto">
                  Get Taxi Kovai offers the lowest rates: Local rides at Base ₹80 + ₹28/km, One-way drop at ₹26/km, Outstation round trip at ₹15/km, and Airport drops at Base ₹100 + ₹30/km.
                </p>
                <div className="flex flex-wrap justify-center gap-3 pt-2">
                  <a
                    href="tel:+919043743777"
                    className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold px-5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition shadow-lg shadow-amber-500/20"
                  >
                    <Phone className="w-4 h-4" /> Call 9043743777
                  </a>
                  <a
                    href="https://wa.me/919043743777?text=Hi%20Get%20Taxi%20Kovai,%20I%20read%20your%20blog%20and%20want%20to%20book%20a%20cab."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition"
                  >
                    <MessageSquare className="w-4 h-4" /> WhatsApp 9043743777
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
