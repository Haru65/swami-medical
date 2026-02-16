#!/usr/bin/env node

/**
 * Local SVG Medicine Image Generator
 * Generates beautiful SVG images locally without any external API dependencies
 * 
 * Usage: node scripts/generate-images.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '../server/data');
const MEDICINES_FILE = path.join(DATA_DIR, 'medicines.json');
const IMAGES_DIR = path.join(__dirname, '../public/medicine-images');

// Create images directory
if (!fs.existsSync(IMAGES_DIR)) {
  fs.mkdirSync(IMAGES_DIR, { recursive: true });
}

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
  <g transform="translate(120, 60)">
    <!-- Bottle cap -->
    <rect x="40" y="0" width="80" height="20" fill="${color.fg}" rx="3"/>
    <!-- Bottle body -->
    <path d="M 50 20 L 45 100 Q 45 120 65 130 L 155 130 Q 175 120 175 100 L 170 20 Z" fill="${color.fg}" opacity="0.85" stroke="${color.fg}" stroke-width="2"/>
    <!-- Bottle shine -->
    <ellipse cx="100" cy="60" rx="18" ry="35" fill="${color.fg}" opacity="0.3"/>
    <!-- Cross symbol inside bottle (medicine) -->
    <g transform="translate(100, 85)">
      <line x1="0" y1="-15" x2="0" y2="15" stroke="${color.bg}" stroke-width="3" stroke-linecap="round"/>
      <line x1="-15" y1="0" x2="15" y2="0" stroke="${color.bg}" stroke-width="3" stroke-linecap="round"/>
    </g>
  </g>
  
  <!-- Medicine name initials -->
  <text x="200" y="280" font-size="56" font-weight="bold" text-anchor="middle" fill="${color.fg}" font-family="Arial, sans-serif">${initials}</text>
  
  <!-- Medicine name -->
  <text x="200" y="350" font-size="22" text-anchor="middle" fill="${color.fg}" font-family="Arial, sans-serif" font-weight="500">${medicineName.substring(0, 14)}</text>
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
 * Main function
 */
function generateImages() {
  console.log('╔════════════════════════════════════════╗');
  console.log('║   Medicine Image Generator - v1.0     ║');
  console.log('║   Local SVG Generation                ║');
  console.log('╚════════════════════════════════════════╝\n');

  if (!fs.existsSync(MEDICINES_FILE)) {
    console.error('❌ medicines.json not found at:', MEDICINES_FILE);
    process.exit(1);
  }

  const medicinesData = JSON.parse(fs.readFileSync(MEDICINES_FILE, 'utf8'));
  console.log(`🎨 Generating images for ${medicinesData.length} medicines...\n`);

  let generated = 0;

  for (const medicine of medicinesData) {
    try {
      console.log(`🎨 ${medicine.name}...`);
      const svgContent = generateMedicineImage(medicine.name, medicine.id);
      const imageUrl = saveImageFile(medicine.id, svgContent);
      medicine.imageUrl = imageUrl;
      generated++;
      console.log(`   ✅ ${imageUrl}`);
    } catch (error) {
      console.error(`   ❌ Error: ${error.message}`);
    }
  }

  // Save updated medicines
  fs.writeFileSync(MEDICINES_FILE, JSON.stringify(medicinesData, null, 2));

  console.log('\n' + '='.repeat(50));
  console.log(`✅ Generated ${generated}/${medicinesData.length} images`);
  console.log(`📍 Saved to: ${IMAGES_DIR}`);
  console.log(`📁 medicines.json updated`);
  console.log('='.repeat(50));
  console.log('\n🎉 Ready to serve locally!\n');
}

generateImages();
