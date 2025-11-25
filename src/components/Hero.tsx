import { Link } from 'react-router-dom';
// NOTE: Assuming useSanityArticles is renamed to useSupabaseArticles
import { useSupabaseArticles } from '../hooks/useSanityArticles'; 
import {
  formatRelativeTime,
  generateExcerpt,
  getDefaultImageUrl,
} from '../lib/cms-utils';
import { Article } from '../types/cms';
import { Star } from 'lucide-react';

// Use a simplified type for the placeholder to ensure it aligns with the fetched Article data
interface HeroArticlePlaceholder {
  id: string;
  slug: string;
  title: string;
  body: string;
  image_url: string | null;
  created_at: string;
  category: string;
  author_name: string;
}

export default function Hero() {
  const { articles, loading } = useSupabaseArticles({
    limit: 2,
    publishedOnly: true,
    featuredOnly: true,
  });

  const placeholderArticles: HeroArticlePlaceholder[] = [
    {
      id: '1',
      slug: 'investigative-journalism-uncovers-major-corporate-scandal',
      title: 'Investigative Journalism Uncovers Major Corporate Scandal: The Hidden Cost of Deregulation',
      body: 'An in-depth investigation reveals systematic failures in regulatory oversight, exposing how powerful interests operate beyond public accountability. This bombshell report details the multi-year cover-up and its devastating global impact.',
      image_url: 'https://images.pexels.com/photos/6077326/pexels-photo-6077326.jpeg?auto=compress&cs=tinysrgb&w=1200',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
      category: 'Analysis',
      author_name: 'Staff Writer',
    },
    {
      id: '2',
      slug: 'media-narrative-challenged-by-new-evidence-on-foreign-influence',
      title: 'Media Narrative Challenged by New Evidence on Foreign Influence Operations',
      body: 'Documents obtained through freedom of information requests contradict widely reported claims by major outlets, raising serious questions about source credibility and editorial independence in covering the conflict.',
      image_url: 'https://images.pexels.com/photos/8828597/pexels-photo-8828597.jpeg?auto=compress&cs=tinysrgb&w=1200',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
      category: 'News',
      author_name: 'John Smith',
    },
  ];

  const displayArticles: (Article | HeroArticlePlaceholder)[] = articles.length > 0 ? articles : placeholderArticles;

  if (loading) {
    // Current loading state is fine and remains for a smooth UX
    return (
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-neutral-200 aspect-video rounded-sm mb-4"></div>
              <div className="h-10 bg-neutral-200 rounded mb-3"></div>
              <div className="h-16 bg-neutral-200 rounded"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        {displayArticles.map((article, index) => (
          <Link key={article.id} to={`/article/${article.slug}`} className="group cursor-pointer block relative">
            
            {/* Image with Category Badge & Featured Star */}
            <div className="relative overflow-hidden rounded-sm mb-4 aspect-video bg-neutral-200">
              <img
                src={article.image_url || getDefaultImageUrl()}
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
                {article.author_name || 'Staff Writer'}
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