import { useState, useEffect, useRef } from 'react';
import { X, Tag as TagIcon } from 'lucide-react';
import { searchTags, createTag } from '../lib/cms-utils';
import { Tag } from '../types/cms';

interface TagInputProps {
  selectedTags: string[];
  onChange: (tags: string[]) => void;
}

export default function TagInput({ selectedTags, onChange }: TagInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<Tag[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (inputValue.trim().length > 0) {
        setIsLoading(true);
        const results = await searchTags(inputValue);
        const filtered = results.filter(
          (tag) => !selectedTags.includes(tag.slug)
        );
        setSuggestions(filtered);
        setIsLoading(false);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [inputValue, selectedTags]);

  const addTag = async (tagName: string) => {
    const trimmedName = tagName.trim();
    if (!trimmedName) return;

    const tag = await createTag(trimmedName);
    if (tag && !selectedTags.includes(tag.slug)) {
      onChange([...selectedTags, tag.slug]);
    }

    setInputValue('');
    setSuggestions([]);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const removeTag = (tagSlug: string) => {
    onChange(selectedTags.filter((t) => t !== tagSlug));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === 'Backspace' && !inputValue && selectedTags.length > 0) {
      removeTag(selectedTags[selectedTags.length - 1]);
    }
  };

  const handleSelectSuggestion = (tag: Tag) => {
    if (!selectedTags.includes(tag.slug)) {
      onChange([...selectedTags, tag.slug]);
    }
    setInputValue('');
    setSuggestions([]);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  return (
    <div className="relative">
      <div className="flex flex-wrap gap-2 p-3 border border-gray-300 rounded-lg bg-white min-h-[42px] focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent">
        {selectedTags.map((tagSlug) => (
          <span
            key={tagSlug}
            className="inline-flex items-center space-x-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
          >
            <TagIcon size={12} />
            <span>{tagSlug}</span>
            <button
              type="button"
              onClick={() => removeTag(tagSlug)}
              className="hover:text-blue-900 transition-colors"
            >
              <X size={14} />
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => inputValue && setShowSuggestions(true)}
          placeholder={selectedTags.length === 0 ? 'Add tags...' : ''}
          className="flex-1 min-w-[120px] outline-none bg-transparent"
        />
      </div>

      {showSuggestions && (inputValue.trim().length > 0) && (
        <div
          ref={dropdownRef}
          className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
        >
          {isLoading ? (
            <div className="p-3 text-sm text-gray-500">Loading...</div>
          ) : suggestions.length > 0 ? (
            <ul>
              {suggestions.map((tag) => (
                <li key={tag.id}>
                  <button
                    type="button"
                    onClick={() => handleSelectSuggestion(tag)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors flex items-center justify-between"
                  >
                    <span className="flex items-center space-x-2">
                      <TagIcon size={14} className="text-gray-400" />
                      <span className="text-sm">{tag.name}</span>
                    </span>
                    <span className="text-xs text-gray-500">
                      {tag.usage_count} article{tag.usage_count !== 1 ? 's' : ''}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-3">
              <div className="text-sm text-gray-500 mb-2">
                No existing tags found
              </div>
              <button
                type="button"
                onClick={() => addTag(inputValue)}
                className="w-full text-left px-3 py-2 bg-blue-50 hover:bg-blue-100 rounded text-sm text-blue-700 transition-colors"
              >
                Create tag "{inputValue}"
              </button>
            </div>
          )}
        </div>
      )}

      <p className="mt-1 text-xs text-gray-500">
        Type to search existing tags or create new ones. Press Enter to add.
      </p>
    </div>
  );
}
