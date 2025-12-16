import SectionGrid from '../components/SectionGrid';
import { ANALYSIS_ARTICLES } from '../data/mockData';

export default function Analysis() {
  return (
    <div className="min-h-screen bg-white">
      <section className="max-w-7xl mx-auto px-4 py-16 border-b border-neutral-200">
        <h1 className="text-6xl lg:text-7xl font-heading font-bold text-neutral-900 mb-4">
          Analysis
        </h1>
        <p className="text-xl text-neutral-600 max-w-2xl leading-relaxed">
          Deep-dive investigations into the structural contradictions of global political economy, examining the material conditions that shape our world.
        </p>
      </section>
      <SectionGrid articles={ANALYSIS_ARTICLES} badgeColorClass="text-blue-500 border-blue-500" />
    </div>
  );
}
