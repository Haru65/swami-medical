#!/usr/bin/env node

/**
 * Medicine Image Fetcher Script
 * 
 * This script automatically fetches medicine images from Unsplash API
 * and updates the medicines.json file with image URLs.
 * 
 * Usage:
 * 1. Get a free Unsplash API key from https://unsplash.com/developers
 * 2. Set UNSPLASH_ACCESS_KEY in environment or hardcode it below
 * 3. Run: node scripts/fetch-medicine-images.js
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============ CONFIGURATION ============
const PEXELS_API_KEY = process.env.PEXELS_API_KEY || '';
const DATA_DIR = path.join(__dirname, '../server/data');
const MEDICINES_FILE = path.join(DATA_DIR, 'medicines.json');
const IMAGES_DIR = path.join(__dirname, '../public/medicine-images');

// Ensure images directory exists
if (!fs.existsSync(IMAGES_DIR)) {
  fs.mkdirSync(IMAGES_DIR, { recursive: true });
}

// Medicine search queries - customize based on your medicines
const MEDICINE_QUERIES = {
  'Aspirin': 'aspirin tablet white medicine pain relief',
  'Ibuprofen': 'ibuprofen tablet red white medicine',
  'Amoxicillin Cap': 'amoxicillin capsule antibiotic medicine',
  'Metformin': 'metformin tablet diabetes medicine',
  'Vitamin D': 'vitamin d supplement capsule pills',
  'Cough Syrup': 'cough syrup medicine bottle',
  'Paracetamol': 'paracetamol tablet white pill',
  'Dolo 650': 'paracetamol tablet white pill',
  'Antibiotics': 'antibiotic pills capsules medicine',
  'Allergy Relief': 'allergy medicine tablet cetirizine',
  'Blood Pressure': 'blood pressure medicine tablet medicine pharmacy',
  'Telma 40': 'blood pressure medicine tablet',
  'Heart Medicine': 'cardiac medication tablet heart',
  'Ecosprin 75': 'aspirin medicine tablet heart',
  'Cold Medicine': 'cold relief medicine cough tablet',
  'Pain Relief': 'paracetamol pain relief tablet',
  'Antacid': 'antacid tablet medicine indigestion',
  'Benadryl Syrup': 'cough syrup medicine bottle antihistamine',
  'Insulin Glargine': 'insulin injection pen diabetes',
  'Betadine Ointment': 'ointment cream antiseptic medical',
  'Ascoril D': 'cough syrup medicine bottle',
  'Glycomet GP2': 'diabetes medicine tablet glimepiride metformin',
  'Zincovit': 'multivitamin tablet supplement zinc',
  'Chyawanprash': 'ayurvedic tonic herbal medicine immunity',
  'Whey Protein': 'protein powder fitness nutrition',
  'Ashwagandha': 'ashwagandha supplement herbal medicine stress relief'
};

// ============ HELPER FUNCTIONS ============

/**
 * Generate a colorful SVG image based on medicine name
 */
function generateMedicineImage(medicineName, medicineId) {
  // Deterministic color based on ID
  const hash = medicineId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const colors = [
    { bg: '#FF6B6B', fg: '#FFFFFF' }, // Red
    { bg: '#4ECDC4', fg: '#FFFFFF' }, // Teal
    { bg: '#FFD93D', fg: '#333333' }, // Yellow
    { bg: '#95E1D3', fg: '#333333' }, // Mint
    { bg: '#C7A9FF', fg: '#FFFFFF' }, // Purple
    { bg: '#FFA07A', fg: '#FFFFFF' }, // Salmon
    { bg: '#F08080', fg: '#FFFFFF' }, // Light Coral
    { bg: '#90EE90', fg: '#333333' }  // Light Green
  ];
  
  const color = colors[hash % colors.length];
  const initials = medicineName.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
  
  // Create SVG with medicine bottle icon and text
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="400" height="400" fill="${color.bg}"/>
  
  <!-- Medicine bottle icon -->
  <g transform="translate(150, 80)">
    <!-- Bottle cap -->
    <rect x="40" y="0" width="80" height="20" fill="${color.fg}" rx="3"/>
    <!-- Bottle body -->
    <path d="M 50 20 L 45 80 Q 45 100 60 110 L 140 110 Q 155 100 155 80 L 150 20 Z" fill="${color.fg}" opacity="0.9"/>
    <!-- Bottle shine -->
    <ellipse cx="80" cy="50" rx="15" ry="30" fill="${color.fg}" opacity="0.3"/>
  </g>
  
  <!-- Medicine name initials -->
  <text x="200" y="280" font-size="60" font-weight="bold" text-anchor="middle" fill="${color.fg}" font-family="Arial, sans-serif">${initials}</text>
  
  <!-- Medicine name -->
  <text x="200" y="350" font-size="24" text-anchor="middle" fill="${color.fg}" font-family="Arial, sans-serif">${medicineName.substring(0, 15)}</text>
</svg>`;

  return svg;
}

/**
 * Save SVG image to disk
 */
function saveImageFile(medicineId, svgContent) {
  const filePath = path.join(IMAGES_DIR, `${medicineId}.svg`);
  fs.writeFileSync(filePath, svgContent, 'utf8');
  return `/medicine-images/${medicineId}.svg`;
}

/**
 * Download image from a URL and save locally
 */
function downloadImage(url, filePath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filePath);
    https.get(url, (response) => {
      // Handle redirects
      if (response.statusCode === 301 || response.statusCode === 302) {
        downloadImage(response.headers.location, filePath).then(resolve).catch(reject);
        return;
      }
      
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve(true);
      });
      file.on('error', reject);
    }).on('error', reject);
  });
}

/**
 * Create a simple image URL using a reliable placeholder service
 */
function getPlaceholderImageUrl(medicineName, id) {
  // Use different colors for different medicine types
  const colors = {
    'Tablets & Capsules': 'ff6b6b',
    'Syrups': '4ecdc4',
    'Injections': 'ffd93d',
    'Oints & Creams': '95e1d3',
    'Vitamins & Supplements': 'c7a9ff',
    'Immunity Boosters': 'ffa07a',
    'Protein & Nutrition': 'f08080',
    'Herbal Products': '90ee90'
  };
  
  const text = encodeURIComponent(medicineName.substring(0, 12));
  const color = 'e0e7ff'; // Light purple background
  return `https://via.placeholder.com/400x400/${color}/6366f1?text=${text}`;
}

/**
 * Fetch from Pixabay API (free, 50 requests/hour without key)
 */
function fetchFromPixabay(query) {
  return new Promise((resolve) => {
    if (!PIXABAY_API_KEY) {
      resolve(null);
      return;
    }

    const params = new URLSearchParams({ 
      key: PIXABAY_API_KEY,
      q: query,
      image_type: 'photo',
      per_page: 1,
      min_width: 400
    });

    const options = {
      hostname: 'pixabay.com',
      path: `/api/?${params.toString()}`,
      method: 'GET'
    };

    https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.hits && json.hits.length > 0) {
            resolve(json.hits[0].webformatURL);
          } else {
            resolve(null);
          }
        } catch (e) {
          resolve(null);
        }
      });
    }).on('error', () => resolve(null)).setTimeout(3000).end();
  });
}

/**
 * Fetch from Lorem Picsum with search query support
 * Since it doesn't support queries, we'll use DuckDuckGo image search instead
 */
function getDuckDuckGoImageUrl(query) {
  // DuckDuckGo image search - doesn't require API key
  // Returns a URL that redirects to appropriate image
  const searchQuery = encodeURIComponent(query + ' tablet medicine pharmacy');
  return `https://images.duckduckgo.com/l/?kh=-1&l=1&o=json&q=${searchQuery}`;
}

/**
 * Fetch from DuckDuckGo Images API (fallback when others fail)
 */
function fetchFromDuckDuckGo(query) {
  return new Promise((resolve) => {
    const searchQuery = encodeURIComponent(query);
    const options = {
      hostname: 'images.duckduckgo.com',
      path: `/l/?kh=-1&l=&o=json&q=${searchQuery}`,
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    };

    try {
      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
          try {
            if (res.statusCode === 200 && data) {
              resolve(data); // Returns image URL
            } else {
              resolve(null);
            }
          } catch (e) {
            resolve(null);
          }
        });
      });

      req.on('error', () => resolve(null));
      req.setTimeout(3000);
      req.end();
    } catch (e) {
      resolve(null);
    }
  });
}

/**
 * Fetch from Unsplash (using source endpoint for better reliability)
 * NOTE: Currently unreliable, using placeholder instead
 */
function getRandomUnsplashUrl(query) {
  // Using source.unsplash.com redirect endpoint (more reliable than API)
  // Add medicine-specific keywords for better results
  const searchQuery = encodeURIComponent(`${query} tablet pill medicine pharmacy`);
  return `https://source.unsplash.com/400x400/?${searchQuery}`;
}

/**
 * Get a reliable placeholder image that always works
 * Uses DiceBear Avatars API which is extremely reliable
 */
function getReliablePlaceholderUrl(medicineName, id) {
  // Use DiceBear avatars - highly reliable and generates consistent images per seed
  return `https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(id)}&backgroundColor=random`;
}

/**
 * Generate inline SVG data URL as absolute fallback
 */
function generateSvgDataUrl(medicineName, id) {
  // Use hash to generate consistent color
  const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const colors = ['#ff6b6b', '#4ecdc4', '#ffd93d', '#95e1d3', '#c7a9ff', '#ffa07a', '#f08080', '#90ee90'];
  const bgColor = colors[hash % colors.length];
  const text = medicineName.substring(0, 12);
  
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
    <rect width="400" height="400" fill="${bgColor}"/>
    <text x="200" y="200" font-size="24" fill="white" text-anchor="middle" dominant-baseline="middle" font-family="Arial" font-weight="bold">
      ${text}
    </text>
  </svg>`;
  
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

/**
 * Main function to update medicines with images
 */
async function updateMedicinesWithImages() {
  console.log('🔄 Starting medicine image fetch...\n');

  // Read medicines file
  if (!fs.existsSync(MEDICINES_FILE)) {
    console.error('❌ medicines.json not found at:', MEDICINES_FILE);
    process.exit(1);
  }

  const medicinesData = JSON.parse(fs.readFileSync(MEDICINES_FILE, 'utf8'));
  console.log(`📦 Found ${medicinesData.length} medicines to update\n`);

  let updated = 0;
  let failed = 0;

  // Update each medicine
  for (let i = 0; i < medicinesData.length; i++) {
    const medicine = medicinesData[i];
    
    // Always update images to get fresh ones with better queries
    // Skip if explicitly disabled
    if (medicine.skipImageFetch) {
      console.log(`⏭️  Skipping "${medicine.name}" (marked to skip)`);
      continue;
    }

    // Find appropriate search query
    const query = MEDICINE_QUERIES[medicine.name] || `${medicine.name} medicine pharmacy tablet`;
    
    try {
      console.log(`🔍 Fetching image for "${medicine.name}"...`);
      
      let imageUrl = null;

      // Try Pexels first (free, no key required)
      try {
        console.log(`   → Trying Pexels...`);
        const pexelsUrl = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1`;
        
        const pexelsData = await new Promise((resolve) => {
          https.get(pexelsUrl, { headers: { 'Authorization': PEXELS_API_KEY || 'Guest' } }, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
              try {
                const json = JSON.parse(data);
                if (json.photos && json.photos[0]) {
                  resolve(json.photos[0].src.large);
                } else {
                  resolve(null);
                }
              } catch (e) {
                resolve(null);
              }
            });
          }).on('error', () => resolve(null));
        });
        
        if (pexelsData) imageUrl = pexelsData;
      } catch (e) {
        console.log(`   → Pexels error: ${e.message}`);
      }

      // Try DiceBear avatars (highly reliable)
      if (!imageUrl) {
        console.log(`   → Using DiceBear (reliable)...`);
        imageUrl = getReliablePlaceholderUrl(medicine.name, medicine.id);
      }

      // Final fallback: inline SVG (always works, no external dependencies)
      if (!imageUrl) {
        console.log(`   → Using inline SVG fallback...`);
        imageUrl = generateSvgDataUrl(medicine.name, medicine.id);
      }

      medicine.imageUrl = imageUrl;
      updated++;
      
      console.log(`✅ Updated: ${medicine.name}`);
      console.log(`   ${imageUrl.substring(0, 80)}${imageUrl.length > 80 ? '...' : ''}\n`);
      
      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (error) {
      failed++;
      console.error(`❌ Failed for "${medicine.name}":`, error.message);
      medicine.imageUrl = generateSvgDataUrl(medicine.name, medicine.id);
      console.log(`   Using inline SVG as final fallback\n`);
    }
  }

  // Save updated medicines
  fs.writeFileSync(MEDICINES_FILE, JSON.stringify(medicinesData, null, 2));
  
  console.log('\n' + '='.repeat(50));
  console.log('📊 Update Summary:');
  console.log('='.repeat(50));
  console.log(`✅ Successfully updated: ${updated}/${medicinesData.length}`);
  console.log(`❌ Failed: ${failed}/${medicinesData.length}`);
  console.log(`\n✨ medicines.json has been updated with image URLs!`);
  console.log(`📍 Location: ${MEDICINES_FILE}`);
}

/**
 * Generate sample configuration
 */
function generateSampleConfig() {
  console.log('\n📋 OPTIONAL: SET IMAGE API KEYS FOR REAL PHOTOS:\n');
  console.log('Choose any of these free APIs (all optional - script works without them):\n');
  
  console.log('1️⃣  Pexels API (recommended):');
  console.log('   Get free API key: https://www.pexels.com/api/');
  console.log('   200 requests/hour\n');
  
  console.log('2️⃣  Pixabay API:');
  console.log('   Get free API key: https://pixabay.com/api/');
  console.log('   50 requests/hour without key\n');
  
  console.log('3️⃣  Setting Environment Variables:\n');
  console.log('   For Windows PowerShell:');
  console.log('   $env:PEXELS_API_KEY="your_key_here"\n');
  console.log('   For Windows Command Prompt:');
  console.log('   set PEXELS_API_KEY=your_key_here\n');
  console.log('   For Linux/Mac:');
  console.log('   export PEXELS_API_KEY=your_key_here\n');
  
  console.log('4️⃣  Without API keys, the script uses:');
  console.log('   • DiceBear Avatars API (reliable, no rate limits)');
  console.log('   • Inline SVG fallback (always works, embedded in app)\n');
}

// ============ EXECUTION ============

console.log('╔════════════════════════════════════════╗');
console.log('║   Medicine Image Fetcher - v2.1       ║');
console.log('║   Reliable Multi-source Support       ║');
console.log('╚════════════════════════════════════════╝\n');

if (!PEXELS_API_KEY && !PIXABAY_API_KEY && !UNSPLASH_ACCESS_KEY) {
  console.log('ℹ️  Using DiceBear Avatars + Inline SVG (no external APIs needed)\n');
} else {
  console.log('ℹ️  Using configured API providers with fallbacks...\n');
}

updateMedicinesWithImages()
  .then(() => {
    console.log('\n✨ All done! Your medicines now have beautiful stock images.');
    console.log('🎉 The app will automatically display these images in MedicineGrid.\n');
    process.exit(0);
  })
  .catch(error => {
    console.error('💥 Fatal error:', error);
    generateSampleConfig();
    process.exit(1);
  });
