import { useContent } from '../context/ContentContext';
import { ArticleCardSkeleton as SkeletonCard } from './Skeletons';
import ArticleCard from './ui/ArticleCard';

export default function LatestStories() {
  const { articles, loading } = useContent();
  const displayStories = articles.slice(0, 4);

  return (
    // bg-neutral-50 maps to #FAFAFA (Very subtle separation from white)
    <section className="bg-neutral-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header: Standardized with CategorySection style */}
        <h2 className="text-2xl font-heading font-bold text-neutral-900 mb-6 pb-3 border-b-2 border-brand-red">
          LATEST STORIES
        </h2>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : displayStories.length === 0 ? (
          // Principle 9: Supercharge default empty states
          <div className="text-center py-12 bg-white rounded-lg border border-neutral-200 dashed">
            <h3 className="text-xl font-heading font-bold text-neutral-400 mb-2">No Stories Found</h3>
            <p className="text-neutral-500">Check back later for new updates.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayStories.map((story) => (
              <ArticleCard
                key={story.id}
                article={story}
                variant="standard"
                showExcerpt={false}
                showCategory={false}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}