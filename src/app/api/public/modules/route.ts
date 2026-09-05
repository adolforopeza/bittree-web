// src/app/api/public/modules/route.ts
import { NextResponse } from 'next/server';
import manager from '@/core/module-manager';

export async function GET() {
  const all = manager.getAll();
  const enabled = manager.getEnabled();
  return NextResponse.json({ success: true, modules: all, enabled });
}
