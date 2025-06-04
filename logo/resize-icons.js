// resize-icons.js
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const originalsFiles = [
  'jobby-logo-rounded.png',
  'jobby-logo-square-shaped.png',
];

const outputDir = 'icons';

// Liste des tailles à générer
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
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

  for (const originalFile of originalsFiles) {
    const inputFile = path.join(__dirname, originalFile);
    if (!fs.existsSync(inputFile)) {
      console.error(`Fichier introuvable : ${inputFile}`);
      continue;
    }

    for (const { name, size } of sizes) {
      const outputFile = path.join(outputDir, `${name}-${originalFile}`);
      await sharp(inputFile)
        .resize(size, size)
        .toFile(outputFile);
      console.log(`Généré : ${outputFile}`);
    }
  }

  console.log('✔️ Tous les fichiers ont été générés.');
})().catch(err => {
  console.error('Erreur lors de la génération des icônes :', err);
  process.exit(1);
});