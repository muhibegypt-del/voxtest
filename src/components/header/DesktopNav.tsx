import { Link, useLocation } from 'react-router-dom';

// Navigation sections
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

export default function DesktopNav() {
    const location = useLocation();

    // C2: Check if current path matches nav item
    const isActivePath = (path: string) => {
        return location.pathname === path || location.pathname.startsWith(path + '/');
    };

    return (
        <div className="bg-neutral-900/95 backdrop-blur-sm border-b border-neutral-800 hidden md:block">
            <div className="max-w-7xl mx-auto px-4">
                <nav className="flex items-center justify-center h-14" role="navigation" aria-label="Main navigation">
                    <ul className="flex space-x-10">
                        {NAV_SECTIONS.map(section => (
                            <li key={section.name}>
                                <Link
                                    to={section.path}
                                    className={`text-sm font-sans font-bold tracking-widest pb-2 transition-colors duration-300 ease-out relative top-[1px] ${isActivePath(section.path)
                                        ? 'text-white border-b-2 border-brand-red'
                                        : 'text-neutral-400 hover:text-brand-nav-hover border-b-2 border-transparent'
                                        }`}
                                    aria-current={isActivePath(section.path) ? 'page' : undefined}
                                >
                                    {section.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </div>
    );
}
