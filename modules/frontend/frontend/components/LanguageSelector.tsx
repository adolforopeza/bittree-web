// modules/frontend/frontend/components/LanguageSelector.tsx
import React from 'react';

export default function LanguageSelector() {
  return (
    <div className="text-right">
      <select className="bg-transparent border p-1">
        <option value="es">ES</option>
        <option value="en">EN</option>
      </select>
    </div>
  );
}
