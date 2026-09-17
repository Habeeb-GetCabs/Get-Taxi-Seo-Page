import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

// Google Search Favicon Guidelines require:
// 1. A 1:1 square aspect ratio
// 2. Dimensions that are a multiple of 48px square (48x48, 96x96, 144x144, 192x192, etc.)
// 3. Clear branding representing the site
// 4. Stable URL not blocked by robots.txt

const svgFavicon = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="yellowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FDE047"/>
      <stop offset="50%" stop-color="#FACC15"/>
      <stop offset="100%" stop-color="#EAB308"/>
    </linearGradient>
    <linearGradient id="darkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0F172A"/>
      <stop offset="100%" stop-color="#020617"/>
    </linearGradient>
    <filter id="dropShadow" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#000000" flood-opacity="0.35"/>
    </filter>
  </defs>

  <!-- Background Base (Rounded Square with subtle border) -->
  <rect x="16" y="16" width="480" height="480" rx="108" fill="url(#yellowGrad)"/>
  <rect x="16" y="16" width="480" height="480" rx="108" fill="none" stroke="#CA8A04" stroke-width="6"/>

  <!-- Inner Dark Taxi Sign Container -->
  <g filter="url(#dropShadow)">
    <!-- Taxi Roof Light -->
    <rect x="206" y="76" width="100" height="34" rx="8" fill="url(#darkGrad)"/>
    <rect x="220" y="84" width="72" height="18" rx="4" fill="#FACC15"/>
    <text x="256" y="98" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-weight="900" font-size="12" fill="#0F172A" text-anchor="middle" letter-spacing="1">TAXI</text>

    <!-- Main Car Body Shape -->
    <!-- Car Cabin Roof -->
    <path d="M140 210 L180 120 L332 120 L372 210 Z" fill="url(#darkGrad)"/>
    
    <!-- Windshield & Windows -->
    <path d="M152 202 L186 132 L248 132 L248 202 Z" fill="#38BDF8" opacity="0.9"/>
    <path d="M264 202 L264 132 L326 132 L360 202 Z" fill="#38BDF8" opacity="0.9"/>
    
    <!-- Car Lower Body Base -->
    <rect x="76" y="200" width="360" height="150" rx="44" fill="url(#darkGrad)"/>

    <!-- Taxi Checker Stripe (Brand Signature) -->
    <g fill="#FACC15">
      <rect x="100" y="222" width="22" height="14" rx="2"/>
      <rect x="144" y="222" width="22" height="14" rx="2"/>
      <rect x="188" y="222" width="22" height="14" rx="2"/>
      <rect x="232" y="222" width="22" height="14" rx="2"/>
      <rect x="276" y="222" width="22" height="14" rx="2"/>
      <rect x="320" y="222" width="22" height="14" rx="2"/>
      <rect x="364" y="222" width="22" height="14" rx="2"/>
      <rect x="390" y="222" width="22" height="14" rx="2"/>

      <rect x="122" y="236" width="22" height="14" rx="2"/>
      <rect x="166" y="236" width="22" height="14" rx="2"/>
      <rect x="210" y="236" width="22" height="14" rx="2"/>
      <rect x="254" y="236" width="22" height="14" rx="2"/>
      <rect x="298" y="236" width="22" height="14" rx="2"/>
      <rect x="342" y="236" width="22" height="14" rx="2"/>
      <rect x="386" y="236" width="22" height="14" rx="2"/>
    </g>

    <!-- Headlights -->
    <circle cx="120" cy="286" r="24" fill="#FEF08A"/>
    <circle cx="120" cy="286" r="16" fill="#FFFFFF"/>
    
    <circle cx="392" cy="286" r="24" fill="#FEF08A"/>
    <circle cx="392" cy="286" r="16" fill="#FFFFFF"/>

    <!-- Front Grille & License Plate / Brand Text -->
    <rect x="176" y="272" width="160" height="38" rx="8" fill="#1E293B" stroke="#475569" stroke-width="2"/>
    <text x="256" y="297" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-weight="900" font-size="19" fill="#FACC15" text-anchor="middle" letter-spacing="2">KOVAI</text>

    <!-- Wheels / Tires -->
    <rect x="100" y="336" width="60" height="28" rx="8" fill="#020617"/>
    <rect x="352" y="336" width="60" height="28" rx="8" fill="#020617"/>
  </g>

  <!-- Bottom Brand Slogan Text -->
  <text x="256" y="440" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-weight="900" font-size="34" fill="#0F172A" text-anchor="middle" letter-spacing="1">GET TAXI</text>
</svg>
`.trim();

async function buildAllFavicons() {
  console.log('Generating Google Search compliant favicons...');
  const publicDir = path.join(process.cwd(), 'public');
  const rootDir = process.cwd();

  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // 1. Save SVG files
  fs.writeFileSync(path.join(publicDir, 'favicon.svg'), svgFavicon, 'utf8');
  fs.writeFileSync(path.join(rootDir, 'favicon.svg'), svgFavicon, 'utf8');

  const svgBuffer = Buffer.from(svgFavicon);

  // 2. Generate required Google Search multiples of 48px + standard icons
  const sizes = [
    { size: 48, name: 'favicon-48x48.png' },
    { size: 96, name: 'favicon-96x96.png' },
    { size: 144, name: 'favicon-144x144.png' },
    { size: 192, name: 'favicon-192x192.png' },
    { size: 512, name: 'favicon-512x512.png' },
    { size: 180, name: 'apple-touch-icon.png' },
    { size: 192, name: 'favicon.png' },
    { size: 48, name: 'favicon.ico' }, // sharp can output 48x48 png as ico fallback
  ];

  for (const item of sizes) {
    const pngBuffer = await sharp(svgBuffer)
      .resize(item.size, item.size)
      .png()
      .toBuffer();

    fs.writeFileSync(path.join(publicDir, item.name), pngBuffer);
    fs.writeFileSync(path.join(rootDir, item.name), pngBuffer);
    console.log(`✓ Generated: ${item.name} (${item.size}x${item.size})`);
  }

  // 3. Web App Manifest for Android Chrome & PWA
  const manifest = {
    "name": "Get Taxi Kovai - Coimbatore Call Taxi",
    "short_name": "GetTaxiKovai",
    "description": "Premier 24/7 Call Taxi and Outstation Cab Service in Coimbatore with prompt doorstep pickup.",
    "start_url": "/",
    "display": "standalone",
    "background_color": "#0a1124",
    "theme_color": "#FACC15",
    "icons": [
      {
        "src": "/favicon-48x48.png",
        "sizes": "48x48",
        "type": "image/png"
      },
      {
        "src": "/favicon-96x96.png",
        "sizes": "96x96",
        "type": "image/png"
      },
      {
        "src": "/favicon-192x192.png",
        "sizes": "192x192",
        "type": "image/png",
        "purpose": "any maskable"
      },
      {
        "src": "/favicon-512x512.png",
        "sizes": "512x512",
        "type": "image/png",
        "purpose": "any maskable"
      }
    ]
  };

  fs.writeFileSync(path.join(publicDir, 'site.webmanifest'), JSON.stringify(manifest, null, 2), 'utf8');
  fs.writeFileSync(path.join(rootDir, 'site.webmanifest'), JSON.stringify(manifest, null, 2), 'utf8');
  console.log('✓ Generated: site.webmanifest');

  // 4. Update robots.txt to ensure Googlebot-Image explicitly allowed
  const robotsTxt = `User-agent: *
Allow: /

User-agent: Googlebot
Allow: /

User-agent: Googlebot-Image
Allow: /
Allow: /favicon*
Allow: /*.png
Allow: /*.svg
Allow: /*.ico

Sitemap: https://gettaxikovai.com/sitemap.xml
`;
  fs.writeFileSync(path.join(publicDir, 'robots.txt'), robotsTxt, 'utf8');
  fs.writeFileSync(path.join(rootDir, 'robots.txt'), robotsTxt, 'utf8');
  console.log('✓ Updated: robots.txt with Googlebot-Image rules');
}

buildAllFavicons().catch(console.error);
