import { useContent } from '../context/ContentContext';
import Hero from '../components/Hero';
import LatestStories from '../components/LatestStories';
import CategorySection from '../components/CategorySection';
import Newsletter from '../components/Newsletter';
import { HeroSkeleton, LatestStoriesSkeleton, CategorySectionSkeleton } from '../components/Skeletons';

export default function Home() {
  const { loading } = useContent();

  // H2: Show skeleton while loading
  if (loading) {
    return (
      <>
        <HeroSkeleton />
        <LatestStoriesSkeleton />
        <CategorySectionSkeleton />
        <Newsletter />
      </>
    );
  }

  return (
    <>
      <Hero />
      <LatestStories />

      {/* Dynamic Tag-Driven Sections */}
      <CategorySection categoryId="NEWS" />
      <CategorySection categoryId="ANALYSIS" />
      <CategorySection categoryId="VOICES" />
      <CategorySection categoryId="MEDIA" />
      <CategorySection categoryId="STORE" />
      <CategorySection categoryId="FOUNDATIONS" />
      <CategorySection categoryId="ARCHIVE" />
      <CategorySection categoryId="BOOKSHELF" />
      <CategorySection categoryId="CIRCLES" />

      <Newsletter />
    </>
  );
}
