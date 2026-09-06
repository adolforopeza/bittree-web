// modules/frontend/frontend/components/ProfileHeader.tsx
import React from 'react';

export default function ProfileHeader({ name, headline }: { name?: string; headline?: string }) {
  return (
    <header className="py-8 text-center">
      <h1 className="text-2xl font-bold">{name}</h1>
      {headline && <p className="text-sm text-slate-400">{headline}</p>}
    </header>
  );
}
