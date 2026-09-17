import React, { useState } from 'react';
import { VEHICLES } from '../data/locations';
import { TARIFF_POLICIES, FIXED_ROUTE_CARDS } from '../data/tariffs';
import { ShieldCheck, CheckCircle2, FileText, MapPin, Navigation, Phone, MessageSquare, Car, Sparkles, ArrowRight } from 'lucide-react';

export const TariffTable: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'popular-routes' | 'one-way' | 'round-trip' | 'local' | 'airport'>('popular-routes');

  return (
    <section id="tariffs" className="py-20 bg-[#060b16] text-white border-t border-slate-800/80 relative overflow-hidden">
      {/* Background Lighting & Night Atmosphere Ambient Gradients */}
      <div className="absolute top-1/4 left-1/3 w-[32rem] h-[32rem] bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[32rem] h-[32rem] bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Title & Section Intro */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 bg-slate-900/90 text-amber-300 border border-slate-800 px-3.5 py-1.5 rounded-full text-xs font-bold mb-3 shadow-md backdrop-blur-md">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Official Rate Card & Tariff Chart</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
            Fixed Route Cards & Fare Rules
          </h2>
          <p className="text-slate-300 text-sm mt-3 font-normal max-w-xl mx-auto">
            Explore our popular route distances, fixed route cards, and distance-based calculation rules. Transparent pricing with doorstep pickup across Coimbatore.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          <button
            onClick={() => setActiveTab('popular-routes')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold border transition cursor-pointer flex items-center gap-1.5 shadow-sm ${
              activeTab === 'popular-routes'
                ? 'bg-amber-400 text-slate-950 font-black border-amber-400 shadow-lg shadow-amber-400/20'
                : 'bg-slate-900/90 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Sparkles className={`w-3.5 h-3.5 ${activeTab === 'popular-routes' ? 'text-slate-950' : 'text-amber-400'}`} />
            <span>Popular Route Cards</span>
          </button>
          <button
            onClick={() => setActiveTab('one-way')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold border transition cursor-pointer shadow-sm ${
              activeTab === 'one-way'
                ? 'bg-amber-400 text-slate-950 font-black border-amber-400 shadow-lg shadow-amber-400/20'
                : 'bg-slate-900/90 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            Outstation One Way Drop
          </button>
          <button
            onClick={() => setActiveTab('round-trip')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold border transition cursor-pointer shadow-sm ${
              activeTab === 'round-trip'
                ? 'bg-amber-400 text-slate-950 font-black border-amber-400 shadow-lg shadow-amber-400/20'
                : 'bg-slate-900/90 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            Outstation Round Trip
          </button>
          <button
            onClick={() => setActiveTab('local')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold border transition cursor-pointer shadow-sm ${
              activeTab === 'local'
                ? 'bg-amber-400 text-slate-950 font-black border-amber-400 shadow-lg shadow-amber-400/20'
                : 'bg-slate-900/90 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            Hourly Rentals (Local Packages)
          </button>
          <button
            onClick={() => setActiveTab('airport')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold border transition cursor-pointer shadow-sm ${
              activeTab === 'airport'
                ? 'bg-amber-400 text-slate-950 font-black border-amber-400 shadow-lg shadow-amber-400/20'
                : 'bg-slate-900/90 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            Coimbatore Airport Drops
          </button>
        </div>

        {/* Tab 1: Popular Route Cards Grid */}
        {activeTab === 'popular-routes' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-14">
            {FIXED_ROUTE_CARDS.map((item) => (
              <div
                key={item.id}
                className="bg-white text-slate-900 border border-slate-200/90 rounded-2xl p-5 flex flex-col justify-between hover:border-amber-400 transition-all duration-300 shadow-2xl hover:shadow-amber-400/10 hover:-translate-y-1 group relative overflow-hidden"
              >
                <div>
                  {/* Top Badge: Distance + Price */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0">
                        <MapPin className="w-4 h-4 text-amber-600" />
                      </div>
                      <h3 className="font-bold text-base text-slate-950 group-hover:text-amber-600 transition-colors leading-tight">
                        {item.route}
                      </h3>
                    </div>
                  </div>

                  {/* Price & Distance Row */}
                  <div className="flex items-center justify-between bg-slate-50 border border-slate-200/80 rounded-xl px-3.5 py-2.5 mb-3">
                    <div className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold">
                      <Navigation className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span>{item.distance}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-500 block font-medium leading-none mb-0.5">Fixed Fare</span>
                      <span className="text-base font-black text-slate-950">
                        ₹{item.fare.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {/* Place Description */}
                  <p className="text-xs text-slate-600 font-normal leading-relaxed mb-3 line-clamp-3">
                    {item.description}
                  </p>

                  {/* Key Attractions Pills */}
                  {item.attractions && item.attractions.length > 0 && (
                    <div className="mb-4">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
                        Key Attractions:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {item.attractions.map((attr, idx) => (
                          <span
                            key={idx}
                            className="bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-medium px-2 py-0.5 rounded-md"
                          >
                            • {attr}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom CTA Actions */}
                <div className="pt-3 border-t border-slate-100 space-y-2">
                  <div className="text-[11px] font-semibold text-slate-700 text-center bg-slate-50 border border-slate-200/70 rounded-lg py-1">
                    Official Rate Card Price
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href="tel:+919043743777"
                      className="bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs py-2.5 px-2 rounded-xl flex items-center justify-center gap-1.5 transition shadow-sm"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call Now</span>
                    </a>
                    <a
                      href={`https://wa.me/919043743777?text=Hi%20Get%20Taxi%20Kovai,%20I%20want%20to%20book%20a%20cab%20for%20${encodeURIComponent(
                        item.route
                      )}%20(${encodeURIComponent(item.distance)}%20-%20%E2%82%B9${item.fare}).%20Please%20confirm%20booking.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs py-2.5 px-2 rounded-xl flex items-center justify-center gap-1.5 transition shadow-sm"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-slate-950" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Vehicle Tariff Table Display for Other Tabs */}
        {activeTab !== 'popular-routes' && (
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm mb-14">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-900 text-white border-b border-slate-800 font-bold uppercase tracking-wider text-[11px]">
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
                <tbody className="divide-y divide-slate-100 text-slate-800 font-normal">
                  {activeTab === 'local' ? (
                    <>
                      {/* Hatchback & Sedan Combined Row */}
                      <tr className="hover:bg-slate-50/80 transition">
                        <td className="p-4 font-bold text-slate-950 flex items-center gap-2">
                          <Car className="w-4 h-4 text-slate-700 shrink-0" />
                          <span>Hatchback / Sedan (AC)</span>
                        </td>
                        <td className="p-4 text-slate-600 text-xs">Swift, WagonR, Dzire, Etios, Ritz</td>
                        <td className="p-4 font-semibold text-slate-700">4 Passengers</td>
                        <td className="p-4 font-semibold text-slate-900">₹1,450</td>
                        <td className="p-4 font-bold text-slate-950">₹2,850</td>
                        <td className="p-4 font-semibold text-slate-900">₹4,250</td>
                        <td className="p-4 text-slate-700 text-xs font-medium">
                          ₹375 (1st 2 hrs) + ₹350/hr
                        </td>
                      </tr>

                      {/* 6-Seater Family SUV Row */}
                      <tr className="hover:bg-slate-50/80 transition">
                        <td className="p-4 font-bold text-slate-950 flex items-center gap-2">
                          <Car className="w-4 h-4 text-slate-700 shrink-0" />
                          <span>6-Seater Family SUV</span>
                        </td>
                        <td className="p-4 text-slate-600 text-xs">Maruti Ertiga, Mahindra Xylo, Lodgy</td>
                        <td className="p-4 font-semibold text-slate-700">6 Passengers</td>
                        <td className="p-4 font-bold text-slate-900">Call for Best Price</td>
                        <td className="p-4 font-bold text-slate-900">Call for Best Price</td>
                        <td className="p-4 font-bold text-slate-900">Call for Best Price</td>
                        <td className="p-4 text-slate-900 text-xs font-semibold">
                          <a href="tel:+919043743777" className="hover:underline flex items-center gap-1 text-slate-950 font-bold">
                            <Phone className="w-3.5 h-3.5 text-slate-800" /> 9043743777
                          </a>
                        </td>
                      </tr>

                      {/* Premium Innova Crysta Row */}
                      <tr className="hover:bg-slate-50/80 transition">
                        <td className="p-4 font-bold text-slate-950 flex items-center gap-2">
                          <Car className="w-4 h-4 text-slate-700 shrink-0" />
                          <span>Premium Innova Crysta</span>
                        </td>
                        <td className="p-4 text-slate-600 text-xs">Toyota Innova Crysta AC</td>
                        <td className="p-4 font-semibold text-slate-700">7 Passengers</td>
                        <td className="p-4 font-bold text-slate-900">Call for Best Price</td>
                        <td className="p-4 font-bold text-slate-900">Call for Best Price</td>
                        <td className="p-4 font-bold text-slate-900">Call for Best Price</td>
                        <td className="p-4 text-slate-900 text-xs font-semibold">
                          <a href="tel:+919043743777" className="hover:underline flex items-center gap-1 text-slate-950 font-bold">
                            <Phone className="w-3.5 h-3.5 text-slate-800" /> 9043743777
                          </a>
                        </td>
                      </tr>
                    </>
                  ) : (
                    VEHICLES.map((v) => (
                      <tr key={v.id} className="hover:bg-slate-50/80 transition">
                        <td className="p-4 font-bold text-slate-950 flex items-center gap-2">
                          <Car className="w-4 h-4 text-slate-700 shrink-0" />
                          <span>{v.name}</span>
                        </td>
                        <td className="p-4 text-slate-600 text-xs">{v.models}</td>
                        <td className="p-4 font-semibold text-slate-700">{v.passengers} Passengers</td>

                        {activeTab === 'one-way' && (
                          <>
                            <td className="p-4 font-bold text-slate-950">Fixed Distance Rate</td>
                            <td className="p-4 font-medium text-slate-700">{v.minKmOneWay} KM</td>
                            <td className="p-4 font-medium text-slate-600">Included in Quote</td>
                          </>
                        )}

                        {activeTab === 'round-trip' && (
                          <>
                            <td className="p-4 font-bold text-slate-950">Standard Mileage Rate</td>
                            <td className="p-4 font-medium text-slate-700">{v.minKmRoundTripPerDay} KM/day</td>
                            <td className="p-4 font-medium text-slate-600">Included in Quote</td>
                          </>
                        )}

                        {activeTab === 'airport' && (
                          <>
                            <td className="p-4 font-medium text-slate-800">Coimbatore City Drop</td>
                            <td className="p-4 font-medium text-slate-800">TIDEL Park Transfer</td>
                            <td className="p-4 font-medium text-slate-800">Isha Adiyogi Transfer</td>
                            <td className="p-4 font-medium text-slate-800">Nilgiris Mountain Drop</td>
                          </>
                        )}
                      </tr>
                    ))
                  )}
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
              className="bg-white text-slate-900 border border-slate-200/90 rounded-2xl p-6 space-y-3 shadow-xl hover:shadow-2xl hover:border-amber-400 transition-all duration-300"
            >
              <h4 className="font-bold text-sm text-slate-950 flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-600" />
                <span>{policy.title}</span>
              </h4>
              <ul className="space-y-2.5 text-xs text-slate-600 font-normal">
                {policy.points.map((pt, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
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
