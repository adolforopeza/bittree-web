// modules/frontend/frontend/components/Footer.tsx
import React from 'react';

export default function Footer() {
  return (
    <footer className="mt-8 text-center text-sm text-slate-500">
      © {new Date().getFullYear()} Bettree
    </footer>
  );
}
