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
    <section id="reviews" className="py-16 bg-slate-50 text-slate-900 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 border border-amber-300 px-3.5 py-1.5 rounded-full text-xs font-bold mb-3 shadow-sm">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-600" />
              Real Passenger Feedback & Rating (4.9 / 5.0)
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950">
              Trusted by 50,000+ Travellers & Pilgrims
            </h2>
            <p className="text-slate-600 text-sm mt-1 font-medium">
              Read what customers say about our punctuality, hill driving expertise, clean taxis, and zero hidden fare guarantee.
            </p>
          </div>

          <button
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="mt-4 md:mt-0 taxi-yellow-btn text-slate-950 font-black px-5 py-2.5 rounded-xl text-xs sm:text-sm flex items-center gap-2 transition cursor-pointer shadow-sm border border-amber-400 font-syne uppercase tracking-wider"
          >
            <MessageSquarePlus className="w-4 h-4" />
            <span>Write a Customer Review</span>
          </button>
        </div>

        {/* Optional Review Form */}
        {showReviewForm && (
          <div className="mb-10 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl">
            <h3 className="font-black text-lg text-slate-950 mb-4">
              Share Your Experience with Covai Call Taxi
            </h3>

            {submitted ? (
              <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-4 rounded-2xl flex items-center gap-3 text-sm font-bold">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Thank you! Your review has been published successfully.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-900 block mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh V"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-amber-400 focus:bg-white transition"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-900 block mb-1">
                      Your City / Location
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. RS Puram, Coimbatore"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-amber-400 focus:bg-white transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-900 block mb-1">
                      Trip Name / Route *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ooty 2-Day Family Trip"
                      value={tripTitle}
                      onChange={(e) => setTripTitle(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-amber-400 focus:bg-white transition"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-900 block mb-1">
                      Star Rating
                    </label>
                    <select
                      value={rating}
                      onChange={(e) => setRating(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-amber-400 focus:bg-white transition"
                    >
                      <option value={5}>⭐⭐⭐⭐⭐ (5 Stars - Excellent)</option>
                      <option value={4}>⭐⭐⭐⭐ (4 Stars - Good)</option>
                      <option value={3}>⭐⭐⭐ (3 Stars - Average)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-900 block mb-1">
                    Your Feedback *
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Describe how the driver, cab condition, and fare transparency was..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-amber-400 focus:bg-white transition"
                  />
                </div>

                <button
                  type="submit"
                  className="taxi-yellow-btn text-slate-950 font-black px-6 py-2.5 rounded-xl text-xs sm:text-sm transition cursor-pointer border border-amber-400 font-syne uppercase tracking-wider"
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
              className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-md hover:shadow-lg transition flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-black text-base text-slate-950 block">
                      {rev.name}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">{rev.location}</span>
                  </div>
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-500" />
                    ))}
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-xl px-3 py-1.5 inline-block text-xs font-bold text-amber-900">
                  🚖 {rev.tripTitle}
                </div>

                <p className="text-slate-700 text-xs sm:text-sm leading-relaxed italic font-normal">
                  &ldquo;{rev.comment}&rdquo;
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex justify-between items-center text-[11px] text-slate-500 font-medium">
                <span className="flex items-center gap-1 text-emerald-700 font-bold">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-600" /> Verified Passenger
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
