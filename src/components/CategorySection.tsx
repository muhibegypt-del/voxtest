import { ARTICLES } from '../data/mockData';
import { Link } from 'react-router-dom';

export default function CategorySection() {
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
          <div>
            <h2 className="text-2xl font-bold text-neutral-900 mb-6 pb-3 border-b-2 border-red-700">
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
                    <h3 className="text-lg font-bold text-neutral-900 mb-2 group-hover:text-red-700 transition-colors leading-tight line-clamp-2 break-words">
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

          <div>
            <h2 className="text-2xl font-bold text-neutral-900 mb-6 pb-3 border-b-2 border-red-700">
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
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 bg-white bg-opacity-90 rounded-full flex items-center justify-center group-hover:bg-red-700 group-hover:bg-opacity-90 transition-colors">
                        <div className="w-0 h-0 border-l-8 border-l-neutral-900 border-t-6 border-t-transparent border-b-6 border-b-transparent ml-1 group-hover:border-l-white"></div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-neutral-900 mb-2 group-hover:text-red-700 transition-colors leading-tight line-clamp-2 break-words">
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
