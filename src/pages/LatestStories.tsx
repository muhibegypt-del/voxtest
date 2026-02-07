import { useState, useEffect, useRef } from 'react';
import { ARTICLES, Article } from '../data/mockData';
import { Search, Filter, ChevronDown } from 'lucide-react';
import ArticleCard from '../components/ui/ArticleCard';

const ITEMS_PER_PAGE = 12;
const CATEGORIES = ['All', 'News', 'Politics', 'Technology', 'Business', 'Sports', 'Entertainment'];

export default function LatestStories() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setArticles(ARTICLES);
  }, []);

  useEffect(() => {
    filterArticles();
  }, [articles, searchQuery, selectedCategory]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, loading]);

  const filterArticles = () => {
    let filtered = [...articles];

    if (selectedCategory !== 'All') {
      filtered = filtered.filter((article) => article.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (article) =>
          article.title.toLowerCase().includes(query) ||
          article.body.toLowerCase().includes(query)
      );
    }

    setFilteredArticles(filtered);
    setPage(1);
  };

  const loadMore = () => {
    setPage((prev) => prev + 1);
  };

  const displayedArticles = filteredArticles.slice(0, page * ITEMS_PER_PAGE);
  const isShowingAll = displayedArticles.length >= filteredArticles.length;

  if (loading && articles.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-12 bg-neutral-200 rounded w-64 mb-8"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i}>
                  <div className="bg-neutral-200 aspect-video rounded-sm mb-4"></div>
                  <div className="h-6 bg-neutral-200 rounded mb-2"></div>
                  <div className="h-4 bg-neutral-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-neutral-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-neutral-900 text-white py-12 mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">LATEST STORIES</h1>
          <p className="text-neutral-300 text-lg max-w-2xl">
            Investigative journalism uncovering stories that challenge mainstream narratives
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={20} />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-red-700 focus:border-transparent"
            />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors md:hidden"
          >
            <Filter size={20} />
            <span>Filters</span>
            <ChevronDown size={16} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>

        <div className={`${showFilters ? 'block' : 'hidden'} md:block mb-8`}>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${selectedCategory === category
                  ? 'bg-red-700 text-white'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                  }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {filteredArticles.length === 0 ? (
          <div className="text-center py-16">
            <h3 className="text-2xl font-bold text-neutral-900 mb-2">No articles found</h3>
            <p className="text-neutral-600">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <>
            <div className="mb-4 text-neutral-600">
              Showing {displayedArticles.length} of {filteredArticles.length} articles
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {displayedArticles.map((article, index) => {
                // Adaptive Layout Logic to prevent gaps
                const total = displayedArticles.length;
                let gridClass = '';
                let cardVariant: 'hero' | 'standard' | 'wide' = 'standard';
                let showExcerpt = true;

                if (index === 0) {
                  gridClass = 'md:col-span-2 md:row-span-2';
                  cardVariant = 'hero';
                } else if (total === 2) {
                  gridClass = 'md:col-span-2 md:row-span-2';
                  cardVariant = 'hero'; // Split screen
                } else if (total === 3) {
                  gridClass = 'md:col-span-2';
                  cardVariant = 'wide'; // Stacked wide cards
                } else if (total === 4 && index === 3) {
                  gridClass = 'md:col-span-2';
                  cardVariant = 'wide'; // Bottom filler
                }

                // Latest Stories specific: prevent standard cards from showing excerpts to keep grid tight?
                // No, let's keep excerpts for standard cards here as it is a dedicated page.

                return (
                  <ArticleCard
                    key={article.id}
                    article={article}
                    variant={cardVariant}
                    priority={index === 0}
                    showExcerpt={cardVariant === 'hero' || cardVariant === 'wide' || showExcerpt}
                    className={`h-full ${gridClass}`}
                  />
                );
              })}
            </div>

            {!isShowingAll && (
              <div ref={observerTarget} className="text-center py-8">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-700 mx-auto"></div>
                <p className="mt-4 text-neutral-600">Loading more articles...</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}