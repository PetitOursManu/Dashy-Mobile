const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const path = require('path');

const out = path.resolve(__dirname, '../assets/splash-logo.png');
const size = 512;
const canvas = createCanvas(size, size);
const ctx = canvas.getContext('2d');

const foregroundPath = path.resolve(__dirname, '../assets/android-icon-foreground.png');

loadImage(foregroundPath).then((img) => {
  ctx.clearRect(0, 0, size, size);
  ctx.save();
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2 - 2, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, size, size);
  const logoSize = size * 0.55;
  ctx.drawImage(img, (size - logoSize) / 2, (size - logoSize) / 2, logoSize, logoSize);
  ctx.restore();
  fs.writeFileSync(out, canvas.toBuffer('image/png'));
  console.log('Created', out);
}).catch((e) => { console.error(e); process.exit(1); });
