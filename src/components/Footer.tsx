import { Link } from 'react-router-dom';
import { Twitter, Facebook, Youtube, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-white py-12" id="newsletter">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-heading font-bold mb-4 text-neutral-400">VOXUMMAH</h3>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Independent news and investigative journalism.
            </p>
          </div>

          {/* Sections - L2: Fixed dead links */}
          <nav aria-label="Sections">
            <h4 className="font-bold mb-4 text-sm">SECTIONS</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/analysis" className="text-neutral-400 hover:text-brand-red transition-colors">Analysis</Link></li>
              <li><Link to="/voices" className="text-neutral-400 hover:text-brand-red transition-colors">Voices</Link></li>
              <li><Link to="/media" className="text-neutral-400 hover:text-brand-red transition-colors">Media</Link></li>
              <li><Link to="/foundations" className="text-neutral-400 hover:text-brand-red transition-colors">Foundations</Link></li>
            </ul>
          </nav>

          {/* About - L2: Fixed dead links */}
          <nav aria-label="About">
            <h4 className="font-bold mb-4 text-sm">ABOUT</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="text-neutral-400 hover:text-brand-red transition-colors">About Us</Link></li>
              <li><a href="mailto:contact@voxummah.com" className="text-neutral-400 hover:text-brand-red transition-colors">Contact</a></li>
              <li><Link to="/circles" className="text-neutral-400 hover:text-brand-red transition-colors">Support</Link></li>
              <li><Link to="/about" className="text-neutral-400 hover:text-brand-red transition-colors">Privacy Policy</Link></li>
            </ul>
          </nav>

          {/* Social */}
          <div>
            <h4 className="font-bold mb-4 text-sm">FOLLOW US</h4>
            <div className="flex space-x-4">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 hover:text-brand-red transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Follow us on Twitter"
              >
                <Twitter size={20} aria-hidden="true" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 hover:text-brand-red transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Follow us on Facebook"
              >
                <Facebook size={20} aria-hidden="true" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 hover:text-brand-red transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Subscribe on YouTube"
              >
                <Youtube size={20} aria-hidden="true" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 hover:text-brand-red transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Follow us on Instagram"
              >
                <Instagram size={20} aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-neutral-800 pt-8 text-center">
          <p className="text-neutral-500 text-sm">
            © 2026 Voxummah. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
