// scripts/generate-routers.js
const fs = require('fs');
const path = require('path');

const modulesDir = path.join(process.cwd(), 'modules');
const outDir = path.join(process.cwd(), 'src', '.generated');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const manifests = fs.readdirSync(modulesDir, { withFileTypes: true })
  .filter(d => d.isDirectory())
  .map(d => {
    const mPath = path.join(modulesDir, d.name, 'manifest.json');
    if (!fs.existsSync(mPath)) return null;
    const m = JSON.parse(fs.readFileSync(mPath, 'utf8'));
    m._folder = d.name;
    return m;
  })
  .filter(Boolean);

// Build public routers
const publicRoutes = manifests
  .filter(m => m.enabled && m.routes && m.routes.mountPath)
  .map(m => ({ module: m.name, path: m.routes.mountPath, entry: `modules/${m._folder}/${m.frontend?.entry || ''}` }));

fs.writeFileSync(path.join(outDir, 'public-routers.ts'), `export const publicRouters = ${JSON.stringify(publicRoutes, null, 2)};\n`);

// Build admin routers
const adminRoutes = manifests
  .filter(m => m.enabled && m.admin && m.admin.mountPath)
  .map(m => ({ module: m.name, path: m.admin.mountPath, menu: m.admin.menu || null, api: m.routes?.serverApi || null }));

fs.writeFileSync(path.join(outDir, 'admin-routers.ts'), `export const adminRouters = ${JSON.stringify(adminRoutes, null, 2)};\n`);

// Build api routers (example)
const apiRoutes = manifests
  .filter(m => m.enabled && m.routes && m.routes.serverApi)
  .map(m => ({ module: m.name, api: m.routes.serverApi, handler: `modules/${m._folder}/server` }));

fs.writeFileSync(path.join(outDir, 'api-routers.ts'), `export const apiRouters = ${JSON.stringify(apiRoutes, null, 2)};\n`);

console.log('Generated routers for modules:', manifests.map(m=>m.name));
