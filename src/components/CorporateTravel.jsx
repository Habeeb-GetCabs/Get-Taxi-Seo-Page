import React from 'react';
import {
  FileText,
  UserCheck,
  Car,
  Phone,
  MessageSquare,
  CheckCircle2,
  Building2,
  Plane,
  Briefcase,
  ShieldCheck,
  ChevronRight,
  ArrowRight
} from 'lucide-react';

/**
 * CorporateTravel Component
 * Highlights executive cab rentals and outstation B2B travel with 100% transparent pricing and GST invoicing.
 */
export const CorporateTravel = ({ onBookCorporate = undefined }) => {
  const corporateWhatsAppMsg = encodeURIComponent(
    'Hi Get Taxi Kovai, I need a corporate travel quotation.'
  );

  const valueCards = [
    {
      id: 'gst-invoicing',
      icon: FileText,
      title: 'GST Tax Invoicing',
      description:
        'Automated compliant digital bills and monthly consolidated statements for hassle-free business expense claims and input tax credit (ITC).',
      badge: '100% Tax Compliant',
    },
    {
      id: 'direct-driver',
      icon: UserCheck,
      title: 'Dedicated Direct Driver',
      description:
        'Zero call center delays. Direct chauffeur coordination, flight delay tracking, and priority doorstep reporting on every corporate itinerary.',
      badge: 'Priority Chauffeur',
    },
    {
      id: 'maintained-fleet',
      icon: Car,
      title: 'Well-Maintained AC Sedans',
      description:
        'Pristine, commercial yellow-plated Swift DZire and executive sedans equipped with powerful AC, sanitized cabins, and mobile chargers.',
      badge: 'Executive Comfort',
    },
  ];

  const pricingMatrix = [
    {
      id: 'local-rental',
      title: 'Local Executive Rental',
      tagline: 'Multi-Stop City Itinerary',
      price: '₹2,400',
      period: '8 Hours / 80 Kms',
      overageRules: [
        'Extra Distance: ₹14/km',
        'Extra Duration: ₹150/hr',
        'Fuel & Chauffeur Included',
        'Zero Peak Surge Surcharges',
      ],
      idealFor: 'Audit visits, factory inspections, textile park & IT corridor client meetings.',
      popular: false,
    },
    {
      id: 'airport-transfer',
      title: 'Airport Executive Transfer',
      tagline: 'CJB Terminal Pickup / Drop',
      price: 'Fixed Zone Tariff',
      period: 'Point-to-Point Terminal Chauffeur',
      overageRules: [
        'Complimentary Live Flight Tracking',
        '45-Minute Buffer Waiting at Terminal',
        'Nameboard Greeting at CJB Arrival',
        'All Tolls & Parking at Actuals',
      ],
      idealFor: 'Visiting CXOs, foreign delegates, keynote speakers, and executive executives.',
      popular: true,
    },
    {
      id: 'outstation-trip',
      title: 'Outstation Business Trip',
      tagline: 'Inter-District Industrial Mobility',
      price: '₹13 – ₹14/km',
      period: 'Round-Trip Commercial Tariff',
      overageRules: [
        'Minimum Billing: 250 km / Day',
        'Chauffeur Night Bata: ₹400 / Day',
        'Highway Toll & Parking at Actuals',
        'Clean Sanitized Commercial Fleet',
      ],
      idealFor: 'Corporate plant visits to Tirupur, Erode, Salem, Karur, Bangalore, or Chennai.',
      popular: false,
    },
  ];

  return (
    <section
      id="corporate"
      aria-labelledby="corporate-heading"
      className="py-16 sm:py-20 bg-slate-900 text-white relative overflow-hidden border-t border-slate-800"
    >
      {/* Subtle Background Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 bg-amber-400/10 border border-amber-400/30 text-amber-300 px-3.5 py-1.5 rounded-full text-xs font-black tracking-wide uppercase mb-4 shadow-sm">
            <Building2 className="w-3.5 h-3.5 text-amber-400" />
            <span>Corporate & Executive Travel Solutions</span>
          </div>

          <h2
            id="corporate-heading"
            className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight mb-4"
          >
            Corporate & Executive <span className="text-amber-400">Travel Solutions</span>
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
            Punctual Coimbatore airport transfers, textile mill inspections, and inter-city client visits with 100% transparent pricing, formal GST invoicing, and zero hidden charges.
          </p>
        </div>

        {/* 3 Core Value Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
          {valueCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 hover:border-amber-400/50 transition-all duration-200 hover:shadow-xl hover:shadow-amber-500/5 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold text-amber-400/90 bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/20">
                      {card.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2 tracking-tight group-hover:text-amber-300 transition-colors">
                    {card.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                    {card.description}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-700/50 flex items-center gap-2 text-xs font-semibold text-slate-400">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Verified B2B Service Standard</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pricing Matrix (Responsive Grid / Cards) */}
        <div className="mb-14">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Transparent Corporate Rate Card
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Zero surge pricing, GST billing invoices, and clear per-km overage policies.
              </p>
            </div>
            <span className="text-xs text-slate-400 mt-2 sm:mt-0 font-medium">
              *Toll, interstate permit & parking charged at exact government receipts.
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {pricingMatrix.map((item) => (
              <div
                key={item.id}
                className={`relative rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-200 ${
                  item.popular
                    ? 'bg-slate-800/95 border-2 border-amber-400 shadow-xl shadow-amber-500/10'
                    : 'bg-slate-800/60 border border-slate-700/80 hover:border-slate-600'
                }`}
              >
                {item.popular && (
                  <div className="absolute -top-3 left-6 bg-amber-400 text-slate-950 text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                    Most Requested
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wide">
                      {item.tagline}
                    </span>
                  </div>

                  <h4 className="text-lg font-bold text-white mb-2">{item.title}</h4>

                  <div className="mb-4">
                    <div className="text-2xl sm:text-3xl font-black text-amber-400">
                      {item.price}
                    </div>
                    <div className="text-xs text-slate-400 font-medium mt-0.5">
                      {item.period}
                    </div>
                  </div>

                  {/* Rules & Inclusions */}
                  <div className="space-y-2.5 pt-4 border-t border-slate-700/60 mb-5">
                    {item.overageRules.map((rule, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <span>{rule}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="bg-slate-900/60 rounded-xl p-3 border border-slate-700/40 text-[11px] text-slate-300 mb-5">
                    <strong className="text-slate-200">Recommended For:</strong> {item.idealFor}
                  </div>

                  <a
                    href={`https://wa.me/919043743777?text=${corporateWhatsAppMsg}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-conversion-intent="whatsapp"
                    aria-label={`Book or inquire about ${item.title} on WhatsApp`}
                    className={`w-full py-2.5 px-4 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition cursor-pointer ${
                      item.popular
                        ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-md'
                        : 'bg-slate-700 hover:bg-slate-600 text-white border border-slate-600'
                    }`}
                  >
                    <span>Request Corporate Quote</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Banner / Trigger */}
        <div className="bg-gradient-to-r from-amber-500/15 via-slate-800 to-slate-800 border border-amber-400/30 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 text-amber-400 text-xs font-black uppercase tracking-wider mb-1">
              <Briefcase className="w-4 h-4" />
              <span>Need Monthly Fleet Billing or Dedicated Dispatch?</span>
            </div>
            <h4 className="text-lg sm:text-xl font-bold text-white">
              Instant Corporate Rates & GST Quotations
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              Get an itemized commercial proposal within 15 minutes. We support electronic billing, daily driver logs, and direct corporate bank transfers.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <a
              href={`https://wa.me/919043743777?text=${corporateWhatsAppMsg}`}
              target="_blank"
              rel="noopener noreferrer"
              data-conversion-intent="whatsapp"
              aria-label="Request a corporate travel quotation on WhatsApp"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm shadow-md transition active:scale-95 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp Quotation</span>
            </a>

            <a
              href="tel:+919043743777"
              data-conversion-intent="call"
              aria-label="Call Get Taxi Kovai corporate desk at 9043743777"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm shadow-md transition active:scale-95 cursor-pointer"
            >
              <Phone className="w-4 h-4 fill-slate-950" />
              <span>Call 9043743777</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CorporateTravel;
