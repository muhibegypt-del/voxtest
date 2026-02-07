import { Article } from '../types/cms';
import ArticleCard from './ui/ArticleCard';

interface SectionGridProps {
  articles: Article[];
  badgeColorClass?: string; // Kept for compatibility but unused by strict ArticleCard
}

export default function SectionGrid({ articles }: SectionGridProps) {
  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        {articles.map((article) => (
          <ArticleCard
            key={article.id}
            article={article}
            variant="hero"
            showExcerpt={true}
            showCategory={true}
          />
        ))}
      </div>
    </section>
  );
}
