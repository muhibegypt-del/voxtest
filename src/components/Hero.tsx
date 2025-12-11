import { Link } from 'react-router-dom';
import { formatRelativeTime, generateExcerpt } from '../lib/cms-utils';
import { FEATURED_ARTICLES, Article } from '../data/mockData';
import { Star } from 'lucide-react';

export default function Hero() {
  const displayArticles = FEATURED_ARTICLES.slice(0, 2);

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        {displayArticles.map((article, index) => (
          <Link key={article.id} to={`/article/${article.slug}`} className="group cursor-pointer block relative">
            
            {/* Image with Category Badge & Featured Star */}
            <div className="relative overflow-hidden rounded-sm mb-4 aspect-video bg-neutral-200">
              <img
                src={article.image_url}
                alt={article.title}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              
              {/* Category Badge - High contrast (red/black) aesthetic */}
              <div className="absolute top-4 left-4">
                <span className="inline-block px-3 py-1 bg-neutral-900 text-red-600 text-xs font-bold uppercase tracking-widest shadow-lg border border-red-600">
                  {article.category || 'FEATURED'}
                </span>
              </div>

              {/* Featured Indicator (only visible if truly featured) */}
              {article.featured && (
                <div className="absolute top-4 right-4 p-2 bg-red-600 rounded-full shadow-lg">
                  <Star size={16} className="text-white" fill="white" />
                </div>
              )}
            </div>

            {/* Headline with Enhanced Typography */}
            <h2 className="text-4xl lg:text-5xl font-bold text-neutral-900 mb-2 group-hover:text-red-700 transition-colors leading-tight line-clamp-3 break-words">
              {article.title}
            </h2>

            {/* Excerpt */}
            <p className="text-neutral-600 text-lg leading-snug line-clamp-3 break-words">
              {generateExcerpt(article.body, 180)}
            </p>
            
            {/* Bylines & Time Ago */}
            <div className="mt-4 text-sm text-neutral-500 flex items-center space-x-3">
              <span className="font-semibold text-neutral-800">
                {article.author_name}
              </span>
              <span className="text-red-700 text-xl font-thin">•</span>
              <span>
                {formatRelativeTime(article.created_at)}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}