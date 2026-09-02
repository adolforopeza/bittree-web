// src/modules/frontend/components/Footer.tsx
interface FooterProps {
    availabilityNote: string;
    rightsText: string;
}

export function Footer({ availabilityNote, rightsText }: FooterProps) {
    return (
        <div>
            <aside className="mt-4 mb-4 text-center">
                <p className="text-neutral-500 text-[11px]">
                    <i className="fa-solid fa-circle-info text-sm text-emerald-600 mr-1" />
                    <span>{availabilityNote}</span>
                </p>
            </aside>
            <footer className="w-full border-t border-neutral-800 py-6 mt-auto">
                <div className="max-w-2xl mx-auto px-4 flex flex-col md:flex-row justify-center items-center gap-4">
                    <p className="text-neutral-500 text-[11px]">&copy; 2026 Adolfo Oropeza. <span>{rightsText}</span></p>
                </div>
            </footer>
        </div>
    );
}