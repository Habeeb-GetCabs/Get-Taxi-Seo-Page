import fs from 'fs';
import path from 'path';
import { SITE_URL, PHONE_NUMBER, PHONE_DISPLAY, PHONE_HREF, WHATSAPP_URL, generateHtmlPage } from './build-static-site.js';

const ROOT_DIR = process.cwd();

// ==========================================
// 1. PRIVACY POLICY (privacy.html)
// ==========================================
export function generatePrivacyPage() {
  const bodyContent = `
  <section class="bg-slate-900 text-white py-14 border-b border-slate-800">
    <div class="max-w-4xl mx-auto px-4 sm:px-6">
      <div class="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2">
        <a href="index.html" class="hover:underline">Home</a>
        <span>/</span>
        <span>Legal Documentation</span>
      </div>
      <h1 class="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white mb-3">
        Privacy Policy
      </h1>
      <p class="text-sm sm:text-base text-slate-300">
        Effective Date: January 1, 2026 | Last Updated: September 2026 | Official Policy for <strong>gettaxikovai.in</strong>
      </p>
    </div>
  </section>

  <section class="py-14 bg-white text-slate-800">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 space-y-8 text-sm sm:text-base leading-relaxed">
      <div class="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-slate-800">
        <h2 class="text-base font-black text-amber-950 mb-1">Commitment to Passenger Confidentiality</h2>
        <p class="text-xs sm:text-sm text-slate-700">
          Get Taxi Kovai operates the website <strong>https://gettaxikovai.in</strong> and provides passenger transportation and cab dispatch services across Coimbatore, Nilgiris, and South India. We respect your personal privacy and handle your ride bookings with strict confidentiality.
        </p>
      </div>

      <div>
        <h2 class="text-xl font-bold text-slate-950 mb-3">1. Information We Collect</h2>
        <p class="mb-3">When you request a cab booking through our online calculator, phone hotline, or WhatsApp booking channel, we collect only the information necessary to fulfill your journey safely and efficiently:</p>
        <ul class="list-disc pl-6 space-y-2 text-slate-700">
          <li><strong>Contact Details:</strong> Passenger full name, mobile telephone number, and email address (if provided for invoice dispatch).</li>
          <li><strong>Journey Information:</strong> Doorstep pickup address, destination address, scheduled pickup date, time, and trip category (Local Hourly, Airport Transfer, One-Way Drop, Outstation Round Trip).</li>
          <li><strong>Vehicle Preference:</strong> Selected car category (Hatchback, Prime Sedan, Family SUV, Innova Crysta, or Tempo Traveller).</li>
          <li><strong>Special Instructions:</strong> Flight numbers, luggage requirements, or specific landmark notes shared voluntarily by you.</li>
        </ul>
      </div>

      <div>
        <h2 class="text-xl font-bold text-slate-950 mb-3">2. How We Use Your Information</h2>
        <p class="mb-3">We use your data solely for operational transportation purposes:</p>
        <ul class="list-disc pl-6 space-y-2 text-slate-700">
          <li>Dispatching the nearest verified driver to your pickup location within Coimbatore.</li>
          <li>Sending automated SMS, phone call, or WhatsApp confirmations with driver contact details and vehicle registration numbers.</li>
          <li>Calculating distance-based transparent fare estimates and issuing digital trip receipts upon journey completion.</li>
          <li>Customer support assistance, lost-and-found inquiries, and post-ride feedback.</li>
        </ul>
      </div>

      <div>
        <h2 class="text-xl font-bold text-slate-950 mb-3">3. Zero Third-Party Data Sharing & Advertising</h2>
        <p class="text-slate-700">
          Get Taxi Kovai <strong>never sells, rents, leases, or trades</strong> your personal phone numbers or ride history to third-party telemarketers or advertisers. Your phone number is shared strictly with the assigned driver solely for pickup coordination.
        </p>
      </div>

      <div>
        <h2 class="text-xl font-bold text-slate-950 mb-3">4. Payment Security & Financial Data</h2>
        <p class="text-slate-700">
          Get Taxi Kovai operates on a <strong>Zero Advance Required</strong> policy for standard bookings. You pay the exact metered or quoted trip fare directly to the driver via Cash or UPI (Google Pay, PhonePe, Paytm, BHIM) upon trip completion. We do not collect or store credit card numbers, debit card PINs, or banking passwords on <strong>gettaxikovai.in</strong>.
        </p>
      </div>

      <div>
        <h2 class="text-xl font-bold text-slate-950 mb-3">5. Cookies & Technical Analytics</h2>
        <p class="text-slate-700">
          Our website uses standard technical cookies and Google Analytics scripts to measure page load performance, understand user navigation patterns, and improve site reliability. These cookies do not store personally identifiable financial information. You may disable cookies in your web browser settings at any time without impacting your ability to book a cab by calling our hotline.
        </p>
      </div>

      <div>
        <h2 class="text-xl font-bold text-slate-950 mb-3">6. Data Retention & Passenger Rights</h2>
        <p class="text-slate-700">
          Trip records are retained in compliance with local commercial transport regulations for safety and accounting audits. You may contact us at any time to request a copy of your billing receipts or request deletion of historical contact records from our booking database.
        </p>
      </div>

      <div class="border-t border-slate-200 pt-6">
        <h2 class="text-xl font-bold text-slate-950 mb-3">7. Contact the Privacy Officer</h2>
        <p class="mb-3 text-slate-700">If you have inquiries regarding this privacy policy or our data practices, please reach out directly:</p>
        <div class="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs sm:text-sm space-y-1.5">
          <p><strong>Get Taxi Kovai</strong></p>
          <p>Cross Cut Road, Gandhipuram, Coimbatore, Tamil Nadu 641012, India</p>
          <p>Telephone: <a href="${PHONE_HREF}" data-conversion-intent="call" class="text-amber-600 font-bold hover:underline">+91 ${PHONE_DISPLAY}</a></p>
          <p>Email: <a href="mailto:booking@gettaxikovai.in" class="text-amber-600 font-bold hover:underline">booking@gettaxikovai.in</a></p>
          <p>Official Website: <a href="https://gettaxikovai.in" class="text-amber-600 font-bold hover:underline">https://gettaxikovai.in</a></p>
        </div>
      </div>
    </div>
  </section>
  `;

  return generateHtmlPage({
    title: 'Privacy Policy | Get Taxi Kovai - Coimbatore Call Taxi',
    description: 'Privacy Policy of Get Taxi Kovai (gettaxikovai.in). Learn how we protect your personal information, booking details, and payment safety for taxi services in Coimbatore.',
    keywords: 'privacy policy get taxi kovai, cab booking privacy, passenger data protection coimbatore taxi, gettaxikovai.in terms',
    canonicalUrl: `${SITE_URL}/privacy.html`,
    activeNav: '',
    bodyContent,
  });
}

// ==========================================
// 2. TERMS & CONDITIONS (terms.html)
// ==========================================
export function generateTermsPage() {
  const bodyContent = `
  <section class="bg-slate-900 text-white py-14 border-b border-slate-800">
    <div class="max-w-4xl mx-auto px-4 sm:px-6">
      <div class="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2">
        <a href="index.html" class="hover:underline">Home</a>
        <span>/</span>
        <span>Legal Documentation</span>
      </div>
      <h1 class="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white mb-3">
        Terms & Conditions
      </h1>
      <p class="text-sm sm:text-base text-slate-300">
        Effective Date: January 1, 2026 | Last Updated: September 2026 | Service Guidelines for <strong>gettaxikovai.in</strong>
      </p>
    </div>
  </section>

  <section class="py-14 bg-white text-slate-800">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 space-y-8 text-sm sm:text-base leading-relaxed">
      <div class="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-slate-800">
        <h2 class="text-base font-black text-amber-950 mb-1">Standard Transportation Contract</h2>
        <p class="text-xs sm:text-sm text-slate-700">
          By booking a ride through <strong>https://gettaxikovai.in</strong>, our call center hotline (+91 9043743777), or official WhatsApp channel, you agree to the following terms and operational guidelines governing cab rental and chauffeur services.
        </p>
      </div>

      <div>
        <h2 class="text-xl font-bold text-slate-950 mb-3">1. Scope of Taxi Services</h2>
        <p class="mb-3">Get Taxi Kovai provides on-demand and scheduled passenger vehicle dispatch services including:</p>
        <ul class="list-disc pl-6 space-y-2 text-slate-700">
          <li><strong>Local City Rides:</strong> Short trips within Coimbatore city limits starting at base fare ₹80 + ₹28/km.</li>
          <li><strong>Hourly Car Rentals:</strong> Chauffeur-driven packages at flat ₹350/hr with 10 km free per hour (additional km billed per standard category rate).</li>
          <li><strong>Airport Transfers:</strong> 24/7 dedicated terminal drop and pickup at Coimbatore International Airport (CJB) starting at ₹100 base.</li>
          <li><strong>One-Way Drop Taxi:</strong> Direct inter-city transfers to Chennai, Bangalore, Salem, Erode, Tiruppur, Madurai, Trichy, etc., billed at ₹14–₹26/km.</li>
          <li><strong>Outstation Round Trips & Hill Tours:</strong> Comprehensive holiday packages to Ooty, Coonoor, Kodaikanal, Valparai, Munnar, Palani, and Thanjavur at ₹13–₹15/km with daily driver bata (₹400–₹500/day).</li>
        </ul>
      </div>

      <div>
        <h2 class="text-xl font-bold text-slate-950 mb-3">2. Transparent Pricing Disclosures & Tariff Rules</h2>
        <div class="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 mb-4 text-xs sm:text-sm">
          <p><strong>Published Rate Card Standards:</strong></p>
          <p>• <strong>Round-Trip Cabs:</strong> From ₹13/km (Hatchback) to ₹15/km (Sedan) / ₹18/km (SUV) / ₹24/km (Innova Crysta). Minimum 250 km billed per calendar day.</p>
          <p>• <strong>One-Way Drop Cabs:</strong> From ₹14–₹26/km (Sedan flat ₹15/km). Minimum 130 km billed for outstation drop journeys.</p>
          <p>• <strong>Hourly City Rental:</strong> ₹350/hr with 10 km included per hour.</p>
        </div>
        <ul class="list-disc pl-6 space-y-2 text-slate-700">
          <li><strong>Tolls & Parking:</strong> National Highway toll plaza charges, airport parking fees, and state border tourist permit taxes are not included in the baseline per-km fuel rate and must be settled at actuals by the passenger.</li>
          <li><strong>Driver Bata:</strong> Standard driver allowance of ₹400/day (Sedan) to ₹500/day (SUV/Innova) applies to outstation journeys extending past calendar midnight (06:00 AM to 10:00 PM standard shift).</li>
          <li><strong>Night Driving Allowance:</strong> Night allowance of ₹300 applies for overnight travel between 10:00 PM and 06:00 AM.</li>
        </ul>
      </div>

      <div>
        <h2 class="text-xl font-bold text-slate-950 mb-3">3. Fast 10-Min Doorstep Pickup Terms</h2>
        <p class="text-slate-700 bg-amber-50/70 border border-amber-300/80 p-4 rounded-xl text-xs sm:text-sm">
          <strong>* Disclaimer:</strong> Our "Fast 10-Min Doorstep Pickup" service applies to immediate on-demand local dispatch within the <strong>Coimbatore Municipal Corporation boundaries</strong> (Gandhipuram, RS Puram, Town Hall, Peelamedu, Singanallur, Ramanathapuram, Saibaba Colony, etc.), subject to peak traffic congestion, severe monsoon downpours, and live vehicle availability in the sector. For airport departures or early morning trains, we recommend reserving 30 to 60 minutes in advance.
        </p>
      </div>

      <div>
        <h2 class="text-xl font-bold text-slate-950 mb-3">4. Zero Advance & Payment Terms</h2>
        <p class="text-slate-700">
          We do not mandate online credit card advances for routine city rides or outstation drops. Full payment must be settled at the conclusion of the trip directly to the driver via Cash or UPI QR scan. Long multi-day outstation packages may require daily fuel settling directly with the chauffeur.
        </p>
      </div>

      <div>
        <h2 class="text-xl font-bold text-slate-950 mb-3">5. Passenger Conduct & Prohibited Items</h2>
        <ul class="list-disc pl-6 space-y-2 text-slate-700">
          <li>Smoking, alcohol consumption, or consumption of illegal substances inside our commercial cabs is strictly prohibited under the Motor Vehicles Act.</li>
          <li>Hazardous materials, flammables, contraband, or commercial freight beyond normal travel baggage are not permitted.</li>
          <li>Drivers reserve the right to decline or terminate a trip if passengers engage in abusive, dangerous, or unlawful behavior.</li>
        </ul>
      </div>

      <div>
        <h2 class="text-xl font-bold text-slate-950 mb-3">6. Hill Station Driving Guidelines (Nilgiris & Valparai)</h2>
        <p class="text-slate-700">
          For routes traversing steep mountain terrain (Ooty, Coonoor, Valparai 40 Hairpins, Kodaikanal, Munnar), our drivers adhere strictly to Hill Highway safety norms. Air conditioning may be switched off intermittently on steep ascents to maintain engine climbing performance. Sightseeing routes are conducted during daylight forest safe hours.
        </p>
      </div>

      <div class="border-t border-slate-200 pt-6">
        <h2 class="text-xl font-bold text-slate-950 mb-3">7. Official Contact Information</h2>
        <p class="text-slate-700 mb-2">For any contractual queries or official corporate billing inquiries:</p>
        <p class="text-slate-900 font-bold">Get Taxi Kovai | Coimbatore, Tamil Nadu, India</p>
        <p class="text-xs sm:text-sm text-slate-600">Hotline: <a href="${PHONE_HREF}" data-conversion-intent="call" class="text-amber-600 font-bold hover:underline">+91 ${PHONE_DISPLAY}</a> | Email: <a href="mailto:booking@gettaxikovai.in" class="text-amber-600 font-bold hover:underline">booking@gettaxikovai.in</a></p>
      </div>
    </div>
  </section>
  `;

  return generateHtmlPage({
    title: 'Terms & Conditions | Get Taxi Kovai - Coimbatore Call Taxi',
    description: 'Terms and Conditions for Get Taxi Kovai (gettaxikovai.in). Read our fair passenger terms, transparent tariff rate card rules, hill driving norms, and pickup dispatch conditions.',
    keywords: 'terms and conditions get taxi kovai, cab rental terms coimbatore, taxi pricing rules tamil nadu, gettaxikovai.in',
    canonicalUrl: `${SITE_URL}/terms.html`,
    activeNav: '',
    bodyContent,
  });
}

// ==========================================
// 3. CANCELLATION & REFUND POLICY (cancellation-refund.html)
// ==========================================
export function generateCancellationRefundPage() {
  const bodyContent = `
  <section class="bg-slate-900 text-white py-14 border-b border-slate-800">
    <div class="max-w-4xl mx-auto px-4 sm:px-6">
      <div class="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2">
        <a href="index.html" class="hover:underline">Home</a>
        <span>/</span>
        <span>Customer Protection</span>
      </div>
      <h1 class="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white mb-3">
        Cancellation & Refund Policy
      </h1>
      <p class="text-sm sm:text-base text-slate-300">
        Effective Date: January 1, 2026 | Last Updated: September 2026 | Customer Friendly Policies on <strong>gettaxikovai.in</strong>
      </p>
    </div>
  </section>

  <section class="py-14 bg-white text-slate-800">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 space-y-8 text-sm sm:text-base leading-relaxed">
      <!-- Highlight Banner -->
      <div class="bg-emerald-50 border border-emerald-300 rounded-2xl p-5 text-slate-900">
        <div class="flex items-center gap-2 text-emerald-800 font-black text-lg mb-1">
          <span>✓</span> <span>Zero Advance Required • 100% Free Cancellation Anytime</span>
        </div>
        <p class="text-xs sm:text-sm text-emerald-950">
          At Get Taxi Kovai, we believe in complete customer convenience. Because we do not mandate advance token deposits for standard local and outstation taxi bookings, our passengers enjoy total flexibility if travel plans change.
        </p>
      </div>

      <div>
        <h2 class="text-xl font-bold text-slate-950 mb-3">1. Ride Cancellation Policy</h2>
        <p class="mb-3">We understand that flights get rescheduled, meetings shift, and emergency family matters arise. Our cancellation terms are straightforward:</p>
        <ul class="list-disc pl-6 space-y-2 text-slate-700">
          <li><strong>Prior to Driver Departure:</strong> You may cancel your booking at any time without any cancellation penalty or fee.</li>
          <li><strong>After Driver Dispatched / At Doorstep:</strong> If the vehicle has already arrived at your doorstep or traveled significant distance specifically for your pickup, we kindly request informing the dispatch desk immediately at <a href="${PHONE_HREF}" data-conversion-intent="call" class="text-amber-600 font-bold hover:underline">+91 9043743777</a>. A nominal fuel compensation of ₹150–₹250 may be requested by the driver for dead mileage if cancelled after arrival.</li>
          <li><strong>Outstation Multi-Day Tour Cancellations:</strong> Free cancellation up to 4 hours prior to scheduled departure. No penalties apply.</li>
        </ul>
      </div>

      <div>
        <h2 class="text-xl font-bold text-slate-950 mb-3">2. Refund Processing (When Applicable)</h2>
        <p class="mb-3 text-slate-700">
          Since 98% of our customers pay after the ride via Cash or UPI, refunds are rarely required. In the rare event an advance deposit was provided for custom luxury fleet rentals (e.g. Wedding Mercedes/BMW or Tempo Traveller group bookings):
        </p>
        <ul class="list-disc pl-6 space-y-2 text-slate-700">
          <li>If cancelled at least 24 hours before the event, 100% of the advance deposit is refunded within 2 to 4 business days via UPI or original payment mode.</li>
          <li>If cancelled within 12 hours of the event, a small administrative fleet reservation fee of 15% may be retained, and the balance 85% refunded promptly.</li>
        </ul>
      </div>

      <div>
        <h2 class="text-xl font-bold text-slate-950 mb-3">3. Service Interruptions & Vehicle Replacement Policy</h2>
        <p class="text-slate-700 mb-3">
          In the rare circumstance of a mechanical vehicle breakdown, tire puncture, or highway obstruction during your journey:
        </p>
        <ul class="list-disc pl-6 space-y-2 text-slate-700">
          <li>Our 24/7 central dispatch will immediately dispatch an equivalent replacement cab from our local Coimbatore or regional network at zero additional charge.</li>
          <li>If you choose to make alternate transport arrangements due to unreasonable delay, you will only be charged for the exact kilometers traversed up to the point of interruption.</li>
        </ul>
      </div>

      <div>
        <h2 class="text-xl font-bold text-slate-950 mb-3">4. Route Modifications & Early Returns</h2>
        <p class="text-slate-700">
          If you wish to alter your drop destination or conclude an outstation trip earlier than planned, notify your driver and our helpline. Fares will be recalibrated based on actual kilometers covered according to our transparent rate card (subject to standard minimum daily kilometer rules).
        </p>
      </div>

      <div class="border-t border-slate-200 pt-6">
        <h2 class="text-xl font-bold text-slate-950 mb-3">5. Need Help with a Cancellation or Receipt?</h2>
        <p class="text-slate-700 mb-3">Our Coimbatore support team is available 24 hours a day, 7 days a week:</p>
        <div class="flex flex-wrap gap-3">
          <a href="${PHONE_HREF}" data-conversion-intent="call" class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm transition shadow-sm">
            <span>Call 24/7 Support: +91 9043743777</span>
          </a>
          <a href="${WHATSAPP_URL}" target="_blank" rel="noopener" data-conversion-intent="whatsapp" class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition shadow-sm">
            <span>WhatsApp Support Desk</span>
          </a>
        </div>
      </div>
    </div>
  </section>
  `;

  return generateHtmlPage({
    title: 'Cancellation & Refund Policy | Get Taxi Kovai - Coimbatore Call Taxi',
    description: 'Cancellation and Refund Policy of Get Taxi Kovai (gettaxikovai.in). Enjoy zero advance required, free cancellation anytime, and fair customer-first policies.',
    keywords: 'cancellation policy get taxi kovai, refund policy taxi coimbatore, zero advance cab booking, gettaxikovai.in refund',
    canonicalUrl: `${SITE_URL}/cancellation-refund.html`,
    activeNav: '',
    bodyContent,
  });
}

// Standalone execution function to create legal files
export function writeLegalPages() {
  console.log('Writing mandatory legal & policy pages...');
  fs.writeFileSync(path.join(ROOT_DIR, 'privacy.html'), generatePrivacyPage(), 'utf8');
  console.log('✓ Created: privacy.html');
  fs.writeFileSync(path.join(ROOT_DIR, 'terms.html'), generateTermsPage(), 'utf8');
  console.log('✓ Created: terms.html');
  fs.writeFileSync(path.join(ROOT_DIR, 'cancellation-refund.html'), generateCancellationRefundPage(), 'utf8');
  console.log('✓ Created: cancellation-refund.html');
}

// If executed directly via node
if (process.argv[1] && process.argv[1].endsWith('create-legal-pages.js')) {
  writeLegalPages();
}
