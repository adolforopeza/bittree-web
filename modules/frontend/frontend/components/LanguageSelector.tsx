// modules/frontend/frontend/components/LanguageSelector.tsx
import React from 'react';

interface LanguageSelectorProps {
    currentLang?: string
}

export default function LanguageSelector({currentLang}: LanguageSelectorProps) {
    return (
        <div className="text-right">
            <select className="bg-transparent border p-1">
                <option value="es">ES</option>
                <option value="en">EN</option>
            </select>
        </div>
    );
}
