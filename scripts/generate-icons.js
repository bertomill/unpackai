#!/usr/bin/env node

/**
 * Icon generation script for PWA
 * This script creates placeholder icons for the PWA
 * In production, you should replace these with actual designed icons
 */

const fs = require('fs');
const path = require('path');

// Icon sizes required for PWA
const iconSizes = [
  { size: 16, name: 'icon-16x16.png' },
  { size: 32, name: 'icon-32x32.png' },
  { size: 72, name: 'icon-72x72.png' },
  { size: 96, name: 'icon-96x96.png' },
  { size: 128, name: 'icon-128x128.png' },
  { size: 144, name: 'icon-144x144.png' },
  { size: 152, name: 'icon-152x152.png' },
  { size: 192, name: 'icon-192x192.png' },
  { size: 384, name: 'icon-384x384.png' },
  { size: 512, name: 'icon-512x512.png' }
];

// Create a simple SVG icon as base64 data URL
const createIconSVG = (size) => {
  return `data:image/svg+xml;base64,${Buffer.from(`
<svg width="${size}" height="${size}" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#2383e2;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1a6bb8;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="iconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#ffffff;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#f0f9ff;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <circle cx="256" cy="256" r="240" fill="url(#bgGradient)" stroke="#1a6bb8" stroke-width="8"/>
  
  <g fill="url(#iconGradient)">
    <ellipse cx="256" cy="220" rx="80" ry="60" fill="url(#iconGradient)"/>
    
    <circle cx="200" cy="180" r="12" fill="url(#iconGradient)"/>
    <circle cx="256" cy="160" r="12" fill="url(#iconGradient)"/>
    <circle cx="312" cy="180" r="12" fill="url(#iconGradient)"/>
    <circle cx="180" cy="240" r="12" fill="url(#iconGradient)"/>
    <circle cx="256" cy="220" r="12" fill="url(#iconGradient)"/>
    <circle cx="332" cy="240" r="12" fill="url(#iconGradient)"/>
    <circle cx="200" cy="300" r="12" fill="url(#iconGradient)"/>
    <circle cx="256" cy="280" r="12" fill="url(#iconGradient)"/>
    <circle cx="312" cy="300" r="12" fill="url(#iconGradient)"/>
    
    <g stroke="url(#iconGradient)" stroke-width="3" fill="none" opacity="0.8">
      <line x1="200" y1="180" x2="256" y2="160"/>
      <line x1="256" y1="160" x2="312" y2="180"/>
      <line x1="200" y1="180" x2="180" y2="240"/>
      <line x1="256" y1="160" x2="256" y2="220"/>
      <line x1="312" y1="180" x2="332" y2="240"/>
      <line x1="180" y1="240" x2="256" y2="220"/>
      <line x1="256" y1="220" x2="332" y2="240"/>
      <line x1="180" y1="240" x2="200" y2="300"/>
      <line x1="256" y1="220" x2="256" y2="280"/>
      <line x1="332" y1="240" x2="312" y2="300"/>
      <line x1="200" y1="300" x2="256" y2="280"/>
      <line x1="256" y1="280" x2="312" y2="300"/>
    </g>
    
    <rect x="220" y="320" width="72" height="8" rx="4" fill="url(#iconGradient)"/>
    <rect x="220" y="340" width="60" height="8" rx="4" fill="url(#iconGradient)"/>
    <rect x="220" y="360" width="50" height="8" rx="4" fill="url(#iconGradient)"/>
  </g>
</svg>
  `).toString('base64')}`;
};

// Create placeholder files for each icon size
const iconsDir = path.join(__dirname, '..', 'public', 'icons');

if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

console.log('Creating PWA icon placeholders...');

iconSizes.forEach(({ size, name }) => {
  const filePath = path.join(iconsDir, name);
  
  // Create a simple HTML file that can be converted to PNG
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { margin: 0; padding: 0; width: ${size}px; height: ${size}px; }
    .icon { width: 100%; height: 100%; }
  </style>
</head>
<body>
  <div class="icon">
    <svg width="${size}" height="${size}" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#2383e2;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#1a6bb8;stop-opacity:1" />
        </linearGradient>
        <linearGradient id="iconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#ffffff;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#f0f9ff;stop-opacity:1" />
        </linearGradient>
      </defs>
      
      <circle cx="256" cy="256" r="240" fill="url(#bgGradient)" stroke="#1a6bb8" stroke-width="8"/>
      
      <g fill="url(#iconGradient)">
        <ellipse cx="256" cy="220" rx="80" ry="60" fill="url(#iconGradient)"/>
        
        <circle cx="200" cy="180" r="12" fill="url(#iconGradient)"/>
        <circle cx="256" cy="160" r="12" fill="url(#iconGradient)"/>
        <circle cx="312" cy="180" r="12" fill="url(#iconGradient)"/>
        <circle cx="180" cy="240" r="12" fill="url(#iconGradient)"/>
        <circle cx="256" cy="220" r="12" fill="url(#iconGradient)"/>
        <circle cx="332" cy="240" r="12" fill="url(#iconGradient)"/>
        <circle cx="200" cy="300" r="12" fill="url(#iconGradient)"/>
        <circle cx="256" cy="280" r="12" fill="url(#iconGradient)"/>
        <circle cx="312" cy="300" r="12" fill="url(#iconGradient)"/>
        
        <g stroke="url(#iconGradient)" stroke-width="3" fill="none" opacity="0.8">
          <line x1="200" y1="180" x2="256" y2="160"/>
          <line x1="256" y1="160" x2="312" y2="180"/>
          <line x1="200" y1="180" x2="180" y2="240"/>
          <line x1="256" y1="160" x2="256" y2="220"/>
          <line x1="312" y1="180" x2="332" y2="240"/>
          <line x1="180" y1="240" x2="256" y2="220"/>
          <line x1="256" y1="220" x2="332" y2="240"/>
          <line x1="180" y1="240" x2="200" y2="300"/>
          <line x1="256" y1="220" x2="256" y2="280"/>
          <line x1="332" y1="240" x2="312" y2="300"/>
          <line x1="200" y1="300" x2="256" y2="280"/>
          <line x1="256" y1="280" x2="312" y2="300"/>
        </g>
        
        <rect x="220" y="320" width="72" height="8" rx="4" fill="url(#iconGradient)"/>
        <rect x="220" y="340" width="60" height="8" rx="4" fill="url(#iconGradient)"/>
        <rect x="220" y="360" width="50" height="8" rx="4" fill="url(#iconGradient)"/>
      </g>
    </svg>
  </div>
</body>
</html>
  `;
  
  // For now, create a simple text file with instructions
  const instructions = `# Icon: ${name} (${size}x${size})

This is a placeholder for the PWA icon. To complete the PWA setup:

1. Replace this file with an actual ${size}x${size} PNG image
2. The icon should represent your app (AI News Hub)
3. Use the design from the SVG template in icon.svg
4. Ensure the icon looks good at this size

For now, you can use the SVG directly or convert it to PNG using:
- Online tools like convertio.co
- Command line tools like ImageMagick
- Design tools like Figma, Sketch, or Adobe Illustrator

The icon should have:
- A clear, recognizable design
- Good contrast
- Appropriate detail level for the size
- Consistent branding with your app

SVG Template: ${createIconSVG(size)}
`;

  fs.writeFileSync(filePath.replace('.png', '.txt'), instructions);
  console.log(`Created placeholder for ${name}`);
});

console.log('\nPWA icon placeholders created!');
console.log('To complete the setup:');
console.log('1. Replace the .txt files with actual .png images');
console.log('2. Use the SVG template in icon.svg as a reference');
console.log('3. Ensure all icons are properly sized and optimized');
