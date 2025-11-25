import { Search, Menu, X, LogIn, LogOut } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import LoginModal from './LoginModal';

// List of sections based on project/supabase/migrations/20251119090738_create_content_sections_schema.sql
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
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const { user, signOut } = useAuth();

  const renderNavLinks = () => (
    <>
      {NAV_SECTIONS.map(section => (
        <a key={section.name} href={section.path} className="text-sm hover:text-red-600 transition-colors">
          {section.name}
        </a>
      ))}
      {user && (
        <a href="/admin" className="text-sm bg-red-600 px-3 py-1 rounded hover:bg-red-700 transition-colors">ADMIN</a>
      )}
    </>
  );

  return (
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
            <button className="hover:text-red-600 transition-colors">
              <Search size={20} />
            </button>

            {user ? (
              <button
                onClick={signOut}
                className="hidden md:flex items-center space-x-2 text-sm hover:text-red-600 transition-colors"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            ) : (
              <button
                onClick={() => setLoginModalOpen(true)}
                className="hidden md:flex items-center space-x-2 text-sm hover:text-red-600 transition-colors"
              >
                <LogIn size={18} />
                <span>Login</span>
              </button>
            )}

            <button
              className="md:hidden hover:text-red-600 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-neutral-800 border-t border-neutral-700">
          <nav className="px-4 py-4 space-y-3">
            {NAV_SECTIONS.map(section => (
              <a key={section.name} href={section.path} className="block text-sm hover:text-red-600 transition-colors">
                {section.name}
              </a>
            ))}
            {user && (
              <a href="/admin" className="block text-sm bg-red-600 px-3 py-1 rounded hover:bg-red-700 transition-colors">ADMIN</a>
            )}
            {user ? (
              <button
                onClick={signOut}
                className="flex items-center space-x-2 text-sm hover:text-red-600 transition-colors"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            ) : (
              <button
                onClick={() => setLoginModalOpen(true)}
                className="flex items-center space-x-2 text-sm hover:text-red-600 transition-colors"
              >
                <LogIn size={18} />
                <span>Login</span>
              </button>
            )}
          </nav>
        </div>
      )}

      <LoginModal isOpen={loginModalOpen} onClose={() => setLoginModalOpen(false)} />
    </header>
  );
}