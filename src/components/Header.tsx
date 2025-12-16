import { Search, Menu, X, User } from 'lucide-react';
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

  const getCurrentDate = () => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <header className="sticky top-0 z-50 flex flex-col font-sans">
      
      {/* ------------------------------------------------------
         DESKTOP LAYER 1: THE MASTHEAD
      ------------------------------------------------------- */}
      {/* Height optimized for "Full Logo" presence */}
      <div className="bg-neutral-900 text-white border-b border-neutral-800 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 h-24 flex items-center justify-between">
          
          {/* LEFT: Date & Context */}
          <div className="w-1/3 flex items-center space-x-4">
            <span className="text-xs font-sans text-neutral-400 font-medium tracking-wide uppercase">
              {getCurrentDate()}
            </span>
          </div>

          {/* CENTER: The Brand (Masthead) */}
          <div className="w-1/3 flex justify-center">
            {/* SCALING LOGIC:
              - h-16 (64px): A standard height for a horizontal "Wordmark" logo in a 96px (h-24) container.
                This leaves ~16px padding top/bottom for perfect optical centering.
              - w-auto: Maintains the exact aspect ratio of your new PNG.
              - object-contain: Ensures no cropping ever occurs.
            */}
            <img
              src="https://i.ibb.co/fzFr1hQY/full-logo-white-1.png"
              alt="Voxummah"
              className="h-16 w-auto object-contain max-w-full" 
            />
          </div>

          {/* RIGHT: Actions */}
          <div className="w-1/3 flex items-center justify-end space-x-6">
            <button className="text-neutral-400 hover:text-white transition-colors flex items-center gap-2 text-xs font-bold tracking-wider uppercase font-sans">
              <User size={16} />
              <span>Sign In</span>
            </button>
            <button className="text-neutral-400 hover:text-brand-red transition-colors">
              <Search size={18} />
            </button>
            <button className="bg-brand-red text-white text-xs font-bold uppercase tracking-widest px-5 py-2 rounded-sm hover:bg-white hover:text-neutral-900 transition-all duration-300 font-sans">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------
         DESKTOP LAYER 2: THE NAVIGATION DECK (Premium Sans)
      ------------------------------------------------------- */}
      <div className="bg-neutral-900/95 backdrop-blur-sm border-b border-neutral-800 hidden md:block">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex items-center justify-center h-14">
            <ul className="flex space-x-10">
              {NAV_SECTIONS.map(section => (
                <li key={section.name}>
                  <a 
                    href={section.path} 
                    // PREMIUM TYPOGRAPHY:
                    // - font-sans + font-bold + tracking-widest = "Geist" / "Helvetica" aesthetic
                    // - text-sm: Increased size for readability as requested
                    className="text-sm font-sans font-bold tracking-widest text-neutral-400 hover:text-white hover:border-b-2 hover:border-brand-red pb-2 transition-all duration-200 relative top-[1px]"
                  >
                    {section.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {/* ------------------------------------------------------
         MOBILE HEADER
      ------------------------------------------------------- */}
      <div className="md:hidden bg-neutral-900 text-white border-b border-neutral-800 h-20 flex items-center justify-between px-4">
        {/* Mobile Logo: Scaled to h-10 (40px) to fit comfortably in h-20 header */}
        <img
          src="https://i.ibb.co/fzFr1hQY/full-logo-white-1.png"
          alt="Voxummah"
          className="h-10 w-auto object-contain"
        />

        <div className="flex items-center space-x-5">
          <button className="text-neutral-400 hover:text-white">
            <Search size={20} />
          </button>
          <button
            className="text-white hover:text-brand-red transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------
         MOBILE MENU OVERLAY
      ------------------------------------------------------- */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-neutral-900 border-t border-neutral-800 absolute w-full min-h-screen z-50">
          <nav className="px-6 py-6 space-y-6">
            {NAV_SECTIONS.map(section => (
              <a 
                key={section.name} 
                href={section.path} 
                className="block text-lg font-sans font-bold tracking-wide text-white border-l-2 border-transparent hover:border-brand-red hover:pl-4 hover:bg-neutral-800 py-2 transition-all duration-300"
              >
                {section.name}
              </a>
            ))}
            <div className="pt-6 border-t border-neutral-800 mt-6 space-y-4">
               <button className="w-full text-left text-neutral-400 font-bold uppercase text-sm font-sans">Sign In</button>
               <button className="w-full bg-brand-red text-white font-bold uppercase text-sm py-3 rounded-sm font-sans tracking-wider">Subscribe</button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}