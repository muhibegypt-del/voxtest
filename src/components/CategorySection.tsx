import { useSupabaseArticles } from '../hooks/useSanityArticles';
import { Link } from 'react-router-dom';

export default function CategorySection() {
  const { articles: newsArticles, loading: newsLoading } = useSupabaseArticles({
    category: 'News',
    limit: 2,
    publishedOnly: true,
  });

  const { articles: videoArticles, loading: videoLoading } = useSupabaseArticles({
    category: 'Entertainment',
    limit: 2,
    publishedOnly: true,
  });

  const placeholderNews = [
    {
      id: '1',
      slug: 'government-documents-reveal-covert-operations',
      image_url: "https://images.pexels.com/photos/6077447/pexels-photo-6077447.jpeg?auto=compress&cs=tinysrgb&w=600",
      title: "Government Documents Reveal Covert Operations",
      body: "Newly released files show extent of undisclosed foreign policy initiatives."
    },
    {
      id: '2',
      slug: 'media-coverage-criticized-for-one-sided-reporting',
      image_url: "https://images.pexels.com/photos/8828571/pexels-photo-8828571.jpeg?auto=compress&cs=tinysrgb&w=600",
      title: "Media Coverage Criticized for One-Sided Reporting",
      body: "Analysis finds systematic omission of key facts in mainstream outlets."
    }
  ];

  const placeholderVideos = [
    {
      id: '3',
      slug: 'roundtable-deconstructing-media-narratives-on-foreign-policy',
      image_url: "https://images.pexels.com/photos/7713174/pexels-photo-7713174.jpeg?auto=compress&cs=tinysrgb&w=600",
      title: "Roundtable: Deconstructing Media Narratives on Foreign Policy",
      body: "Panel discussion examining how stories are framed in mainstream coverage."
    },
    {
      id: '4',
      slug: 'interview-former-official-discusses-intelligence-failures',
      image_url: "https://images.pexels.com/photos/8369688/pexels-photo-8369688.jpeg?auto=compress&cs=tinysrgb&w=600",
      title: "Interview: Former Official Discusses Intelligence Failures",
      body: "Exclusive conversation about systemic problems in analysis and reporting."
    }
  ];

  const displayNews = newsArticles.length > 0 ? newsArticles : placeholderNews;
  const displayVideos = videoArticles.length > 0 ? videoArticles : placeholderVideos;

  const getImageUrl = (story: any) => {
    return story.image_url;
  };

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
            {newsLoading ? (
              <div className="space-y-6">
                {[1, 2].map((i) => (
                  <div key={i} className="animate-pulse flex gap-4">
                    <div className="bg-neutral-200 w-40 h-28 rounded-sm"></div>
                    <div className="flex-1">
                      <div className="h-6 bg-neutral-200 rounded mb-2"></div>
                      <div className="h-4 bg-neutral-200 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {displayNews.map((story) => (
                  <Link key={story.id} to={`/article/${story.slug}`} className="group cursor-pointer flex gap-4">
                    <div className="relative overflow-hidden rounded-sm w-40 h-28 flex-shrink-0 bg-neutral-200">
                      <img
                        src={getImageUrl(story)}
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
            )}
          </div>

          <div>
            <h2 className="text-2xl font-bold text-neutral-900 mb-6 pb-3 border-b-2 border-red-700">
              VIDEO
            </h2>
            {videoLoading ? (
              <div className="space-y-6">
                {[1, 2].map((i) => (
                  <div key={i} className="animate-pulse flex gap-4">
                    <div className="bg-neutral-200 w-40 h-28 rounded-sm"></div>
                    <div className="flex-1">
                      <div className="h-6 bg-neutral-200 rounded mb-2"></div>
                      <div className="h-4 bg-neutral-200 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {displayVideos.map((story) => (
                  <Link key={story.id} to={`/article/${story.slug}`} className="group cursor-pointer flex gap-4">
                    <div className="relative overflow-hidden rounded-sm w-40 h-28 flex-shrink-0 bg-neutral-200">
                      <img
                        src={getImageUrl(story)}
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
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
