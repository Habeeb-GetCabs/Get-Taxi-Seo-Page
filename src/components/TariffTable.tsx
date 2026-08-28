import React, { useState } from 'react';
import { VEHICLES } from '../data/locations';
import { TARIFF_POLICIES, FIXED_ROUTE_CARDS } from '../data/tariffs';
import { ShieldCheck, CheckCircle2, FileText, MapPin, Navigation, Phone, MessageSquare, Car, Sparkles } from 'lucide-react';

export const TariffTable: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'popular-routes' | 'one-way' | 'round-trip' | 'local' | 'airport'>('popular-routes');

  return (
    <section id="tariffs" className="py-16 bg-zinc-950 text-white border-t border-zinc-800 relative">
      <div className="max-w-7xl mx-auto px-4">
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 bg-amber-400/10 text-amber-300 border border-amber-400/30 px-3.5 py-1.5 rounded-full text-xs font-extrabold mb-3 shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            Official Rate Card & Tariff Chart
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            Fixed Route Cards & Fare Rules
          </h2>
          <p className="text-zinc-400 text-sm mt-2 font-medium">
            Explore our popular route distances, fixed route cards, and distance-based round trip calculation rules. Guaranteed doorstep pickup in 15 minutes across Coimbatore.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <button
            onClick={() => setActiveTab('popular-routes')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold border transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'popular-routes'
                ? 'bg-amber-400 text-zinc-950 border-amber-400 shadow-lg shadow-amber-500/20 scale-105'
                : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Popular Route Cards
          </button>
          <button
            onClick={() => setActiveTab('one-way')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold border transition cursor-pointer ${
              activeTab === 'one-way'
                ? 'bg-amber-400 text-zinc-950 border-amber-400 shadow-lg shadow-amber-500/20 scale-105'
                : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800'
            }`}
          >
            Outstation One Way Drop
          </button>
          <button
            onClick={() => setActiveTab('round-trip')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold border transition cursor-pointer ${
              activeTab === 'round-trip'
                ? 'bg-amber-400 text-zinc-950 border-amber-400 shadow-lg shadow-amber-500/20 scale-105'
                : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800'
            }`}
          >
            Outstation Round Trip
          </button>
          <button
            onClick={() => setActiveTab('local')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold border transition cursor-pointer ${
              activeTab === 'local'
                ? 'bg-amber-400 text-zinc-950 border-amber-400 shadow-lg shadow-amber-500/20 scale-105'
                : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800'
            }`}
          >
            Local City Packages
          </button>
          <button
            onClick={() => setActiveTab('airport')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold border transition cursor-pointer ${
              activeTab === 'airport'
                ? 'bg-amber-400 text-zinc-950 border-amber-400 shadow-lg shadow-amber-500/20 scale-105'
                : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800'
            }`}
          >
            Coimbatore Airport Drops
          </button>
        </div>

        {/* Tab 1: Popular Route Cards Grid */}
        {activeTab === 'popular-routes' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-12">
            {FIXED_ROUTE_CARDS.map((item) => (
              <div
                key={item.id}
                className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 flex flex-col justify-between hover:border-amber-400/60 transition-all duration-300 shadow-xl group hover:-translate-y-1 relative overflow-hidden"
              >
                <div>
                  {/* Top Badge: Distance + Price */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center shrink-0">
                        <MapPin className="w-4 h-4 text-amber-400" />
                      </div>
                      <h3 className="font-black text-base text-white group-hover:text-amber-300 transition-colors leading-tight">
                        {item.route}
                      </h3>
                    </div>
                  </div>

                  {/* Price & Distance Row */}
                  <div className="flex items-center justify-between bg-zinc-950/90 border border-zinc-800 rounded-xl px-3.5 py-2.5 mb-3">
                    <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-bold">
                      <Navigation className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{item.distance}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-zinc-400 block font-medium leading-none mb-0.5">Fixed Rate</span>
                      <span className="text-base font-black text-amber-400">
                        ₹{item.fare.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {/* Place Description */}
                  <p className="text-xs text-zinc-300 font-normal leading-relaxed mb-3 line-clamp-3">
                    {item.description}
                  </p>

                  {/* Key Attractions Pills */}
                  {item.attractions && item.attractions.length > 0 && (
                    <div className="mb-4">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400/90 block mb-1.5">
                        Key Attractions & Highlights:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {item.attractions.map((attr, idx) => (
                          <span
                            key={idx}
                            className="bg-zinc-950 text-zinc-300 border border-zinc-800 text-[10px] font-semibold px-2 py-0.5 rounded-md"
                          >
                            • {attr}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom CTA Actions */}
                <div className="pt-3 border-t border-zinc-800/80 space-y-2.5">
                  <div className="text-[11px] font-bold text-emerald-400 text-center bg-emerald-500/10 border border-emerald-500/20 rounded-lg py-1">
                    ✓ Guaranteed Rate Card Price
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href="tel:+919043743777"
                      className="bg-amber-400 hover:bg-amber-300 text-zinc-950 font-black text-xs py-2.5 px-2 rounded-xl flex items-center justify-center gap-1 transition shadow-md"
                    >
                      <Phone className="w-3.5 h-3.5 fill-zinc-950" /> Call
                    </a>
                    <a
                      href={`https://wa.me/919043743777?text=Hi%20Get%20Taxi%20Kovai,%20I%20want%20to%20book%20a%20cab%20for%20${encodeURIComponent(
                        item.route
                      )}%20(${encodeURIComponent(item.distance)}%20-%20%E2%82%B9${item.fare}).%20Please%20confirm%20booking.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs py-2.5 px-2 rounded-xl flex items-center justify-center gap-1 transition shadow-md"
                    >
                      <MessageSquare className="w-3.5 h-3.5 fill-white/20" /> WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Vehicle Tariff Table Display for Other Tabs */}
        {activeTab !== 'popular-routes' && (
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl mb-12">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-zinc-950 text-amber-400 border-b border-zinc-800 font-extrabold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="p-4">Vehicle Category</th>
                    <th className="p-4">Models</th>
                    <th className="p-4">Seats</th>
                    {activeTab === 'one-way' && (
                      <>
                        <th className="p-4">Rate Structure</th>
                        <th className="p-4">Min. Distance</th>
                        <th className="p-4">Driver Batta</th>
                      </>
                    )}
                    {activeTab === 'round-trip' && (
                      <>
                        <th className="p-4">Rate Structure</th>
                        <th className="p-4">Min. Distance / Day</th>
                        <th className="p-4">Driver Batta / Day</th>
                      </>
                    )}
                    {activeTab === 'local' && (
                      <>
                        <th className="p-4">4 Hrs / 40 KM</th>
                        <th className="p-4">8 Hrs / 80 KM</th>
                        <th className="p-4">12 Hrs / 120 KM</th>
                        <th className="p-4">Extra KM / Hour Rate</th>
                      </>
                    )}
                    {activeTab === 'airport' && (
                      <>
                        <th className="p-4">City Center Drop</th>
                        <th className="p-4">Peelamedu / TIDEL</th>
                        <th className="p-4">Isha Foundation Drop</th>
                        <th className="p-4">Ooty Airport Drop</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/80 text-zinc-200 font-medium">
                  {VEHICLES.map((v) => (
                    <tr key={v.id} className="hover:bg-zinc-950/60 transition">
                      <td className="p-4 font-black text-white flex items-center gap-2">
                        <Car className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>{v.name}</span>
                      </td>
                      <td className="p-4 text-zinc-400 text-xs">{v.models}</td>
                      <td className="p-4 font-bold text-zinc-300">{v.passengers} Passengers</td>

                      {activeTab === 'one-way' && (
                        <>
                          <td className="p-4 font-black text-amber-400">Guaranteed Lowest Rate</td>
                          <td className="p-4 font-bold">{v.minKmOneWay} KM</td>
                          <td className="p-4 font-bold text-zinc-300">Included in Quote</td>
                        </>
                      )}

                      {activeTab === 'round-trip' && (
                        <>
                          <td className="p-4 font-black text-amber-400">Standard Round Trip Mileage</td>
                          <td className="p-4 font-bold">{v.minKmRoundTripPerDay} KM/day</td>
                          <td className="p-4 font-bold text-zinc-300">Included in Quote</td>
                        </>
                      )}

                      {activeTab === 'local' && (
                        <>
                          <td className="p-4 font-bold text-zinc-200">4 Hours / 40 KM Package</td>
                          <td className="p-4 font-black text-amber-400">8 Hours / 80 KM Package</td>
                          <td className="p-4 font-bold text-zinc-200">12 Hours / 120 KM Package</td>
                          <td className="p-4 text-zinc-400 text-xs font-semibold">Standard City Hourly Rate</td>
                        </>
                      )}

                      {activeTab === 'airport' && (
                        <>
                          <td className="p-4 font-bold text-amber-400">Coimbatore City Drop</td>
                          <td className="p-4 font-bold text-zinc-200">TIDEL Park Transfer</td>
                          <td className="p-4 font-bold text-amber-400">Isha Adiyogi Transfer</td>
                          <td className="p-4 font-bold text-zinc-200">Nilgiris Mountain Drop</td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Distance-Based Round Trip & Long Drop Rules / Policy Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {TARIFF_POLICIES.map((policy, idx) => (
            <div
              key={idx}
              className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 space-y-3 shadow-xl hover:border-amber-400/40 transition"
            >
              <h4 className="font-black text-sm text-amber-400 flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-400" />
                {policy.title}
              </h4>
              <ul className="space-y-2.5 text-xs text-zinc-300 font-medium">
                {policy.points.map((pt, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
