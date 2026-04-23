const fs = require('fs');
const path = require('path');

function svg(w, h, bg, emoji, label) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
  <rect width="100%" height="100%" fill="${bg}"/>
  <text x="50%" y="40%" text-anchor="middle" font-size="48">${emoji}</text>
  <text x="50%" y="70%" text-anchor="middle" font-family="sans-serif" font-size="14" fill="#fff">${label}</text>
</svg>`;
}

const cats = {
  'rods': ['🎣', '#2d5a3d'], 'reels': ['⚙️', '#3d4a5a'], 'feeders': ['🥣', '#5a4a2d'],
  'baits': ['🪱', '#6b4423'], 'rigs': ['🪝', '#4a3d5a'], 'lines': ['🧵', '#2d4a5a'],
  'accessories': ['🎒', '#5a3d3d']
};

const products = {
  'drennan-acolyte-feeder': ['🎣','Drennan Acolyte'], 'shimano-beastmaster-method': ['🎣','Shimano Beastmaster'],
  'preston-magnitude': ['🎣','Preston Magnitude'], 'guru-ngauge-feeder': ['🎣','Guru N-Gauge'],
  'shimano-baitrunner-st': ['⚙️','Shimano Baitrunner'], 'daiwa-nzon-distance': ['⚙️','Daiwa N\'Zon'],
  'preston-centris': ['⚙️','Preston Centris'],
  'guru-xchange-feeder': ['🥣','Guru X-Change'], 'drennan-flat-method': ['🥣','Drennan Flat Method'],
  'preston-icm-method': ['🥣','Preston ICM'], 'korda-banjo-method': ['🥣','Korda Banjo'],
  'map-qx-method': ['🥣','MAP QX Method'],
  'dynamite-swim-stim': ['🪱','Swim Stim Mix'], 'sonubaits-supercrush': ['🪱','Supercrush'],
  'guru-method-pellets': ['🪱','Method Pellets'], 'mainline-cell-method': ['🪱','Mainline Cell'],
  'baittech-special-g': ['🪱','Special G Gold'],
  'guru-method-hair-rigs': ['🪝','Method Hair Rigs'], 'preston-kkm-b': ['🪝','KKM-B Hooks'],
  'drennan-pushstop-rigs': ['🪝','Pushstop Rigs'], 'korda-method-rigs': ['🪝','Korda Rigs'],
  'guru-ngauge-pro': ['🧵','N-Gauge Pro'], 'drennan-feeder-mono': ['🧵','Feeder Mono'],
  'guru-method-mould': ['🎒','Method Mould'], 'preston-method-rest': ['🎒','Method Rest'],
  'drennan-method-net': ['🎒','Landing Net']
};

const base = path.join(__dirname, 'public', 'images');
for (const [name, [emoji, bg]] of Object.entries(cats)) {
  fs.writeFileSync(path.join(base, 'categories', name + '.svg'), svg(400, 300, bg, emoji, name.charAt(0).toUpperCase() + name.slice(1)));
}
for (const [name, [emoji, label]] of Object.entries(products)) {
  fs.writeFileSync(path.join(base, 'products', name + '.svg'), svg(400, 400, '#1e293b', emoji, label));
}
console.log('Generated', Object.keys(cats).length, 'category +', Object.keys(products).length, 'product images');

