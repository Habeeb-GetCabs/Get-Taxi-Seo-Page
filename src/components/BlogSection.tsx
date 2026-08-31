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
    <section id="blog" className="py-16 bg-slate-100/60 text-slate-900 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 border border-amber-300 px-3.5 py-1.5 rounded-full text-xs font-bold mb-3 shadow-sm">
            <BookOpen className="w-3.5 h-3.5 text-amber-600" />
            25 Local Travel Guides, History & Taxi Articles
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950 mb-3">
            Coimbatore Travel & Local Heritage Blog
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed font-medium">
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
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition shrink-0 shadow-sm ${
                  activeCategory === cat
                    ? 'bg-amber-400 text-slate-950 border-amber-400 font-bold shadow-md'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
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
              className="w-full bg-white border border-slate-300 rounded-full pl-9 pr-4 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-400 shadow-sm"
            />
          </div>
        </div>

        {/* Blog Post Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <article
              key={post.id}
              className="bg-white border border-slate-200 rounded-3xl overflow-hidden hover:border-amber-400 transition flex flex-col justify-between group shadow-md hover:shadow-xl hover:-translate-y-1"
            >
              <div>
                <div className="relative h-48 overflow-hidden bg-slate-100">
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
                  <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-amber-900 border border-amber-300 text-[10px] font-extrabold px-3 py-1 rounded-full shadow-sm">
                    {post.category}
                  </span>
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-3 text-[11px] text-slate-500 font-medium">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-amber-600" /> {post.date}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-600" /> {post.readTime}
                    </span>
                  </div>

                  <h3 className="font-black text-base text-slate-950 group-hover:text-amber-700 transition leading-snug">
                    {post.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed font-medium">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-2 border-t border-slate-100 flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {post.tags.slice(0, 2).map((t, idx) => (
                    <span key={idx} className="text-[10px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 font-medium">
                      #{t}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => setSelectedPost(post)}
                  className="taxi-yellow-btn text-slate-950 text-xs font-black px-3.5 py-1.5 rounded-lg flex items-center gap-1 transition cursor-pointer shrink-0 border border-amber-400 font-syne uppercase tracking-wider"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-3xl w-full max-h-[90vh] shadow-2xl overflow-hidden flex flex-col text-slate-900">
            {/* Modal Header */}
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center shrink-0">
              <span className="text-xs font-black text-amber-800 uppercase tracking-wider">
                {selectedPost.category}
              </span>
              <button
                onClick={() => setSelectedPost(null)}
                className="text-slate-500 hover:text-slate-950 p-1 rounded-lg hover:bg-slate-200 cursor-pointer transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 text-slate-800">
              <div className="space-y-3">
                <div className="flex items-center gap-4 text-xs text-slate-500 font-medium">
                  <span>By {selectedPost.author}</span>
                  <span>•</span>
                  <span>{selectedPost.date}</span>
                  <span>•</span>
                  <span>{selectedPost.readTime}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-950 leading-tight">
                  {selectedPost.title}
                </h2>
              </div>

              <div className="rounded-2xl overflow-hidden h-64 border border-slate-200">
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

              <div className="space-y-4 text-sm leading-relaxed text-slate-700 font-normal">
                {selectedPost.content.map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>

              {/* CTA Box inside Blog Post */}
              <div className="bg-amber-50/80 border border-amber-300 rounded-2xl p-6 text-center space-y-3">
                <h4 className="font-black text-base text-slate-950">
                  Planning a Trip in Coimbatore or to Ooty / Isha Yoga?
                </h4>
                <p className="text-xs text-slate-600 max-w-lg mx-auto font-medium">
                  Get Taxi Kovai offers the lowest rates: Local rides at Base ₹80 + ₹28/km, One-way drop at ₹26/km, Outstation round trip at ₹15/km, and Airport drops at Base ₹100 + ₹30/km.
                </p>
                <div className="flex flex-wrap justify-center gap-3 pt-2">
                  <a
                    href="tel:+919043743777"
                    className="taxi-yellow-btn text-slate-950 font-black px-5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition shadow-sm border border-amber-400 font-syne uppercase tracking-wider"
                  >
                    <Phone className="w-4 h-4 fill-slate-950" /> Call 9043743777
                  </a>
                  <a
                    href="https://wa.me/919043743777?text=Hi%20Get%20Taxi%20Kovai,%20I%20read%20your%20blog%20and%20want%20to%20book%20a%20cab."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition shadow-sm"
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
