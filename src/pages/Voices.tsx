import SectionGrid from '../components/SectionGrid';
import { VOICES_ARTICLES } from '../data/mockData';

export default function Voices() {
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
      <SectionGrid articles={VOICES_ARTICLES} badgeColorClass="text-yellow-500 border-yellow-500" />
    </div>
  );
}
