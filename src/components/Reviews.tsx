import React, { useState } from 'react';
import { Review } from '../types';
import { INITIAL_REVIEWS } from '../data/tariffs';
import { Star, ShieldCheck, UserCheck, MessageSquarePlus, CheckCircle2 } from 'lucide-react';

export const Reviews: React.FC = () => {
  const [reviewsList, setReviewsList] = useState<Review[]>(INITIAL_REVIEWS);
  const [showReviewForm, setShowReviewForm] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [tripTitle, setTripTitle] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !tripTitle || !comment) return;

    const newRev: Review = {
      id: `rev-${Date.now()}`,
      name,
      location: location || 'Coimbatore',
      rating,
      tripTitle,
      comment,
      date: 'Just now',
      verified: true,
    };

    setReviewsList([newRev, ...reviewsList]);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setShowReviewForm(false);
      setName('');
      setLocation('');
      setTripTitle('');
      setComment('');
    }, 2000);
  };

  return (
    <section id="reviews" className="py-16 bg-slate-900 text-white border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-400 border border-amber-500/30 px-3 py-1 rounded-full text-xs font-semibold mb-3">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              Real Passenger Feedback & Rating (4.9 / 5.0)
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Trusted by 50,000+ Travellers & Pilgrims
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Read what customers say about our punctuality, hill driving expertise, clean taxis, and zero hidden fare guarantee.
            </p>
          </div>

          <button
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="mt-4 md:mt-0 bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm flex items-center gap-2 transition cursor-pointer"
          >
            <MessageSquarePlus className="w-4 h-4" />
            <span>Write a Customer Review</span>
          </button>
        </div>

        {/* Optional Review Form */}
        {showReviewForm && (
          <div className="mb-10 bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-2xl">
            <h3 className="font-extrabold text-lg text-white mb-4">
              Share Your Experience with Covai Call Taxi
            </h3>

            {submitted ? (
              <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 p-4 rounded-xl flex items-center gap-3 text-sm">
                <CheckCircle2 className="w-5 h-5" />
                <span>Thank you! Your review has been published successfully.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh V"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Your City / Location
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. RS Puram, Coimbatore"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Trip Name / Route *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ooty 2-Day Family Trip"
                      value={tripTitle}
                      onChange={(e) => setTripTitle(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Star Rating
                    </label>
                    <select
                      value={rating}
                      onChange={(e) => setRating(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                    >
                      <option value={5}>⭐⭐⭐⭐⭐ (5 Stars - Excellent)</option>
                      <option value={4}>⭐⭐⭐⭐ (4 Stars - Good)</option>
                      <option value={3}>⭐⭐⭐ (3 Stars - Average)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Your Feedback *
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Describe how the driver, cab condition, and fare transparency was..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold px-6 py-2.5 rounded-xl text-xs sm:text-sm transition cursor-pointer"
                >
                  Post Review
                </button>
              </form>
            )}
          </div>
        )}

        {/* Reviews Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviewsList.map((rev) => (
            <div
              key={rev.id}
              className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-extrabold text-base text-white block">
                      {rev.name}
                    </span>
                    <span className="text-xs text-slate-400">{rev.location}</span>
                  </div>
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                </div>

                <div className="bg-slate-900/80 border border-slate-800 rounded-lg px-3 py-1.5 inline-block text-xs font-semibold text-amber-300">
                  🚖 {rev.tripTitle}
                </div>

                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed italic">
                  &ldquo;{rev.comment}&rdquo;
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-800/80 flex justify-between items-center text-[11px] text-slate-400">
                <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                  <UserCheck className="w-3.5 h-3.5" /> Verified Passenger
                </span>
                <span>{rev.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
