// Google Ads Click Fraud & Suspicious Visitor Radar for Get Taxi Kovai

export interface ClickLogEntry {
  id: string;
  timestamp: string;
  ip: string;
  isGoogleAd: boolean;
  gclid?: string;
  source: string;
  landingPage: string;
  userAgent: string;
  deviceType: 'mobile' | 'desktop' | 'tablet';
  sessionVisitsToday: number;
  dwellSeconds: number;
  suspiciousScore: number; // 0 to 100
  threatReasons: string[];
  area: string; // e.g. "Gandhipuram", "Peelamedu / Airport", "Saravanampatti", "RS Puram", "Coimbatore Region"
  coordinates?: { lat: number; lng: number };
  interacted: boolean; // clicked call/whatsapp or submitted booking
}

// Key Coimbatore Landmark Coordinate Centroids for high-precision area detection
const COIMBATORE_LANDMARKS: Array<{ name: string; lat: number; lng: number; radiusKm: number }> = [
  { name: 'Gandhipuram / Cross Cut Road', lat: 11.0168, lng: 76.9558, radiusKm: 3.5 },
  { name: 'Peelamedu / CJB Airport / TIDEL', lat: 11.0280, lng: 77.0270, radiusKm: 4.0 },
  { name: 'RS Puram / DB Road', lat: 11.0110, lng: 76.9500, radiusKm: 3.0 },
  { name: 'Saravanampatti / IT Corridor', lat: 11.0800, lng: 76.9950, radiusKm: 4.5 },
  { name: 'Singanallur / Trichy Road', lat: 10.9990, lng: 77.0250, radiusKm: 3.5 },
  { name: 'Ukkadam / Town Hall / Railway Station', lat: 10.9920, lng: 76.9600, radiusKm: 3.0 },
  { name: 'Saibaba Colony / Kavundampalayam', lat: 11.0330, lng: 76.9450, radiusKm: 3.5 },
  { name: 'Perur / Thondamuthur Road', lat: 10.9700, lng: 76.8900, radiusKm: 4.0 },
  { name: 'Isha Yoga / Velliangiri Foothills', lat: 10.9770, lng: 76.7410, radiusKm: 6.0 },
  { name: 'Mettupalayam Gateway', lat: 11.3000, lng: 76.9500, radiusKm: 6.0 },
  { name: 'Pollachi Hub', lat: 10.6600, lng: 77.0100, radiusKm: 5.0 },
  { name: 'Tiruppur City Hub', lat: 11.1085, lng: 77.3411, radiusKm: 6.0 },
];

function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function resolveAreaFromCoordinates(lat?: number, lng?: number): string {
  if (!lat || !lng || !Number.isFinite(lat) || !Number.isFinite(lng)) {
    return 'Coimbatore / Regional Gateway (IP Geolocation)';
  }

  // Find closest landmark
  let closest = 'Coimbatore Urban Area';
  let minDistance = Infinity;

  for (const landmark of COIMBATORE_LANDMARKS) {
    const dist = calculateDistanceKm(lat, lng, landmark.lat, landmark.lng);
    if (dist < landmark.radiusKm && dist < minDistance) {
      minDistance = dist;
      closest = `${landmark.name} (~${dist.toFixed(1)} km)`;
    }
  }

  if (minDistance === Infinity) {
    return `Tamil Nadu (${lat.toFixed(3)}, ${lng.toFixed(3)})`;
  }

  return closest;
}

// In-memory circular log store (keeps last 500 clicks)
const MAX_LOGS = 500;
const clickLogs: ClickLogEntry[] = [
  // Seed sample initial mock entries so the dashboard demonstrates immediate value
  {
    id: 'clk_sample_1',
    timestamp: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
    ip: '49.207.214.88',
    isGoogleAd: true,
    gclid: 'CjwKCAjw_sample_gclid_competitor_a1',
    source: 'Google Ads Search',
    landingPage: '/oneway.html',
    userAgent: 'Mozilla/5.0 (Linux; Android 14; SM-S918B) Mobile Safari/537.36',
    deviceType: 'mobile',
    sessionVisitsToday: 4,
    dwellSeconds: 1.4,
    suspiciousScore: 92,
    threatReasons: [
      'Rapid repeat ad click: 4 visits in 1 day from same device',
      'Instant bounce: Left landing page in 1.4s without scrolling',
      'No contact link clicked (ad budget exhaustion pattern)'
    ],
    area: 'Gandhipuram / Cross Cut Road (Repeated Ad Bounce)',
    interacted: false,
  },
  {
    id: 'clk_sample_2',
    timestamp: new Date(Date.now() - 1000 * 60 * 42).toISOString(),
    ip: '106.51.82.14',
    isGoogleAd: true,
    gclid: 'CjwKCAjw_sample_gclid_competitor_b2',
    source: 'Google Ads Search',
    landingPage: '/hourly-rental.html',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/128.0.0.0',
    deviceType: 'desktop',
    sessionVisitsToday: 3,
    dwellSeconds: 2.1,
    suspiciousScore: 85,
    threatReasons: [
      'Multiple paid clicks in 24 hours (3 sessions)',
      'Sub-3s page bounce on paid Google Ads traffic',
      'Automated desktop browser pattern'
    ],
    area: 'Peelamedu / CJB Airport / TIDEL',
    interacted: false,
  },
  {
    id: 'clk_sample_3',
    timestamp: new Date(Date.now() - 1000 * 60 * 75).toISOString(),
    ip: '157.48.112.55',
    isGoogleAd: true,
    gclid: 'CjwKCAjw_sample_gclid_legit_c3',
    source: 'Google Ads Search',
    landingPage: '/tour-ooty-coonoor.html',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) Mobile/15E148',
    deviceType: 'mobile',
    sessionVisitsToday: 1,
    dwellSeconds: 84.0,
    suspiciousScore: 12,
    threatReasons: [
      'Legitimate passenger behavior: High dwell time (84s)',
      'Clicked WhatsApp enquiry booking link'
    ],
    area: 'Saravanampatti / IT Corridor (~1.2 km)',
    interacted: true,
  }
];

export function logClickEvent(entry: Omit<ClickLogEntry, 'id' | 'timestamp' | 'suspiciousScore' | 'threatReasons'>): ClickLogEntry {
  const reasons: string[] = [];
  let score = 10; // Baseline normal visitor

  // 1. Google Ad click presence
  if (entry.isGoogleAd || entry.gclid) {
    score += 15;
  }

  // 2. Frequency penalty: Multiple clicks on same ad from same device today
  if (entry.sessionVisitsToday >= 4) {
    score += 50;
    reasons.push(`Extreme repeat ad clicks (${entry.sessionVisitsToday} visits today)`);
  } else if (entry.sessionVisitsToday >= 2) {
    score += 25;
    reasons.push(`Repeated ad click: ${entry.sessionVisitsToday} visits today from same device`);
  }

  // 3. Dwell time penalty: Bounced instantly without reading
  if (entry.dwellSeconds > 0 && entry.dwellSeconds < 2.5) {
    score += 35;
    reasons.push(`Instant bounce: Left page in ${entry.dwellSeconds.toFixed(1)}s (bot/competitor pattern)`);
  } else if (entry.dwellSeconds > 0 && entry.dwellSeconds < 5.0) {
    score += 15;
    reasons.push(`Very low dwell time: ${entry.dwellSeconds.toFixed(1)}s`);
  }

  // 4. Headless/automation detection
  const uaLower = entry.userAgent.toLowerCase();
  if (
    uaLower.includes('headless') ||
    uaLower.includes('puppeteer') ||
    uaLower.includes('selenium') ||
    uaLower.includes('bot') ||
    uaLower.includes('crawl')
  ) {
    score += 50;
    reasons.push('Automated crawler / bot signature in user-agent');
  }

  // 5. Positive credit for genuine interaction
  if (entry.interacted) {
    score = Math.max(5, score - 40);
    reasons.push('Legitimate visitor: Interacted with call, WhatsApp or booking form');
  } else if (score >= 70) {
    reasons.push('Zero conversion engagement: Did not attempt call or WhatsApp');
  }

  const finalScore = Math.min(99, Math.max(5, score));

  // Check if IP matches any known previous log from today
  const existingSameIp = clickLogs.filter(
    (l) => l.ip === entry.ip && l.id !== 'clk_sample_1' && l.id !== 'clk_sample_2' && l.id !== 'clk_sample_3'
  );
  if (existingSameIp.length >= 2 && !reasons.some((r) => r.includes('IP repeat'))) {
    reasons.push(`IP address logged ${existingSameIp.length + 1} times today`);
  }

  const newEntry: ClickLogEntry = {
    ...entry,
    id: `clk_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    timestamp: new Date().toISOString(),
    suspiciousScore: finalScore,
    threatReasons: reasons,
    area: entry.area || resolveAreaFromCoordinates(entry.coordinates?.lat, entry.coordinates?.lng),
  };

  clickLogs.unshift(newEntry);
  if (clickLogs.length > MAX_LOGS) {
    clickLogs.pop();
  }

  return newEntry;
}

export function updateClickEvent(id: string, updates: { dwellSeconds?: number; coordinates?: { lat: number; lng: number }; interacted?: boolean }): boolean {
  if (!id) return false;
  const item = clickLogs.find((l) => l.id === id);
  if (!item) return false;

  if (typeof updates.dwellSeconds === 'number' && updates.dwellSeconds > 0) {
    item.dwellSeconds = updates.dwellSeconds;
    // If dwell time was very short (< 2.5s) on Google Ad without interaction, bump score
    if (item.dwellSeconds < 2.5 && !item.interacted && item.isGoogleAd) {
      if (!item.threatReasons.some((r) => r.includes('Instant bounce'))) {
        item.threatReasons.push(`Instant bounce: Left page in ${item.dwellSeconds.toFixed(1)}s (competitor pattern)`);
        item.suspiciousScore = Math.min(99, item.suspiciousScore + 35);
      }
    }
  }

  if (updates.coordinates?.lat && updates.coordinates?.lng) {
    item.coordinates = updates.coordinates;
    item.area = resolveAreaFromCoordinates(updates.coordinates.lat, updates.coordinates.lng);
  }

  if (updates.interacted) {
    item.interacted = true;
    item.suspiciousScore = Math.max(5, item.suspiciousScore - 40);
    if (!item.threatReasons.some((r) => r.includes('Legitimate visitor'))) {
      item.threatReasons.push('Legitimate visitor: Interacted with call, WhatsApp or booking form');
    }
  }

  return true;
}

export function getFraudRadarSummary() {
  const total = clickLogs.length;
  const suspicious = clickLogs.filter((l) => l.suspiciousScore >= 75);
  const uniqueSuspiciousIps = Array.from(new Set(suspicious.map((l) => l.ip)));
  const totalAdClicks = clickLogs.filter((l) => l.isGoogleAd).length;

  return {
    totalLogs: total,
    totalAdClicks,
    suspiciousCount: suspicious.length,
    fraudRatePercent: totalAdClicks > 0 ? Math.round((suspicious.length / totalAdClicks) * 100) : 0,
    uniqueSuspiciousIps,
    recentLogs: clickLogs.slice(0, 100),
  };
}

export function clearFraudLogs() {
  clickLogs.length = 0;
  return { ok: true };
}
