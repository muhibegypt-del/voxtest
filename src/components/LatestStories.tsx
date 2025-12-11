import { LATEST_ARTICLES } from '../data/mockData';
import { Link } from 'react-router-dom';

export default function LatestStories() {
  const displayStories = LATEST_ARTICLES.slice(0, 4);

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const hours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours} hours ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  };

  return (
    <section className="bg-neutral-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-neutral-900 mb-6 pb-3 border-b-2 border-red-700">
          LATEST STORIES
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayStories.map((story) => (
            <Link key={story.id} to={`/article/${story.slug}`} className="group cursor-pointer block">
              <div className="relative overflow-hidden rounded-sm mb-3 aspect-video bg-neutral-200">
                <img
                  src={story.image_url}
                  alt={story.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="text-lg font-bold text-neutral-900 mb-2 group-hover:text-red-700 transition-colors leading-tight line-clamp-2 break-words">
                {story.title}
              </h3>
              <div className="text-sm text-neutral-500">
                By {story.author_name} • {getTimeAgo(story.created_at)}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
