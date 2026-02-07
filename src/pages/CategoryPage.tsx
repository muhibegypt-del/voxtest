import { useParams, Link } from 'react-router-dom';
import { useContent } from '../context/ContentContext';
import SectionGrid from '../components/SectionGrid';
import { Helmet } from 'react-helmet';
import { useMemo } from 'react';
import { CategoryPageSkeleton } from '../components/Skeletons';

// Map URL slugs to internal Category names
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export default function CategoryPage() {
    const { category } = useParams<{ category: string }>();
    const { articles, loading } = useContent();

    const currentCategory = useMemo(() => {
        if (!category) return null;
        return capitalize(category);
    }, [category]);

    const categoryArticles = useMemo(() => {
        if (!currentCategory) return [];
        return articles.filter(
            (a) => a.category === currentCategory && a.published
        );
    }, [articles, currentCategory]);

    const pageTitle = currentCategory ? `${currentCategory} | Vox` : 'Vox';
    const pageDescription = `Read the latest ${currentCategory} articles on Vox.`;

    // H4: Show full skeleton while loading
    if (loading) {
        return <CategoryPageSkeleton />;
    }

    if (!currentCategory) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-heading font-bold text-neutral-900 mb-4">404</h1>
                    <p className="text-neutral-600">Category not found</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <Helmet>
                <title>{pageTitle}</title>
                <meta name="description" content={pageDescription} />
            </Helmet>

            <section className="max-w-7xl mx-auto px-4 py-16 border-b border-neutral-200">
                <h1 className="text-6xl lg:text-7xl font-heading font-bold text-neutral-900 mb-4">
                    {currentCategory}
                </h1>
                <p className="text-xl text-neutral-600 max-w-2xl leading-relaxed">
                    {`Explore our latest reporting and analysis in ${currentCategory}.`}
                </p>
            </section>

            {categoryArticles.length > 0 ? (
                <SectionGrid
                    articles={categoryArticles}
                    badgeColorClass="text-brand-red border-brand-red"
                />
            ) : (
                /* L4: CTA on empty category pages */
                <div className="max-w-7xl mx-auto px-4 py-16 text-center">
                    <p className="text-neutral-500 text-lg mb-6">
                        No articles found in this category yet.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/"
                            className="inline-flex items-center justify-center px-6 py-3 bg-brand-red text-white font-bold rounded-sm hover:opacity-90 transition-opacity min-h-[44px]"
                        >
                            Browse All Articles
                        </Link>
                        <a
                            href="#newsletter"
                            className="inline-flex items-center justify-center px-6 py-3 border-2 border-neutral-300 text-neutral-700 font-bold rounded-sm hover:border-brand-red hover:text-brand-red transition-colors min-h-[44px]"
                        >
                            Subscribe for Updates
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
}
