// modules/frontend/frontend/components/Footer.tsx
import React from 'react';

interface FooterProps {
    availabilityNote?: string,
    rightsText?: string
}

export default function Footer({availabilityNote, rightsText}: FooterProps) {
    return (
        <footer className="mt-8 text-center text-sm text-slate-500">
            © {new Date().getFullYear()} Bettree
        </footer>
    );
}
