import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ARTICLES, Article } from '../data/mockData';
import { ArrowLeft, Calendar, User, Tag, Eye } from 'lucide-react';

export default function ArticleDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const articleContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (slug) {
      const foundArticle = ARTICLES.find(a => a.slug === slug);
      if (foundArticle) {
        setArticle(foundArticle);
        
        // Get related articles from same category
        const related = ARTICLES
          .filter(a => a.category === foundArticle.category && a.id !== foundArticle.id)
          .slice(0, 3);
        setRelatedArticles(related);
      } else {
        setError(true);
      }
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    const handleScroll = () => {
      if (!articleContentRef.current) return;

      const articleContent = articleContentRef.current;
      const contentTop = articleContent.offsetTop;
      const contentHeight = articleContent.offsetHeight;
      const contentBottom = contentTop + contentHeight;
      const windowHeight = window.innerHeight;
      const scrollTop = window.scrollY;

      if (scrollTop < contentTop) {
        setScrollProgress(0);
      } else if (scrollTop + windowHeight > contentBottom) {
        setScrollProgress(100);
      } else {
        const scrollableHeight = contentHeight - windowHeight;
        const scrolledInContent = scrollTop - contentTop;
        const progress = scrollableHeight > 0 ? (scrolledInContent / scrollableHeight) * 100 : 0;
        setScrollProgress(Math.min(100, Math.max(0, progress)));
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [article]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red mx-auto"></div>
          <p className="mt-4 text-neutral-600">Loading article...</p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center max-w-md px-4">
          <h1 className="text-4xl font-bold text-neutral-900 mb-4">404</h1>
          <p className="text-xl text-neutral-600 mb-6">Article not found</p>
          <p className="text-neutral-500 mb-8">
            The article you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/"
            className="inline-flex items-center space-x-2 bg-brand-red text-white px-6 py-3 rounded-lg hover:bg-brand-hover-red transition-colors no-underline"
          >
            <ArrowLeft size={20} />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <article className="min-h-screen bg-white">
      <div className="fixed top-0 left-0 w-full h-1 bg-neutral-200 z-50">
        <div
          className="h-full bg-brand-red transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <div className="bg-neutral-50 py-4 border-b border-neutral-200">
        <div className="max-w-4xl mx-auto px-4">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 text-neutral-600 hover:text-brand-hover-green transition-colors no-underline"
          >
            <ArrowLeft size={18} />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div ref={articleContentRef}>
          <div className="mb-6">
            <Link
              to="/"
              className="inline-flex items-center space-x-2 text-sm text-neutral-500 hover:text-brand-hover-green transition-colors mb-4 no-underline"
            >
              <span>Home</span>
              <span>/</span>
              <span className="text-neutral-700">{article.category}</span>
            </Link>

            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-brand-red/10 text-brand-red">
                <Tag size={12} className="mr-1" />
                {article.category}
              </span>
              {article.content_type && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-section-analysis/10 text-section-analysis">
                  {article.content_type}
                </span>
              )}
              {article.region && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-brand-green/10 text-brand-green">
                  📍 {article.region}
                </span>
              )}
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6 leading-tight break-words">
              {article.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-600 mb-8 pb-8 border-b border-neutral-200">
              <div className="flex items-center space-x-2">
                <User size={16} />
                <span>{article.author_name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar size={16} />
                <span>{formatDate(article.created_at)}</span>
              </div>
              {article.view_count > 0 && (
                <div className="flex items-center space-x-2">
                  <Eye size={16} />
                  <span>{article.view_count.toLocaleString()} views</span>
                </div>
              )}
            </div>
          </div>

          <div className="relative overflow-hidden rounded-lg mb-8 aspect-video bg-neutral-200">
            <img
              src={article.image_url}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="prose prose-lg max-w-none">
            <div className="text-neutral-800 leading-relaxed whitespace-pre-wrap break-words">
              {article.body.split('\n\n').map((paragraph, index) => (
                <p key={index} className="mb-4">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {article.tags && article.tags.length > 0 && (
            <div className="mt-8 pt-8 border-t border-neutral-200">
              <h3 className="text-sm font-semibold text-neutral-700 mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-neutral-100 text-neutral-700 hover:bg-neutral-200 transition-colors"
                  >
                    <Tag size={12} className="mr-1" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {relatedArticles.length > 0 && (
          <div className="mt-16 pt-8 border-t border-neutral-200">
            <h2 className="text-2xl font-bold text-neutral-900 mb-6">Related Articles</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedArticles.map((related) => (
                <Link
                  key={related.id}
                  to={`/article/${related.slug}`}
                  className="group"
                >
                  <div className="relative overflow-hidden rounded-sm mb-3 aspect-video bg-neutral-200">
                    <img
                      src={related.image_url}
                      alt={related.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="text-lg font-bold text-neutral-900 group-hover:text-brand-hover-green transition-colors leading-tight line-clamp-2 break-words">
                    {related.title}
                  </h3>
                  <div className="text-sm text-neutral-500 mt-2">
                    {formatDate(related.created_at)}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
