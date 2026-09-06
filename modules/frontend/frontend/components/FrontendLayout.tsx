// modules/frontend/frontend/components/FrontendLayout.tsx
import React from 'react';

export default function FrontendLayout({children, lang}: { children: React.ReactNode, lang?: string }) {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <main className="container mx-auto py-8">{children}</main>
    </div>
  );
}
