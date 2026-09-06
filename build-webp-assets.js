import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import https from 'https';

const IMAGES = [
  // Brand
  {
    url: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=1200&q=80',
    dest: 'public/images/brand/og-banner.webp',
    width: 1200,
    height: 630,
    quality: 82
  },

  // Vehicles (4:3 aspect ratio, clean studio compression)
  {
    url: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=800&q=80',
    dest: 'public/images/vehicles/hatchback.webp',
    width: 800,
    height: 600,
    quality: 80
  },
  {
    url: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=800&q=80',
    dest: 'public/images/vehicles/sedan.webp',
    width: 800,
    height: 600,
    quality: 80
  },
  {
    url: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80',
    dest: 'public/images/vehicles/suv.webp',
    width: 800,
    height: 600,
    quality: 80
  },
  {
    url: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80',
    dest: 'public/images/vehicles/innova-crysta.webp',
    width: 800,
    height: 600,
    quality: 80
  },
  {
    url: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80',
    dest: 'public/images/vehicles/tempo-traveller.webp',
    width: 800,
    height: 600,
    quality: 80
  },

  // 7 Tour Packages (16:9 widescreen, ultra-optimized for fast page speed)
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Adiyogi_Shiva_statue%2C_Coimbatore.jpg/800px-Adiyogi_Shiva_statue%2C_Coimbatore.jpg',
    dest: 'public/images/tours/tour-isha-adiyogi.webp',
    width: 960,
    height: 540,
    quality: 80
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Ooty_Lake%2C_Tamil_Nadu.jpg/800px-Ooty_Lake%2C_Tamil_Nadu.jpg',
    dest: 'public/images/tours/tour-ooty-lake.webp',
    width: 960,
    height: 540,
    quality: 80
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Kodaikanal_Lake_view.jpg/800px-Kodaikanal_Lake_view.jpg',
    dest: 'public/images/tours/tour-kodaikanal-lake.webp',
    width: 960,
    height: 540,
    quality: 80
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Valparai_tea_estates.jpg/800px-Valparai_tea_estates.jpg',
    dest: 'public/images/tours/tour-valparai-tea.webp',
    width: 960,
    height: 540,
    quality: 80
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Munnar_tea_plantations_Kerala.jpg/800px-Munnar_tea_plantations_Kerala.jpg',
    dest: 'public/images/tours/tour-munnar-plantations.webp',
    width: 960,
    height: 540,
    quality: 80
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Palani_Murugan_Temple_Hill.jpg/800px-Palani_Murugan_Temple_Hill.jpg',
    dest: 'public/images/tours/tour-palani-murugan-temple.webp',
    width: 960,
    height: 540,
    quality: 80
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Brihadeeswarar_Temple_Thanjavur_2019.jpg/800px-Brihadeeswarar_Temple_Thanjavur_2019.jpg',
    dest: 'public/images/tours/tour-thanjavur-big-temple.webp',
    width: 960,
    height: 540,
    quality: 80
  },

  // 26 Blog Editorial WebP Images
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Perur_Pateeswarar_Temple.jpg/800px-Perur_Pateeswarar_Temple.jpg',
    dest: 'public/images/blog/coimbatore-history-perur-temple.webp',
    width: 960,
    height: 540,
    quality: 80
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Stone_House%2C_Ooty.jpg/800px-Stone_House%2C_Ooty.jpg',
    dest: 'public/images/blog/ooty-history-stone-house.webp',
    width: 960,
    height: 540,
    quality: 80
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Adiyogi_Shiva_statue%2C_Coimbatore.jpg/800px-Adiyogi_Shiva_statue%2C_Coimbatore.jpg',
    dest: 'public/images/blog/isha-yoga-adiyogi-shiva.webp',
    width: 960,
    height: 540,
    quality: 80
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Valparai_tea_estates.jpg/800px-Valparai_tea_estates.jpg',
    dest: 'public/images/blog/valparai-tea-estate-hairpins.webp',
    width: 960,
    height: 540,
    quality: 80
  },
  {
    url: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80',
    dest: 'public/images/blog/one-way-drop-taxi-savings.webp',
    width: 960,
    height: 540,
    quality: 80
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Coimbatore_Airport_Terminal_Building.jpg/800px-Coimbatore_Airport_Terminal_Building.jpg',
    dest: 'public/images/blog/coimbatore-airport-cjb-terminal.webp',
    width: 960,
    height: 540,
    quality: 80
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Kodaikanal_Lake_view.jpg/800px-Kodaikanal_Lake_view.jpg',
    dest: 'public/images/blog/kodaikanal-lake-pine-forest.webp',
    width: 960,
    height: 540,
    quality: 80
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Palani_Murugan_Temple_Hill.jpg/800px-Palani_Murugan_Temple_Hill.jpg',
    dest: 'public/images/blog/palani-murugan-temple-hill.webp',
    width: 960,
    height: 540,
    quality: 80
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Valparai_tea_estates.jpg/800px-Valparai_tea_estates.jpg',
    dest: 'public/images/blog/topslip-anamalai-tiger-reserve.webp',
    width: 960,
    height: 540,
    quality: 80
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Coimbatore_Junction_Railway_Station_Entrance.jpg/800px-Coimbatore_Junction_Railway_Station_Entrance.jpg',
    dest: 'public/images/blog/coimbatore-junction-railway-station.webp',
    width: 960,
    height: 540,
    quality: 80
  },
  {
    url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
    dest: 'public/images/blog/tiruppur-texvalley-garment-hub.webp',
    width: 960,
    height: 540,
    quality: 80
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Nilgiri_Mountain_Railway_Steam_Locomotive.jpg/800px-Nilgiri_Mountain_Railway_Steam_Locomotive.jpg',
    dest: 'public/images/blog/nilgiri-mountain-railway-toy-train.webp',
    width: 960,
    height: 540,
    quality: 80
  },
  {
    url: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=800&q=80',
    dest: 'public/images/blog/erode-salem-highway-transit.webp',
    width: 960,
    height: 540,
    quality: 80
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Siruvani_Waterfalls_Coimbatore.jpg/800px-Siruvani_Waterfalls_Coimbatore.jpg',
    dest: 'public/images/blog/siruvani-waterfalls-kovai-kutralam.webp',
    width: 960,
    height: 540,
    quality: 80
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Munnar_tea_plantations_Kerala.jpg/800px-Munnar_tea_plantations_Kerala.jpg',
    dest: 'public/images/blog/munnar-tea-plantations-kerala.webp',
    width: 960,
    height: 540,
    quality: 80
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/TIDEL_Park_Coimbatore_Building.jpg/800px-TIDEL_Park_Coimbatore_Building.jpg',
    dest: 'public/images/blog/tidel-park-saravanampatti-it-corridor.webp',
    width: 960,
    height: 540,
    quality: 80
  },
  {
    url: 'https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&w=800&q=80',
    dest: 'public/images/blog/late-night-24-7-taxi-coimbatore.webp',
    width: 960,
    height: 540,
    quality: 80
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Perur_Pateeswarar_Temple.jpg/800px-Perur_Pateeswarar_Temple.jpg',
    dest: 'public/images/blog/perur-pateeswarar-temple-kovai.webp',
    width: 960,
    height: 540,
    quality: 80
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Vidhana_Soudha_Bangalore.jpg/800px-Vidhana_Soudha_Bangalore.jpg',
    dest: 'public/images/blog/coimbatore-to-bangalore-highway.webp',
    width: 960,
    height: 540,
    quality: 80
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Madurai_Meenakshi_Amman_Temple_Gopuram.jpg/800px-Madurai_Meenakshi_Amman_Temple_Gopuram.jpg',
    dest: 'public/images/blog/madurai-meenakshi-amman-temple.webp',
    width: 960,
    height: 540,
    quality: 80
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Eachanari_Vinayagar_Temple_Entrance.jpg/800px-Eachanari_Vinayagar_Temple_Entrance.jpg',
    dest: 'public/images/blog/eachanari-vinayagar-temple.webp',
    width: 960,
    height: 540,
    quality: 80
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Chennai_Central_Railway_Station_building.jpg/800px-Chennai_Central_Railway_Station_building.jpg',
    dest: 'public/images/blog/chennai-central-highway-drop.webp',
    width: 960,
    height: 540,
    quality: 80
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Sims_Park_Coonoor_Botanical_Garden.jpg/800px-Sims_Park_Coonoor_Botanical_Garden.jpg',
    dest: 'public/images/blog/sims-park-coonoor-botanical-garden.webp',
    width: 960,
    height: 540,
    quality: 80
  },
  {
    url: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80',
    dest: 'public/images/blog/wedding-luxury-car-rentals-coimbatore.webp',
    width: 960,
    height: 540,
    quality: 80
  },
  {
    url: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=800&q=80',
    dest: 'public/images/blog/why-get-taxi-kovai-top-rated.webp',
    width: 960,
    height: 540,
    quality: 80
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Brihadeeswarar_Temple_Thanjavur_2019.jpg/800px-Brihadeeswarar_Temple_Thanjavur_2019.jpg',
    dest: 'public/images/blog/thanjavur-brihadeeswarar-big-temple.webp',
    width: 960,
    height: 540,
    quality: 80
  }
];

// Helper to fetch buffer from URL
function fetchBuffer(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchBuffer(res.headers.location).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed to fetch ${url} (Status: ${res.statusCode})`));
      }
      const data = [];
      res.on('data', chunk => data.push(chunk));
      res.on('end', () => resolve(Buffer.concat(data)));
    }).on('error', reject);
  });
}

async function processAllImages() {
  console.log(`Starting image generation & WebP optimization for ${IMAGES.length} assets...`);
  
  for (const item of IMAGES) {
    try {
      const destPath = path.resolve(process.cwd(), item.dest);
      fs.mkdirSync(path.dirname(destPath), { recursive: true });

      const buffer = await fetchBuffer(item.url);
      await sharp(buffer)
        .resize(item.width, item.height, { fit: 'cover', position: 'center' })
        .webp({ quality: item.quality, effort: 6 })
        .toFile(destPath);

      const stats = fs.statSync(destPath);
      console.log(`✓ Generated: ${item.dest} (${(stats.size / 1024).toFixed(1)} KB)`);
    } catch (err) {
      console.error(`✗ Error processing ${item.dest}:`, err.message);
    }
  }
  console.log('🎉 All high-speed WebP image assets generated successfully!');
}

processAllImages();
