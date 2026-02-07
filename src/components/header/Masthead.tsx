import { Link } from 'react-router-dom';
import { User } from 'lucide-react';
import SearchBar from './SearchBar';


// Masthead component - top bar with logo and actions
export default function Masthead() {
    const getCurrentDate = () => {
        return new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <div className="bg-neutral-900 text-white border-b border-neutral-800 hidden md:block dark:bg-neutral-50 dark:text-neutral-900 dark:border-neutral-200">
            <div className="max-w-7xl mx-auto px-4 h-24 flex items-center justify-between">
                {/* LEFT: Date & Context */}
                <div className="w-1/3 flex items-center space-x-4">
                    <span className="text-xs font-sans text-neutral-400 dark:text-neutral-600 font-medium tracking-wide uppercase">
                        {getCurrentDate()}
                    </span>
                </div>

                {/* CENTER: The Brand */}
                <div className="w-1/3 flex justify-center">
                    <Link to="/">
                        <img
                            src="https://i.ibb.co/fzFr1hQY/full-logo-white-1.png"
                            alt="Voxummah - Home"
                            className="h-16 w-auto object-contain max-w-full dark:invert"
                        />
                    </Link>
                </div>

                {/* RIGHT: Actions */}
                <div className="w-1/3 flex items-center justify-end space-x-4">
                    <a
                        href="https://voxtest.ghost.io/ghost"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-neutral-400 hover:text-white dark:text-neutral-600 dark:hover:text-neutral-900 transition-colors flex items-center gap-2 text-xs font-bold tracking-wider uppercase font-sans min-h-[44px]"
                    >
                        <User size={16} aria-hidden="true" />
                        <span>Admin</span>
                    </a>
                    <SearchBar />

                    <button className="bg-brand-red text-white text-xs font-bold uppercase tracking-widest px-5 py-2 rounded-sm hover:bg-white hover:text-neutral-900 transition-all duration-300 font-sans min-h-[44px]">
                        Subscribe
                    </button>
                </div>
            </div>
        </div>
    );
}
