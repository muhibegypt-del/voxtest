import { useEffect, useLayoutEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useContent } from '../context/ContentContext';
import { ArrowLeft, Calendar, User, Tag, Eye, Twitter, Facebook, Linkedin, Link2, Share2 } from 'lucide-react';
import DOMPurify from 'dompurify';
import { ArticleDetailSkeleton } from '../components/Skeletons';
import ArticleCard from '../components/ui/ArticleCard';

export default function ArticleDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { articles, loading: contentLoading } = useContent();
  const [article, setArticle] = useState<any | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const articleContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (slug && !contentLoading) {
      const foundArticle = articles.find(a => a.slug === slug);
      if (foundArticle) {
        setArticle(foundArticle);

        // Get related articles from same category
        const related = articles
          .filter(a => a.category === foundArticle.category && a.id !== foundArticle.id)
          .slice(0, 3);
        setRelatedArticles(related);
        setError(false);
      } else {
        setError(true);
      }
      setLoading(false);
    } else if (slug && contentLoading) {
      setLoading(true);
    }
  }, [slug, articles, contentLoading]);

  // Progress bar: Track reading progress through article
  useLayoutEffect(() => {
    const handleScroll = () => {
      if (!articleContentRef.current) return;

      const articleContent = articleContentRef.current;
      const rect = articleContent.getBoundingClientRect();
      const contentHeight = articleContent.offsetHeight;
      const windowHeight = window.innerHeight;

      // Calculate how much of the article has been scrolled past
      // Start: when article top reaches top of viewport
      // End: when article bottom reaches bottom of viewport
      const scrollStart = -rect.top;
      const scrollEnd = contentHeight - windowHeight;

      if (scrollStart <= 0) {
        // Haven't started reading yet
        setScrollProgress(0);
      } else if (scrollStart >= scrollEnd) {
        // Finished reading
        setScrollProgress(100);
      } else {
        // Reading in progress
        const progress = (scrollStart / scrollEnd) * 100;
        setScrollProgress(Math.min(100, Math.max(0, progress)));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [article]);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  // H3: Show skeleton instead of spinner
  if (loading) {
    return <ArticleDetailSkeleton />;
  }

  if (error || !article) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center max-w-md px-4">
          <h1 className="text-4xl font-heading font-bold text-neutral-900 mb-4">404</h1>
          <p className="text-xl text-neutral-600 mb-6">Article not found</p>
          <p className="text-neutral-500 mb-8">
            The article you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/"
            className="inline-flex items-center space-x-2 bg-brand-red text-white px-6 py-3 rounded-sm hover:opacity-90 transition-colors min-h-[44px]"
          >
            <ArrowLeft size={20} aria-hidden="true" />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    );
  }

  // Sanitize HTML content
  const sanitizedContent = DOMPurify.sanitize(article.body);

  // Generate excerpt for meta description (strip HTML, limit chars)
  const metaDescription = article.excerpt
    || (article.body ? DOMPurify.sanitize(article.body, { ALLOWED_TAGS: [] }).substring(0, 160) + '...' : '');
  const canonicalUrl = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <article className="min-h-screen bg-white">
      {/* SEO Meta Tags */}
      <Helmet>
        <title>{article.title} | Voxummah</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={canonicalUrl} />

        {/* Open Graph (Facebook, LinkedIn) */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={metaDescription} />
        {article.image_url && <meta property="og:image" content={article.image_url} />}
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:site_name" content="Voxummah" />
        <meta property="article:published_time" content={article.created_at} />
        {article.author_name && <meta property="article:author" content={article.author_name} />}

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={article.title} />
        <meta name="twitter:description" content={metaDescription} />
        {article.image_url && <meta name="twitter:image" content={article.image_url} />}
      </Helmet>

      {/* Reading progress bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-neutral-200 z-50" role="progressbar" aria-valuenow={scrollProgress} aria-valuemin={0} aria-valuemax={100}>
        <div
          className="h-full bg-brand-red transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>


      <div className="bg-neutral-50 py-4 border-b border-neutral-200">
        <div className="max-w-4xl mx-auto px-4">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 text-neutral-600 hover:text-brand-red transition-colors duration-200 min-h-[44px]"
          >
            <ArrowLeft size={18} aria-hidden="true" />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div ref={articleContentRef}>
          <div className="mb-6">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="mb-4">
              <Link
                to="/"
                className="inline-flex items-center space-x-2 text-sm text-neutral-500 hover:text-brand-red transition-colors duration-200"
              >
                <span>Home</span>
                <span aria-hidden="true">/</span>
                <span className="text-neutral-700">{article.category}</span>
              </Link>
            </nav>

            {/* Category Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-sm text-xs font-semibold bg-badge-red-bg text-badge-red-text">
                <Tag size={14} className="mr-1" aria-hidden="true" />
                {article.category}
              </span>
              {article.content_type && (
                <span className="inline-flex items-center px-3 py-1 rounded-sm text-xs font-semibold bg-badge-neutral-bg text-badge-neutral-text">
                  {article.content_type}
                </span>
              )}
              {article.region && article.region !== 'global' && (
                <span className="inline-flex items-center px-3 py-1 rounded-sm text-xs font-semibold bg-badge-green-bg text-badge-green-text">
                  📍 {article.region}
                </span>
              )}
            </div>

            <h1 className="text-4xl md:text-5xl font-heading font-bold text-neutral-900 mb-6 leading-tight break-words">
              {article.title}
            </h1>

            {/* Article meta */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-600 mb-8 pb-8 border-b border-neutral-200">
              <div className="flex items-center space-x-2">
                <User size={16} aria-hidden="true" />
                <span>{article.author_name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar size={16} aria-hidden="true" />
                <time dateTime={article.created_at}>{formatDate(article.created_at)}</time>
              </div>
              {article.view_count > 0 && (
                <div className="flex items-center space-x-2">
                  <Eye size={16} aria-hidden="true" />
                  <span>{article.view_count.toLocaleString()} views</span>
                </div>
              )}

              {/* Share Buttons */}
              <div className="flex items-center gap-2 ml-auto">
                <span className="text-sm text-neutral-500 mr-2">Share:</span>
                <button
                  onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(window.location.href)}`, '_blank')}
                  className="p-2 rounded-full bg-neutral-100 hover:bg-neutral-200 transition-colors"
                  aria-label="Share on Twitter"
                >
                  <Twitter size={16} />
                </button>
                <button
                  onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')}
                  className="p-2 rounded-full bg-neutral-100 hover:bg-neutral-200 transition-colors"
                  aria-label="Share on Facebook"
                >
                  <Facebook size={16} />
                </button>
                <button
                  onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank')}
                  className="p-2 rounded-full bg-neutral-100 hover:bg-neutral-200 transition-colors"
                  aria-label="Share on LinkedIn"
                >
                  <Linkedin size={16} />
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Link copied to clipboard!');
                  }}
                  className="p-2 rounded-full bg-neutral-100 hover:bg-neutral-200 transition-colors"
                  aria-label="Copy link"
                >
                  <Link2 size={16} />
                </button>
                {'share' in navigator && (
                  <button
                    onClick={() => navigator.share({ title: article.title, url: window.location.href })}
                    className="p-2 rounded-full bg-brand-red text-white hover:opacity-90 transition-colors"
                    aria-label="Share"
                  >
                    <Share2 size={16} />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Featured Image */}
          {article.image_url && (
            <div className="relative overflow-hidden rounded-lg mb-8 aspect-video bg-neutral-200 shadow-sm">
              <img
                src={article.image_url || undefined}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Article Body - Premium news typography */}
          <article
            className="prose prose-lg prose-neutral max-w-none
                       prose-headings:font-heading 
                       prose-a:text-brand-red prose-a:no-underline hover:prose-a:underline
                       prose-blockquote:border-l-brand-red prose-blockquote:not-italic
                       prose-li:marker:text-brand-red
                       prose-img:rounded-lg prose-img:shadow-md"
            dangerouslySetInnerHTML={{ __html: sanitizedContent }}
          />


          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="mt-8 pt-8 border-t border-neutral-200">
              <h3 className="text-base font-semibold uppercase tracking-wide text-neutral-700 mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-3 py-1 rounded-sm text-sm bg-neutral-100 text-neutral-700 hover:bg-neutral-200 transition-colors"
                  >
                    <Tag size={14} className="mr-1" aria-hidden="true" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <div className="mt-20 pt-12 border-t border-neutral-200">
            <h2 className="text-3xl font-heading font-bold text-neutral-900 mb-6">Related Articles</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedArticles.map((related) => (
                <ArticleCard
                  key={related.id}
                  article={related}
                  variant="standard"
                  showExcerpt={false}
                  showCategory={false}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
