import { LATEST_ARTICLES } from '../data/mockData';
import { Link } from 'react-router-dom';
// We import the shared utility to ensure time formatting is consistent across the app
import { formatRelativeTime } from '../lib/cms-utils';

export default function LatestStories() {
  const displayStories = LATEST_ARTICLES.slice(0, 4);

  return (
    // bg-neutral-50 maps to #FAFAFA (Very subtle separation from white)
    <section className="bg-neutral-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header: Split-colored border (half green, half red) */}
        <h2 className="text-2xl font-heading font-bold text-neutral-900 mb-6 pb-3" style={{ borderBottom: '2px solid', backgroundImage: 'linear-gradient(to right, #143a21 50%, #711f29 50%)', backgroundClip: 'border-box', WebkitBackgroundClip: 'border-box', borderImage: 'linear-gradient(to right, #143a21 50%, #711f29 50%) 1' }}>
          LATEST STORIES
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayStories.map((story) => (
            <Link key={story.id} to={`/article/${story.slug}`} className="group cursor-pointer block">
              {/* Image Placeholder */}
              <div className="relative overflow-hidden rounded-sm mb-3 aspect-video bg-neutral-200">
                <img
                  src={story.image_url}
                  alt={story.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              
              {/* Title: Hover triggers Brand Red */}
              <h3 className="text-lg font-heading font-bold text-neutral-900 mb-2 group-hover:text-brand-hover-green transition-colors leading-tight line-clamp-2 break-words">
                {story.title}
              </h3>
              
              {/* Meta: Uses neutral-400 for de-emphasized info */}
              <div className="text-sm text-neutral-400">
                <span className="font-medium text-neutral-800">{story.author_name}</span>
                <span className="mx-2">•</span> 
                {formatRelativeTime(story.created_at)}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}