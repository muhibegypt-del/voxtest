import { Search, Menu, X } from 'lucide-react';
import { useState } from 'react';

// List of sections based on project schema
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

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const renderNavLinks = () => (
    <>
      {NAV_SECTIONS.map(section => (
        <a 
          key={section.name} 
          href={section.path} 
          // UPDATED: 'text-sm' maps to new strict scale. 
          // 'hover:text-brand-red' uses the new semantic token.
          className="text-sm font-medium hover:text-brand-red transition-colors"
        >
          {section.name}
        </a>
      ))}
    </>
  );

  return (
    // UPDATED: bg-neutral-900 maps to #111111 (Ink Black)
    <header className="bg-neutral-900 text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <img
              src="/Voxummah.png"
              alt="Voxummah"
              className="h-10 w-auto"
            />

            <nav className="hidden md:flex items-center space-x-6">
              {renderNavLinks()}
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <button className="hover:text-brand-red transition-colors">
              <Search size={20} />
            </button>

            <button
              className="md:hidden hover:text-brand-red transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        // UPDATED: 
        // 1. bg-neutral-800 maps to #262626 (Dark Grey)
        // 2. border-neutral-600 maps to #525252 (Closest strict border color for dark mode)
        <div className="md:hidden bg-neutral-800 border-t border-neutral-600">
          <nav className="px-4 py-4 space-y-3">
            {NAV_SECTIONS.map(section => (
              <a 
                key={section.name} 
                href={section.path} 
                className="block text-sm font-medium hover:text-brand-red transition-colors"
              >
                {section.name}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}