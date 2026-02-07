// Skeleton components for loading states
// H2/H3/H4: Performance perception - show content structure while loading

export function ArticleCardSkeleton() {
    return (
        <div className="animate-pulse">
            <div className="relative overflow-hidden rounded-sm mb-3 aspect-[3/2] bg-neutral-200" />
            <div className="h-5 bg-neutral-200 rounded mb-2 w-3/4" />
            <div className="h-4 bg-neutral-200 rounded w-1/2" />
        </div>
    );
}

export function HeroSkeleton() {
    return (
        <section className="max-w-7xl mx-auto px-4 py-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {[1, 2].map(i => (
                    <div key={i} className="animate-pulse">
                        <div className="relative overflow-hidden rounded-sm mb-4 aspect-video bg-neutral-200" />
                        <div className="h-10 bg-neutral-200 rounded mb-3 w-full" />
                        <div className="h-10 bg-neutral-200 rounded mb-3 w-3/4" />
                        <div className="h-4 bg-neutral-200 rounded mb-2 w-full" />
                        <div className="h-4 bg-neutral-200 rounded w-2/3" />
                        <div className="flex items-center gap-3 mt-4">
                            <div className="h-3 bg-neutral-200 rounded w-24" />
                            <div className="h-3 bg-neutral-200 rounded w-16" />
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

export function LatestStoriesSkeleton() {
    return (
        <section className="bg-neutral-50 py-12">
            <div className="max-w-7xl mx-auto px-4">
                <div className="h-8 bg-neutral-200 rounded w-48 mb-6" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(i => (
                        <ArticleCardSkeleton key={i} />
                    ))}
                </div>
            </div>
        </section>
    );
}

export function CategorySectionSkeleton() {
    return (
        <section className="max-w-7xl mx-auto px-4 py-12">
            <div className="h-8 bg-neutral-200 rounded w-32 mb-6" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                    <ArticleCardSkeleton key={i} />
                ))}
            </div>
        </section>
    );
}

export function ArticleDetailSkeleton() {
    return (
        <article className="min-h-screen bg-white">
            {/* Progress bar placeholder */}
            <div className="fixed top-0 left-0 w-full h-1 bg-neutral-200 z-50" />

            {/* Back button area */}
            <div className="bg-neutral-50 py-4 border-b border-neutral-200">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="h-4 bg-neutral-200 rounded w-24 animate-pulse" />
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-8 animate-pulse">
                {/* Breadcrumb */}
                <div className="h-3 bg-neutral-200 rounded w-32 mb-4" />

                {/* Badges */}
                <div className="flex gap-2 mb-4">
                    <div className="h-6 bg-neutral-200 rounded-sm w-20" />
                    <div className="h-6 bg-neutral-200 rounded-sm w-16" />
                </div>

                {/* Title */}
                <div className="h-12 bg-neutral-200 rounded mb-3 w-full" />
                <div className="h-12 bg-neutral-200 rounded mb-6 w-3/4" />

                {/* Meta */}
                <div className="flex gap-4 mb-8 pb-8 border-b border-neutral-200">
                    <div className="h-4 bg-neutral-200 rounded w-24" />
                    <div className="h-4 bg-neutral-200 rounded w-32" />
                </div>

                {/* Featured Image */}
                <div className="aspect-video bg-neutral-200 rounded-lg mb-8" />

                {/* Body content */}
                <div className="space-y-4">
                    <div className="h-4 bg-neutral-200 rounded w-full" />
                    <div className="h-4 bg-neutral-200 rounded w-full" />
                    <div className="h-4 bg-neutral-200 rounded w-5/6" />
                    <div className="h-4 bg-neutral-200 rounded w-full" />
                    <div className="h-4 bg-neutral-200 rounded w-4/5" />
                    <div className="h-4 bg-neutral-200 rounded w-full" />
                    <div className="h-4 bg-neutral-200 rounded w-3/4" />
                </div>
            </div>
        </article>
    );
}

export function CategoryPageSkeleton() {
    return (
        <div className="min-h-screen bg-white">
            <section className="max-w-7xl mx-auto px-4 py-16 border-b border-neutral-200 animate-pulse">
                <div className="h-16 bg-neutral-200 rounded w-64 mb-4" />
                <div className="h-6 bg-neutral-200 rounded w-96" />
            </section>

            <section className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <ArticleCardSkeleton key={i} />
                    ))}
                </div>
            </section>
        </div>
    );
}
