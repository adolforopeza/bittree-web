// src/app/api/admin/modules/route.ts
import { NextRequest, NextResponse } from 'next/server';
import manager from '@/core/module-manager';

const ADMIN_KEY_HEADER = 'x-admin-api-key';

export async function GET(req: NextRequest) {
  const apiKey = req.headers.get(ADMIN_KEY_HEADER) || '';
  if (!apiKey || apiKey !== process.env.ADMIN_API_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const all = manager.getAll();
  const enabled = manager.getEnabled();
  return NextResponse.json({ success: true, modules: all, enabled });
}

export async function POST(req: NextRequest) {
  const apiKey = req.headers.get(ADMIN_KEY_HEADER) || '';
  if (!apiKey || apiKey !== process.env.ADMIN_API_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { action, module } = body as { action?: string; module?: string };
    if (!action || !module) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });

    if (action === 'enable') manager.enable(module);
    else if (action === 'disable') manager.disable(module);
    else return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

    return NextResponse.json({ success: true, enabled: manager.getEnabled() });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Invalid' }, { status: 400 });
  }
}
