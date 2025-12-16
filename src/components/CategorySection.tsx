import { ARTICLES } from '../data/mockData';
import { Link } from 'react-router-dom';

export default function CategorySection() {
  // We strictly typecheck or filter these. 
  // Ideally, in the future, we fetch by category ID.
  const newsArticles = ARTICLES.filter(article => article.category === 'News').slice(0, 2);
  const entertainmentArticles = ARTICLES.filter(article => article.category === 'Entertainment').slice(0, 2);

  const getExcerpt = (story: any) => {
    if (story.body) {
      return story.body.substring(0, 100) + '...';
    }
    return '';
  };

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8">
          
          {/* COLUMN 1: NEWS (The Pulse - Brand Red) */}
          <div>
            {/* Header: Uses Brand Red border to define the section */}
            <h2 className="text-2xl font-heading font-bold text-neutral-900 mb-6 pb-3 border-b-2 border-brand-red">
              NEWS
            </h2>
            <div className="space-y-6">
              {newsArticles.map((story) => (
                <Link key={story.id} to={`/article/${story.slug}`} className="group cursor-pointer flex gap-4">
                  <div className="relative overflow-hidden rounded-sm w-40 h-28 flex-shrink-0 bg-neutral-200">
                    <img
                      src={story.image_url}
                      alt={story.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div>
                    {/* Headline: Interactive state triggers Brand Red */}
                    <h3 className="text-lg font-heading font-bold text-neutral-900 mb-2 group-hover:text-brand-hover-green transition-colors leading-tight line-clamp-2 break-words">
                      {story.title}
                    </h3>
                    {/* Excerpt: Uses the new Neutral-600 (High readability grey) */}
                    <p className="text-sm text-neutral-600 leading-relaxed line-clamp-2 break-words">
                      {getExcerpt(story)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* COLUMN 2: VIDEO (The Foundation - Brand Green) */}
          {/* We introduce Brand Green here to differentiate Media content */}
          <div>
            <h2 className="text-2xl font-heading font-bold text-neutral-900 mb-6 pb-3 border-b-2 border-brand-green">
              VIDEO
            </h2>
            <div className="space-y-6">
              {entertainmentArticles.map((story) => (
                <Link key={story.id} to={`/article/${story.slug}`} className="group cursor-pointer flex gap-4">
                  <div className="relative overflow-hidden rounded-sm w-40 h-28 flex-shrink-0 bg-neutral-200">
                    <img
                      src={story.image_url}
                      alt={story.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    
                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      {/* The button background turns Brand Green on hover */}
                      <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-sm group-hover:bg-brand-green transition-colors duration-300">
                        {/* The triangle turns white on hover to contrast with the Green bg */}
                        <div className="w-0 h-0 border-l-[10px] border-l-neutral-900 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent ml-1 group-hover:border-l-white transition-colors"></div>
                      </div>
                    </div>
                  </div>
                  <div>
                    {/* Headline: Interactive state triggers Brand Green */}
                    <h3 className="text-lg font-heading font-bold text-neutral-900 mb-2 group-hover:text-brand-hover-green transition-colors leading-tight line-clamp-2 break-words">
                      {story.title}
                    </h3>
                    <p className="text-sm text-neutral-600 leading-relaxed line-clamp-2 break-words">
                      {getExcerpt(story)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}