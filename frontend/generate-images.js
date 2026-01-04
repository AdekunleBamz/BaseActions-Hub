const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');

async function generateImages() {
  // Generate icon-512.png
  await sharp(path.join(publicDir, 'icon-512.svg'))
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'icon-512.png'));
  console.log('✓ Generated icon-512.png');

  // Generate icon-192.png for PWA
  await sharp(path.join(publicDir, 'icon-512.svg'))
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, 'icon-192.png'));
  console.log('✓ Generated icon-192.png');

  // Generate favicon.ico (32x32)
  await sharp(path.join(publicDir, 'icon-512.svg'))
    .resize(32, 32)
    .png()
    .toFile(path.join(publicDir, 'favicon.png'));
  console.log('✓ Generated favicon.png');

  // Generate og-image.png
  await sharp(path.join(publicDir, 'og-image.svg'))
    .resize(1200, 630)
    .png()
    .toFile(path.join(publicDir, 'og-image.png'));
  console.log('✓ Generated og-image.png');

  // Generate splash.png for Farcaster
  await sharp(path.join(publicDir, 'splash.svg'))
    .resize(1200, 1200)
    .png()
    .toFile(path.join(publicDir, 'splash.png'));
  console.log('✓ Generated splash.png');

  // Generate apple-touch-icon
  await sharp(path.join(publicDir, 'icon-512.svg'))
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));
  console.log('✓ Generated apple-touch-icon.png');

  console.log('\n🎉 All images generated successfully!');
}

generateImages().catch(console.error);
