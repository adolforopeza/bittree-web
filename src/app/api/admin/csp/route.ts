// src/app/api/admin/csp/route.ts
import { NextRequest, NextResponse } from 'next/server';
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

export async function GET(req: NextRequest) {
  // Protected: only allow server-side calls with admin API key? This is the admin endpoint.
  const apiKey = req.headers.get('x-admin-api-key') || '';
  if (!apiKey || apiKey !== process.env.ADMIN_API_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const cfg = readEffectiveConfig();
  return NextResponse.json({ success: true, config: cfg });
}

export async function POST(req: NextRequest) {
  const apiKey = req.headers.get('x-admin-api-key') || '';
  if (!apiKey || apiKey !== process.env.ADMIN_API_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    if (typeof body !== 'object') throw new Error('Invalid payload');

    // Basic validation: keys are strings, values arrays or booleans
    for (const [k, v] of Object.entries(body)) {
      if (typeof k !== 'string') throw new Error('Invalid key');
      if (!(Array.isArray(v) || typeof v === 'boolean')) throw new Error('Invalid directive value for ' + k);
    }

    const serialized = JSON.stringify(body, null, 2);
    try {
      fs.writeFileSync(TMP_PATH, serialized, 'utf-8');
      inMemoryConfig = body;
    } catch (e) {
      // If writing to /tmp fails (e.g., on some platforms), still keep in memory
      inMemoryConfig = body;
    }

    return NextResponse.json({ success: true, config: inMemoryConfig });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Invalid' }, { status: 400 });
  }
}
