import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { useContent } from '../../context/ContentContext';

interface SearchBarProps {
    onClose?: () => void;
}

export default function SearchBar({ onClose }: SearchBarProps) {
    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [results, setResults] = useState<any[]>([]);
    const { articles } = useContent();
    const navigate = useNavigate();
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    useEffect(() => {
        if (query.length > 2) {
            const searchResults = articles.filter(article =>
                article.title.toLowerCase().includes(query.toLowerCase()) ||
                article.excerpt?.toLowerCase().includes(query.toLowerCase())
            ).slice(0, 5);
            setResults(searchResults);
        } else {
            setResults([]);
        }
    }, [query, articles]);

    const handleSelect = (slug: string) => {
        setQuery('');
        setResults([]);
        setIsOpen(false);
        onClose?.();
        navigate(`/article/${slug}`);
    };

    const handleClose = () => {
        setIsOpen(false);
        setQuery('');
        setResults([]);
        onClose?.();
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="text-neutral-400 hover:text-brand-red transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Search articles"
            >
                <Search size={18} aria-hidden="true" />
            </button>
        );
    }

    return (
        <div className="relative">
            <div className="flex items-center gap-2 bg-neutral-800 rounded-sm px-3 py-2">
                <Search size={16} className="text-neutral-400" />
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search articles..."
                    className="bg-transparent text-white text-sm w-48 focus:outline-none placeholder-neutral-500"
                />
                <button onClick={handleClose} className="text-neutral-400 hover:text-white">
                    <X size={16} />
                </button>
            </div>

            {/* Results dropdown */}
            {results.length > 0 && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-sm shadow-lg border border-neutral-200 z-50">
                    {results.map((article) => (
                        <button
                            key={article.id}
                            onClick={() => handleSelect(article.slug)}
                            className="w-full text-left px-4 py-3 hover:bg-neutral-50 border-b border-neutral-100 last:border-0"
                        >
                            <p className="text-sm font-bold text-neutral-900 line-clamp-1">{article.title}</p>
                            <p className="text-xs text-neutral-500 mt-1">{article.category}</p>
                        </button>
                    ))}
                </div>
            )}

            {query.length > 2 && results.length === 0 && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-sm shadow-lg border border-neutral-200 z-50 p-4 text-center">
                    <p className="text-sm text-neutral-500">No articles found for "{query}"</p>
                </div>
            )}
        </div>
    );
}
