#!/usr/bin/env node

/**
 * Generate Open Graph image for social media link previews
 * This script creates an OG image with the HeritageHouse Ministries logo
 */

const fs = require('fs');
const path = require('path');

// Check if sharp is installed
let sharp;
try {
  sharp = require('sharp');
} catch (e) {
  console.error('Error: sharp is not installed. Install it with: npm install sharp');
  process.exit(1);
}

async function generateOGImage() {
  try {
    const publicDir = path.join(__dirname, '../public');
    const logoPath = path.join(publicDir, 'logo.png');
    const outputPath = path.join(publicDir, 'og-image.jpg');

    // Check if logo exists
    if (!fs.existsSync(logoPath)) {
      console.error(`Error: Logo not found at ${logoPath}`);
      process.exit(1);
    }

    console.log('Generating Open Graph image...');

    // Create a 1200x630 image (standard OG size)
    // Background: Dark gradient
    // Logo: Centered
    // Text: HeritageHouse Ministries

    const width = 1200;
    const height = 630;

    // Create SVG overlay with text
    const svgOverlay = `
      <svg width="${width}" height="${height}">
        <!-- Background gradient -->
        <defs>
          <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#0a0a0a;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#1a1a2e;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="${width}" height="${height}" fill="url(#bgGradient)"/>
        
        <!-- Accent line -->
        <line x1="0" y1="315" x2="${width}" y2="315" stroke="#42a7c0" stroke-width="2" opacity="0.3"/>
        
        <!-- Text -->
        <text x="${width / 2}" y="550" font-family="Georgia, serif" font-size="48" font-weight="bold" fill="white" text-anchor="middle">
          HeritageHouse Ministries
        </text>
        <text x="${width / 2}" y="590" font-family="Arial, sans-serif" font-size="24" fill="#42a7c0" text-anchor="middle">
          Port Harcourt, Rivers State
        </text>
      </svg>
    `;

    // Create the OG image
    const buffer = Buffer.from(svgOverlay);

    // Start with the SVG background
    let image = sharp({
      create: {
        width,
        height,
        channels: 3,
        background: { r: 10, g: 10, b: 10 },
      },
    });

    // Composite the logo in the center
    image = image
      .composite([
        {
          input: logoPath,
          top: Math.floor((height - 200) / 2),
          left: Math.floor((width - 200) / 2),
          blend: 'over',
        },
      ])
      .composite([
        {
          input: buffer,
          blend: 'over',
        },
      ]);

    // Save as JPEG
    await image.jpeg({ quality: 90 }).toFile(outputPath);

    console.log(`✅ Open Graph image generated successfully at ${outputPath}`);
    console.log(`   Size: ${width}x${height}px`);
    console.log(`   Format: JPEG`);
  } catch (error) {
    console.error('Error generating OG image:', error.message);
    process.exit(1);
  }
}

generateOGImage();
