const sharp = require('sharp');
const src = 'C:/Users/chint/.gemini/antigravity-ide/brain/95b226a4-9efe-48bc-8b18-b1fcc6ca4e31/media__1783355750677.jpg';
sharp(src).png().toFile('public/logo.png').then(() => console.log('logo done'));
sharp(src).jpeg().toFile('src/app/icon.jpg').then(() => console.log('icon done'));
