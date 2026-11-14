// Exact production PNGs from the authored SVG; run npm exec --package=sharp -- node scripts/rasterize-icon.cjs
const fs = require('node:fs');
const sharp = require('sharp');
(async () => {
  fs.mkdirSync('assets/images', { recursive: true });
  await sharp('assets/tissa-icon.svg').resize(1024,1024).png().toFile('assets/images/tissa.png');
  const svg = fs.readFileSync('assets/tissa-icon.svg','utf8');
  // Keep all foreground artwork inside Android's adaptive-icon safe zone.
  const transparent = svg.replace(/<rect[^>]+\/>/, '');
  const foreground = await sharp(Buffer.from(transparent)).resize(680,680).png().toBuffer();
  await sharp({create:{width:1024,height:1024,channels:4,background:{r:0,g:0,b:0,alpha:0}}}).composite([{input:foreground,gravity:'centre'}]).png().toFile('assets/images/tissa-adaptive.png');
  console.log('Exact Tissa icon and safe-zone adaptive foreground generated. Set adaptiveIcon.foregroundImage to ./assets/images/tissa-adaptive.png.');
})().catch(error=>{console.error(error);process.exitCode=1;});
