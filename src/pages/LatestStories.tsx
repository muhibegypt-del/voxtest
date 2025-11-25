import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Search, Filter, Calendar, User, Share2, Facebook, Twitter, Linkedin, ChevronDown } from 'lucide-react';

interface Article {
  id: string;
  title: string;
  slug: string;
  body: string;
  image_url: string | null;
  category: string;
  published: boolean;
  created_at: string;
  author_id: string;
}

const ITEMS_PER_PAGE = 12;
const CATEGORIES = ['All', 'News', 'Politics', 'Technology', 'Business', 'Sports', 'Entertainment'];

export default function LatestStories() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [shareArticleId, setShareArticleId] = useState<string | null>(null);
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchArticles();
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

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setArticles(data || []);
      setHasMore((data?.length || 0) > ITEMS_PER_PAGE);
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getExcerpt = (body: string, maxLength: number = 120) => {
    if (body.length <= maxLength) return body;
    return body.slice(0, maxLength).trim() + '...';
  };

  const getImageUrl = (imageUrl: string | null) => {
    if (imageUrl) return imageUrl;
    return 'https://images.pexels.com/photos/6077326/pexels-photo-6077326.jpeg?auto=compress&cs=tinysrgb&w=800';
  };

  const handleShare = (article: Article, platform: string) => {
    const url = `${window.location.origin}/article/${article.slug}`;
    const text = article.title;

    const shareUrls: Record<string, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    };

    if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
    setShareArticleId(null);
  };

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
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                  selectedCategory === category
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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {displayedArticles.map((article) => (
                <article key={article.id} className="group relative">
                  <Link to={`/article/${article.slug}`} className="block">
                    <div className="relative overflow-hidden rounded-sm mb-4 aspect-video bg-neutral-200">
                      <img
                        src={getImageUrl(article.image_url)}
                        alt={article.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="inline-block px-3 py-1 bg-red-700 text-white text-xs font-bold rounded">
                          {article.category}
                        </span>
                      </div>
                    </div>

                    <h2 className="text-xl font-bold text-neutral-900 mb-2 group-hover:text-red-700 transition-colors leading-tight line-clamp-2 break-words">
                      {article.title}
                    </h2>

                    <p className="text-neutral-600 text-sm mb-3 line-clamp-2 leading-relaxed">
                      {getExcerpt(article.body)}
                    </p>

                    <div className="flex items-center justify-between text-sm text-neutral-500">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <User size={14} />
                          <span>Staff Writer</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar size={14} />
                          <span>{formatDate(article.created_at)}</span>
                        </div>
                      </div>
                    </div>
                  </Link>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShareArticleId(shareArticleId === article.id ? null : article.id);
                    }}
                    className="absolute top-0 right-0 p-2 bg-white rounded-full shadow-md hover:bg-neutral-50 transition-colors"
                    aria-label="Share article"
                  >
                    <Share2 size={16} className="text-neutral-700" />
                  </button>

                  {shareArticleId === article.id && (
                    <div className="absolute top-12 right-0 bg-white rounded-lg shadow-xl border border-neutral-200 p-3 z-10">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleShare(article, 'facebook')}
                          className="p-2 rounded-full hover:bg-blue-50 transition-colors"
                          aria-label="Share on Facebook"
                        >
                          <Facebook size={20} className="text-blue-600" />
                        </button>
                        <button
                          onClick={() => handleShare(article, 'twitter')}
                          className="p-2 rounded-full hover:bg-blue-50 transition-colors"
                          aria-label="Share on Twitter"
                        >
                          <Twitter size={20} className="text-blue-400" />
                        </button>
                        <button
                          onClick={() => handleShare(article, 'linkedin')}
                          className="p-2 rounded-full hover:bg-blue-50 transition-colors"
                          aria-label="Share on LinkedIn"
                        >
                          <Linkedin size={20} className="text-blue-700" />
                        </button>
                      </div>
                    </div>
                  )}
                </article>
              ))}
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
