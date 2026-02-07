import SectionGrid from '../components/SectionGrid';
import { useContent } from '../context/ContentContext';

export default function Voices() {
  const { articles } = useContent();
  // Filter for Voices category (case insensitive just in case)
  const voicesArticles = articles.filter(a => a.category === 'Voices' || a.category === 'Opinion');

  return (
    <div className="min-h-screen bg-white">
      <section className="max-w-7xl mx-auto px-4 py-16 border-b border-neutral-200">
        <h1 className="text-6xl lg:text-7xl font-heading font-bold text-neutral-900 mb-4">
          Voices
        </h1>
        <p className="text-xl text-neutral-600 max-w-2xl leading-relaxed">
          Perspectives and polemics from engaged intellectuals and revolutionaries on the front lines of historical struggle.
        </p>
      </section>
      <SectionGrid articles={voicesArticles} badgeColorClass="text-yellow-500 border-yellow-500" />
    </div>
  );
}
