const fs = require('node:fs');
const path = require('node:path');

const cachePath = path.join(process.cwd(), '.next', 'cache');
fs.rmSync(cachePath, { recursive: true, force: true });
console.log('Purged local Next.js build cache');
