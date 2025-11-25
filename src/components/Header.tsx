import { Search, Menu, X, LogIn, LogOut } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom'; // <-- New Import for better routing
import { useAuth } from '../contexts/AuthContext';
import LoginModal from './LoginModal';

// Map the hardcoded nav items to potential routes/sections
const MAIN_NAV = [
  { name: 'Latest Stories', path: '/latest' },
  { name: 'Analysis', path: '#' }, // Potential new route
  { name: 'Voices', path: '#' },
  { name: 'Media', path: '#' },
  { name: 'The Archive', path: '#' },
];

const UTILITY_NAV = [
  { name: 'The Store', path: '#' },
  { name: 'Foundations', path: '#' },
  { name: 'Bookshelf', path: '#' },
];


export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const { user, signOut } = useAuth();

  return (
    <header className="bg-neutral-900 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">

        {/* Top Masthead: Logo and Auth/Search */}
        <div className="flex items-center justify-between h-16 border-b border-neutral-800">
          
          {/* Logo and Home Link */}
          <Link to="/" className="flex items-center space-x-2">
            <img
              src="/Voxummah.png"
              alt="Voxummah"
              className="h-10 w-auto transition-opacity hover:opacity-85"
            />
          </Link>

          {/* Utility & Auth on Right */}
          <div className="flex items-center space-x-6">
            
            {/* Desktop Utility Links */}
            <nav className="hidden lg:flex items-center space-x-6">
                {UTILITY_NAV.map((item) => (
                    <Link 
                        key={item.name} 
                        to={item.path} 
                        className="text-xs uppercase font-medium tracking-wide text-neutral-400 hover:text-red-600 transition-colors"
                    >
                        {item.name}
                    </Link>
                ))}
            </nav>

            {/* Separator */}
            <div className="hidden lg:block w-px h-6 bg-neutral-700"></div>


            {/* Search Button */}
            <button className="text-white hover:text-red-600 transition-colors hidden md:block" aria-label="Search">
              <Search size={20} />
            </button>
            
            {/* Auth/Admin Button */}
            {user ? (
              <div className="flex items-center space-x-4">
                <Link 
                    to="/admin" 
                    className="text-sm px-3 py-1 font-semibold border border-red-600 text-red-600 rounded hover:bg-red-600 hover:text-white transition-colors hidden sm:block"
                >
                    CMS Admin
                </Link>
                <button
                  onClick={signOut}
                  className="flex items-center space-x-2 text-sm text-neutral-400 hover:text-red-600 transition-colors"
                >
                  <LogOut size={18} />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setLoginModalOpen(true)}
                className="flex items-center space-x-2 text-sm text-neutral-400 hover:text-red-600 transition-colors"
              >
                <LogIn size={18} />
                <span className="hidden sm:inline">Login</span>
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden text-white hover:text-red-600 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Secondary Navigation Bar (Only visible on Desktop) */}
        <div className="hidden md:flex items-center justify-start h-10">
            <nav className="flex items-center space-x-8">
                {MAIN_NAV.map((item) => (
                    <Link 
                        key={item.name} 
                        to={item.path} 
                        className="text-base text-white hover:text-red-600 transition-colors uppercase"
                        // Leverages 'Barlow Condensed' for bold, expansive menu typography
                        style={{ fontFamily: 'Barlow Condensed, sans-serif' }} 
                    >
                        {item.name}
                    </Link>
                ))}
            </nav>
        </div>

      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-neutral-800 border-t border-neutral-700 absolute w-full left-0 z-40">
          <nav className="px-4 py-4 space-y-4">
            <h4 className="text-xs text-neutral-400 font-semibold mb-2 uppercase">Sections</h4>
            {[...MAIN_NAV, ...UTILITY_NAV].map((item) => (
                <Link 
                    key={item.name}
                    to={item.path} 
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-lg font-bold text-white hover:text-red-600 transition-colors border-b border-neutral-700 pb-2"
                >
                    {item.name}
                </Link>
            ))}
            {user && (
              <Link 
                  to="/admin" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-lg font-bold bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors mt-4"
              >
                  CMS Admin
              </Link>
            )}
            <button className="flex items-center space-x-2 text-white hover:text-red-600 transition-colors pt-4">
              <Search size={20} />
              <span>Search</span>
            </button>
          </nav>
        </div>
      )}

      <LoginModal isOpen={loginModalOpen} onClose={() => setLoginModalOpen(false)} />
    </header>
  );
}