import { useSupabaseArticles } from '../hooks/useSanityArticles';
import { Link } from 'react-router-dom';

export default function LatestStories() {
  const { articles, loading } = useSupabaseArticles({
    limit: 4,
    publishedOnly: true,
  });

  const placeholderStories = [
    {
      id: '1',
      slug: 'intelligence-agency-documents-reveal-coordinated-influence-campaign',
      image_url: "https://images.pexels.com/photos/8828594/pexels-photo-8828594.jpeg?auto=compress&cs=tinysrgb&w=600",
      title: "Intelligence Agency Documents Reveal Coordinated Influence Campaign",
      created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '2',
      slug: 'western-media-outlets-failed-to-verify-claims-investigation-shows',
      image_url: "https://images.pexels.com/photos/7713174/pexels-photo-7713174.jpeg?auto=compress&cs=tinysrgb&w=600",
      title: "Western Media Outlets Failed to Verify Claims, Investigation Shows",
      created_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '3',
      slug: 'leaked-emails-show-coordination-between-think-tanks-and-government',
      image_url: "https://images.pexels.com/photos/8828583/pexels-photo-8828583.jpeg?auto=compress&cs=tinysrgb&w=600",
      title: "Leaked Emails Show Coordination Between Think Tanks and Government",
      created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '4',
      slug: 'whistleblower-testimony-contradicts-official-narrative',
      image_url: "https://images.pexels.com/photos/8369686/pexels-photo-8369686.jpeg?auto=compress&cs=tinysrgb&w=600",
      title: "Whistleblower Testimony Contradicts Official Narrative",
      created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    }
  ];

  const displayStories = articles.length > 0 ? articles : placeholderStories;

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const hours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours} hours ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  };

  const getImageUrl = (story: any, index: number) => {
    return story.image_url || placeholderStories[index % 4].image_url;
  };

  if (loading) {
    return (
      <section className="bg-neutral-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-neutral-900 mb-6 pb-3 border-b-2 border-red-700">
            LATEST STORIES
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-neutral-200 aspect-video rounded-sm mb-3"></div>
                <div className="h-6 bg-neutral-200 rounded mb-2"></div>
                <div className="h-4 bg-neutral-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-neutral-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-neutral-900 mb-6 pb-3 border-b-2 border-red-700">
          LATEST STORIES
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayStories.map((story, index) => (
            <Link key={story.id} to={`/article/${story.slug}`} className="group cursor-pointer block">
              <div className="relative overflow-hidden rounded-sm mb-3 aspect-video bg-neutral-200">
                <img
                  src={getImageUrl(story, index)}
                  alt={story.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="text-lg font-bold text-neutral-900 mb-2 group-hover:text-red-700 transition-colors leading-tight line-clamp-2 break-words">
                {story.title}
              </h3>
              <div className="text-sm text-neutral-500">
                By Staff Writer • {getTimeAgo(story.created_at)}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
