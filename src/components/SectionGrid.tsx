import { Link } from 'react-router-dom';
import { formatRelativeTime, generateExcerpt } from '../lib/cms-utils';
import { Article } from '../types/cms';

interface SectionGridProps {
  articles: Article[];
  badgeColorClass: string;
}

export default function SectionGrid({ articles, badgeColorClass }: SectionGridProps) {
  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        {articles.map((article) => (
          <Link key={article.id} to={`/article/${article.slug}`} className="group cursor-pointer block relative">
            <div className="relative overflow-hidden rounded-sm mb-4 aspect-video bg-neutral-200">
              <img
                src={article.image_url}
                alt={article.title}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />

              <div className="absolute top-4 left-4">
                <span className={`inline-block px-3 py-1 bg-neutral-900 text-xs font-bold uppercase tracking-widest shadow-lg border ${badgeColorClass}`}>
                  {article.category || 'FEATURED'}
                </span>
              </div>
            </div>

            <h2 className="text-4xl lg:text-5xl font-heading font-bold text-neutral-900 mb-2 group-hover:text-brand-hover-green transition-colors leading-tight line-clamp-3 break-words">
              {article.title}
            </h2>

            <p className="text-neutral-600 text-lg leading-snug line-clamp-3 break-words">
              {generateExcerpt(article.body, 180)}
            </p>

            <div className="mt-4 text-sm text-neutral-400 flex items-center space-x-3">
              <span className="font-semibold text-neutral-800">
                {article.author_name}
              </span>
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
