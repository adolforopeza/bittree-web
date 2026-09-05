// src/app/api/public/csp/route.ts
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const TMP_PATH = '/tmp/csp-config.json';
const DEFAULT_PATH = path.join(process.cwd(), 'src', 'core', 'security', 'csp', 'config.default.json');

function readDefaultConfig() {
  try {
    const raw = fs.readFileSync(DEFAULT_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch (e) {
    return {};
  }
}

let inMemoryConfig: any = null;

function readEffectiveConfig() {
  if (inMemoryConfig) return inMemoryConfig;
  if (fs.existsSync(TMP_PATH)) {
    try {
      const raw = fs.readFileSync(TMP_PATH, 'utf-8');
      inMemoryConfig = JSON.parse(raw);
      return inMemoryConfig;
    } catch (e) {
      // fallback
    }
  }
  inMemoryConfig = readDefaultConfig();
  return inMemoryConfig;
}

export async function GET() {
  const cfg = readEffectiveConfig();
  // Public read-only endpoint: safe to expose
  return NextResponse.json({ success: true, config: cfg });
}
