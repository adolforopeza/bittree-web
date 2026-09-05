// src/core/loader/ModuleLoader.ts
import fs from 'fs';
import path from 'path';

export type ModuleManifest = {
  name: string;
  version?: string;
  description?: string;
  enabled?: boolean;
  routes?: { mountPath?: string; serverApi?: string };
  frontend?: { entry?: string };
};

export class ModuleLoader {
  modulesPath: string;
  manifestCache: Map<string, ModuleManifest> = new Map();
  enabledModules: Set<string> = new Set();

  constructor(modulesPath?: string) {
    this.modulesPath = modulesPath || path.join(process.cwd(), 'modules');
    this.loadAllManifests();
  }

  loadAllManifests() {
    this.manifestCache.clear();
    this.enabledModules.clear();

    if (!fs.existsSync(this.modulesPath)) return;

    const names = fs.readdirSync(this.modulesPath, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name);

    for (const name of names) {
      const mpath = path.join(this.modulesPath, name, 'manifest.json');
      if (fs.existsSync(mpath)) {
        try {
          const raw = fs.readFileSync(mpath, 'utf-8');
          const manifest: ModuleManifest = JSON.parse(raw);
          // Ensure name exists
          if (!manifest.name) manifest.name = name;
          this.manifestCache.set(name, manifest);
          if (manifest.enabled) this.enabledModules.add(name);
        } catch (e) {
          // ignore badly formed module manifest
          // could log using a logger when available
        }
      }
    }
  }

  getManifest(name: string) {
    return this.manifestCache.get(name) || null;
  }

  isEnabled(name: string) {
    return this.enabledModules.has(name);
  }

  enable(name: string) {
    if (this.manifestCache.has(name)) this.enabledModules.add(name);
  }

  disable(name: string) {
    this.enabledModules.delete(name);
  }

  listEnabled() {
    return Array.from(this.enabledModules);
  }

  listAll() {
    return Array.from(this.manifestCache.values());
  }

  // For server usage only: dynamic import of a module's server entry (best-effort)
  async importServerEntry(moduleName: string, entry = 'server/index.js') {
    const full = path.join(this.modulesPath, moduleName, entry);
    if (!fs.existsSync(full)) throw new Error('Module entry not found: ' + full);
    // Use require to load server-side code (CommonJS/ESM compatibility depends on build)
    // This is best-effort and should be used only from server API routes.
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require(full);
  }
}

// singleton
const loader = new ModuleLoader();
export default loader;
