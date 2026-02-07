import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation } from 'react-router-dom';
import { Search, Menu, X } from 'lucide-react';

// Navigation sections with paths
const NAV_SECTIONS = [
    { name: 'ANALYSIS', path: '/analysis' },
    { name: 'VOICES', path: '/voices' },
    { name: 'MEDIA', path: '/media' },
    { name: 'THE STORE', path: '/store' },
    { name: 'FOUNDATIONS', path: '/foundations' },
    { name: 'THE ARCHIVE', path: '/archive' },
    { name: 'BOOKSHELF', path: '/bookshelf' },
    { name: 'CIRCLES', path: '/circles' },
    { name: 'WHO WE ARE', path: '/about' },
];

export default function MobileNav() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();

    // Prevent scrolling when menu is open
    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [mobileMenuOpen]);

    // C2: Check if current path matches nav item
    const isActivePath = (path: string) => {
        return location.pathname === path || location.pathname.startsWith(path + '/');
    };

    return (
        <>
            <div className="md:hidden bg-neutral-900 text-white border-b border-neutral-800 h-20 flex items-center justify-between px-4 sticky top-0 z-40">
                <Link to="/">
                    <img
                        src="https://i.ibb.co/fzFr1hQY/full-logo-white-1.png"
                        alt="Voxummah"
                        className="h-10 w-auto object-contain"
                    />
                </Link>

                <div className="flex items-center space-x-5">
                    {/* M1: Aria-label for accessibility */}
                    <button
                        className="text-neutral-400 hover:text-white min-h-[44px] min-w-[44px] flex items-center justify-center"
                        aria-label="Search articles"
                    >
                        <Search size={20} />
                    </button>
                    <button
                        className="text-white hover:text-brand-red transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                        aria-expanded={mobileMenuOpen}
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay - Principle 11: Render via Portal */}
            {mobileMenuOpen && createPortal(
                <div
                    className="md:hidden bg-neutral-900 fixed inset-0 z-[9999] overflow-y-auto"
                    style={{ top: '80px' }} // Offset for the header
                >
                    <nav className="px-6 py-6 space-y-2" role="navigation" aria-label="Mobile navigation">
                        {NAV_SECTIONS.map(section => (
                            <Link
                                key={section.name}
                                to={section.path}
                                onClick={() => setMobileMenuOpen(false)}
                                className={`block text-lg font-sans font-bold tracking-wide py-3 min-h-[44px] transition-colors duration-300 ease-out ${isActivePath(section.path)
                                    ? 'text-brand-red border-l-2 border-brand-red pl-4 bg-neutral-800'
                                    : 'text-white border-l-2 border-transparent hover:text-brand-nav-hover'
                                    }`}
                            >
                                {section.name}
                            </Link>
                        ))}
                        <div className="pt-6 border-t border-neutral-800 mt-6 space-y-4">
                            {/* C1: Fixed admin link to Ghost */}
                            <a
                                href="https://voxtest.ghost.io/ghost"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block w-full text-left text-neutral-400 font-bold uppercase text-sm font-sans min-h-[44px] flex items-center"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Admin Dashboard
                            </a>
                            <button className="w-full bg-brand-red text-white font-bold uppercase text-sm py-3 rounded-sm font-sans tracking-wider min-h-[44px] hover:opacity-90 transition-opacity">
                                Subscribe
                            </button>
                        </div>
                    </nav>
                </div>,
                document.body
            )}
        </>
    );
}
