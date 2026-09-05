// src/core/module-manager/index.ts
import fs from 'fs';
import path from 'path';
import loader, { ModuleManifest } from '@/core/loader/ModuleLoader';

const TMP_STATE = '/tmp/modules-state.json';

export class ModuleManager {
  loader = loader;

  constructor() {
    this.restoreState();
  }

  getAll(): ModuleManifest[] {
    return this.loader.listAll();
  }

  getEnabled(): string[] {
    return this.loader.listEnabled();
  }

  enable(name: string) {
    this.loader.enable(name);
    this.persistState();
  }

  disable(name: string) {
    this.loader.disable(name);
    this.persistState();
  }

  persistState() {
    try {
      const state = { enabled: this.getEnabled() };
      fs.writeFileSync(TMP_STATE, JSON.stringify(state, null, 2), 'utf-8');
    } catch (e) {
      // ignore write errors in serverless
    }
  }

  restoreState() {
    try {
      if (fs.existsSync(TMP_STATE)) {
        const raw = fs.readFileSync(TMP_STATE, 'utf-8');
        const state = JSON.parse(raw) as { enabled?: string[] };
        if (state?.enabled) {
          // reset enabled set
          // first disable all
          for (const m of this.loader.listAll()) {
            this.loader.disable(m.name || '');
          }
          for (const name of state.enabled) {
            this.loader.enable(name);
          }
        }
      }
    } catch (e) {
      // ignore
    }
  }
}

const manager = new ModuleManager();
export default manager;
