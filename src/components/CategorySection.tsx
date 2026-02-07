import { useContent } from '../context/ContentContext';
import { CategorySectionSkeleton } from './Skeletons';
import { SECTIONS, SectionId } from '../lib/constants';
import ArticleCard from './ui/ArticleCard';

interface CategorySectionProps {
  categoryId: SectionId;
}

export default function CategorySection({ categoryId }: CategorySectionProps) {
  const { articles, loading } = useContent();

  // Get config for this section (title, color, etc.)
  const sectionConfig = SECTIONS[categoryId.toUpperCase() as keyof typeof SECTIONS];

  if (loading) {
    return <CategorySectionSkeleton />;
  }

  // Filter articles that match this section's ID (normalized by ContentContext)
  // Display only the latest 4 articles for this section
  const sectionArticles = articles
    .filter(article => article.category === sectionConfig.id)
    .slice(0, 5);

  // Border color mapping for Tailwind
  const borderColorMap: Record<string, string> = {
    'brand-red': 'border-brand-red',
    'brand-green': 'border-brand-green',
    'section-analysis': 'border-blue-600',
    'section-voices': 'border-purple-600',
    'section-media': 'border-amber-500',
    'section-circles': 'border-teal-600',
    'neutral-800': 'border-neutral-800',
    // Fallbacks
    'section-store': 'border-green-600',
    'section-archive': 'border-stone-500',
  };

  const borderColorClass = borderColorMap[sectionConfig.color] || 'border-neutral-800';

  return (
    <section id={`section-${sectionConfig.id.toLowerCase()}`} className="py-12 border-b border-neutral-200 last:border-0">
      <div className="max-w-7xl mx-auto px-4">

        {/* Section Header */}
        <h2 className={`text-2xl font-heading font-bold text-neutral-900 mb-6 pb-3 border-b-2 ${borderColorClass} inline-block pr-8`}>
          {sectionConfig.title}
        </h2>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {sectionArticles.length > 0 ? (
            sectionArticles.map((story, index) => {
              // Adaptive Layout Logic to prevent gaps
              const total = sectionArticles.length;
              let gridClass = '';
              let cardVariant: 'hero' | 'standard' | 'wide' = 'standard';

              if (index === 0) {
                gridClass = 'md:col-span-2 md:row-span-2';
                cardVariant = 'hero';
              } else if (total === 2) {
                gridClass = 'md:col-span-2 md:row-span-2';
                cardVariant = 'hero'; // Split screen
              } else if (total === 3) {
                gridClass = 'md:col-span-2';
                cardVariant = 'wide'; // Stacked wide cards
              } else if (total === 4 && index === 3) {
                gridClass = 'md:col-span-2';
                cardVariant = 'wide'; // Bottom filler
              }

              return (
                <ArticleCard
                  key={story.id}
                  article={story}
                  variant={cardVariant}
                  priority={index === 0}
                  className={gridClass}
                  showExcerpt={index === 0} // Only show excerpt for the featured one
                  showCategory={false}
                />
              );
            })
          ) : (
            <div className="col-span-full p-8 border border-dashed border-neutral-300 rounded-sm text-center">
              <p className="text-neutral-500 italic">No stories currently available in {sectionConfig.title}.</p>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}