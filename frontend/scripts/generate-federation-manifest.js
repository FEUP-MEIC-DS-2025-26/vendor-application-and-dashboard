const fs = require('fs');
const path = require('path');
const manifest = require('../federation-manifest').default;

const outDir = path.resolve(__dirname, '../dist');
const outFile = path.join(outDir, 'federation-manifest.json');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

fs.writeFileSync(outFile, JSON.stringify(manifest, null, 2));
console.log('federation-manifest.json generated in dist/');
