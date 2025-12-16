import { Link } from 'react-router-dom';
import { formatRelativeTime, generateExcerpt } from '../lib/cms-utils';
import { FEATURED_ARTICLES } from '../data/mockData';
import { Star } from 'lucide-react';

export default function Hero() {
  const displayArticles = FEATURED_ARTICLES.slice(0, 2);

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        {displayArticles.map((article) => (
          <Link key={article.id} to={`/article/${article.slug}`} className="group cursor-pointer block relative">
            
            {/* Image with Category Badge & Featured Star */}
            {/* bg-neutral-200 maps to #E5E5E5 (Light Grey for placeholder) */}
            <div className="relative overflow-hidden rounded-sm mb-4 aspect-video bg-neutral-200">
              <img
                src={article.image_url}
                alt={article.title}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              
              {/* Category Badge - High contrast aesthetic */}
              {/* text-brand-red: Uses strictly #ba2a33 */}
              <div className="absolute top-4 left-4">
                <span className="inline-block px-3 py-1 bg-neutral-900 text-brand-red text-xs font-bold uppercase tracking-widest shadow-lg border border-brand-red">
                  {article.category || 'FEATURED'}
                </span>
              </div>

              {/* Featured Indicator */}
              {article.featured && (
                <div className="absolute top-4 right-4 p-2 bg-brand-red rounded-full shadow-lg">
                  <Star size={16} className="text-white" fill="white" />
                </div>
              )}
            </div>

            {/* Headline with Enhanced Typography */}
            {/* Added 'font-heading' to enforce Barlow Condensed */}
            <h2 className="text-4xl lg:text-5xl font-heading font-bold text-neutral-900 mb-2 group-hover:text-brand-red transition-colors leading-tight line-clamp-3 break-words">
              {article.title}
            </h2>

            {/* Excerpt */}
            {/* text-neutral-600: Body text #525252 */}
            <p className="text-neutral-600 text-lg leading-snug line-clamp-3 break-words">
              {generateExcerpt(article.body, 180)}
            </p>
            
            {/* Bylines & Time Ago */}
            {/* Updated text-neutral-500 (deleted) -> text-neutral-400 (Meta Grey) */}
            <div className="mt-4 text-sm text-neutral-400 flex items-center space-x-3">
              <span className="font-semibold text-neutral-800">
                {article.author_name}
              </span>
              {/* Separator using Brand Red */}
              <span className="text-brand-red text-xl font-thin">•</span>
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