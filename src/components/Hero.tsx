import { useContent } from '../context/ContentContext';
import ArticleCard from './ui/ArticleCard';

export default function Hero() {
  const { articles } = useContent();
  // Filter featured articles from the live context
  const displayArticles = articles
    .filter(a => a.featured)
    .sort((a, b) => (b.featured_priority || 0) - (a.featured_priority || 0))
    .slice(0, 2);

  // Fallback if no featured articles
  if (displayArticles.length === 0 && articles.length > 0) {
    displayArticles.push(...articles.slice(0, 2));
  }

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {displayArticles.map((article, index) => (
          <ArticleCard
            key={article.id}
            article={article}
            variant="hero"
            showExcerpt={true}
            showCategory={true}
            priority={index === 0}
          />
        ))}
      </div>
    </section>
  );
}
