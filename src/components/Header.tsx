import Masthead from './header/Masthead';
import DesktopNav from './header/DesktopNav';
import MobileNav from './header/MobileNav';

// M2: Skip-to-content link for keyboard accessibility
export default function Header() {
  return (
    <header className="sticky top-0 z-50 flex flex-col font-sans">
      {/* Skip link - visible only on focus for keyboard users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:bg-brand-red focus:text-white focus:px-4 focus:py-2 focus:rounded-sm focus:font-bold focus:text-sm"
      >
        Skip to main content
      </a>
      <Masthead />
      <DesktopNav />
      <MobileNav />
    </header>
  );
}