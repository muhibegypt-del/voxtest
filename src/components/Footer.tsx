import { Twitter, Facebook, Youtube, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold mb-4 text-gray-400">VOXUMMAH</h3>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Independent news and investigative journalism.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-sm">SECTIONS</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-neutral-400 hover:text-red-600 transition-colors">News</a></li>
              <li><a href="#" className="text-neutral-400 hover:text-red-600 transition-colors">Analysis</a></li>
              <li><a href="#" className="text-neutral-400 hover:text-red-600 transition-colors">Video</a></li>
              <li><a href="#" className="text-neutral-400 hover:text-red-600 transition-colors">Podcast</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-sm">ABOUT</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-neutral-400 hover:text-red-600 transition-colors">About Us</a></li>
              <li><a href="#" className="text-neutral-400 hover:text-red-600 transition-colors">Contact</a></li>
              <li><a href="#" className="text-neutral-400 hover:text-red-600 transition-colors">Support</a></li>
              <li><a href="#" className="text-neutral-400 hover:text-red-600 transition-colors">Privacy Policy</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-sm">FOLLOW US</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-neutral-400 hover:text-red-600 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-neutral-400 hover:text-red-600 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-neutral-400 hover:text-red-600 transition-colors">
                <Youtube size={20} />
              </a>
              <a href="#" className="text-neutral-400 hover:text-red-600 transition-colors">
                <Instagram size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-neutral-800 pt-8 text-center">
          <p className="text-neutral-500 text-sm">
            © 2024 Voxummah. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
