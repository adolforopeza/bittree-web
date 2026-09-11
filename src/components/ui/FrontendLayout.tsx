import React from 'react';

export default function FrontendLayout({children, lang}: { children: React.ReactNode, lang?: string }) {
  return (
        <main className="relative flex-grow w-full max-w-md mx-auto px-6 pb-12 flex flex-col items-center">
            {children}
        </main>
  );
}
