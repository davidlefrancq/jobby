const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const originalsFiles = [
  'jobby-logo-rounded.png',
  'jobby-logo-square-shaped.png',
];

const outputDir = 'icons';

// List of sizes to generate
const sizes = [
  { name: 'favicon-16', size: 16 },
  { name: 'favicon-24', size: 24 }, // IE9
  { name: 'favicon-32', size: 32 },
  { name: 'icon-48', size: 48 }, // Android
  { name: 'icon-57', size: 57 }, // iPhone anciens
  { name: 'icon-60', size: 60 },
  { name: 'icon-72', size: 72 }, // iPad accueil
  { name: 'icon-83.5', size: 84 }, // iPad rétina (arrondi à 84)
  { name: 'icon-96', size: 96 }, // Google TV
  { name: 'icon-114', size: 114 }, // iPhone 4
  { name: 'icon-128', size: 128 }, // Chrome Web Store
  { name: 'icon-167', size: 167 }, // iPad rétina
  { name: 'icon-180', size: 180 }, // iPhone récents
  { name: 'icon-192', size: 192 }, // Android, PWA
  { name: 'icon-195', size: 195 }, // Opera Speed Dial
];

(async () => {
  // Check if output directory exists, if not create it
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

  for (const originalFile of originalsFiles) {
    // Check input file exists
    const inputFile = path.join(__dirname, originalFile);
    if (!fs.existsSync(inputFile)) {
      console.warn(`⚠️ File not found: ${inputFile}. Skipping...`);
      continue;
    }

    // Generate icons for each size
    for (const { name, size } of sizes) {
      try {
        const newFileName = `${name}-${originalFile}`;
        const isExisting = fs.existsSync(path.join(outputDir, newFileName));
        if (!isExisting) {
          const outputFile = path.join(outputDir, newFileName);
          await sharp(inputFile)
            .resize(size, size)
            .toFile(outputFile);
          console.log(`🟢 ${name} icon generated: ${outputFile}`);        
        }
      } catch (error) {
        console.error(`🔴 Error generating ${name} icon: ${error.message}`);
      }
    }
  }

  // Generate rounded favicon
  try {
    const faviconFileName = `favicon.ico`;
    const faviconOutputFile = path.join(outputDir, faviconFileName);
    if (!fs.existsSync(faviconOutputFile)) {
      await sharp(path.join(__dirname, originalsFiles[0]))
        .resize(128, 128)
        .toFile(faviconOutputFile);
      console.log(`🟢 Rounded favicon generated: ${faviconOutputFile}`);
    } else {
      console.log(`⚠️ Rounded favicon already exists: ${faviconOutputFile}`);
    }
  } catch (error) {
    console.error(`🔴 Error generating rounded favicon: ${error.message}`);
  }

  console.log('🟢 All icons have been generated successfully.');
})().catch(err => {
  console.error('🔴 Error generating icons:', err);
  process.exit(1);
});