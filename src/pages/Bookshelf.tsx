import SectionGrid from '../components/SectionGrid';
import { BOOKSHELF_ARTICLES } from '../data/mockData';

export default function Bookshelf() {
  return (
    <div className="min-h-screen bg-white">
      <section className="max-w-7xl mx-auto px-4 py-16 border-b border-neutral-200">
        <h1 className="text-6xl lg:text-7xl font-heading font-bold text-neutral-900 mb-4">
          Bookshelf
        </h1>
        <p className="text-xl text-neutral-600 max-w-2xl leading-relaxed">
          Critical reviews and essential readings from the canon of revolutionary theory and contemporary radical scholarship.
        </p>
      </section>
      <SectionGrid articles={BOOKSHELF_ARTICLES} badgeColorClass="text-green-600 border-green-600" />
    </div>
  );
}
