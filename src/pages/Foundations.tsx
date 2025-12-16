import SectionGrid from '../components/SectionGrid';
import { FOUNDATIONS_ARTICLES } from '../data/mockData';

export default function Foundations() {
  return (
    <div className="min-h-screen bg-white">
      <section className="max-w-7xl mx-auto px-4 py-16 border-b border-neutral-200">
        <h1 className="text-6xl lg:text-7xl font-heading font-bold text-neutral-900 mb-4">
          Foundations
        </h1>
        <p className="text-xl text-neutral-600 max-w-2xl leading-relaxed">
          Theoretical texts and scholarly exegesis on the fundamental concepts that structure revolutionary thought and practice.
        </p>
      </section>
      <SectionGrid articles={FOUNDATIONS_ARTICLES} badgeColorClass="text-white border-white" />
    </div>
  );
}
