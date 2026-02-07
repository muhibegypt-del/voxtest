import { Link } from 'react-router-dom';
import { generateExcerpt } from '../../lib/utils';
import CardMeta from './CardMeta';

export type ArticleCardVariant = 'hero' | 'standard' | 'compact' | 'wide';

interface ArticleCardProps {
    article: {
        id: string;
        slug: string;
        title: string;
        excerpt?: string;
        body?: string;
        image_url?: string | null;
        author_name?: string;
        created_at: string;
        category?: string;
    };
    variant?: ArticleCardVariant;
    showExcerpt?: boolean; // Forced true for Hero, optional for Standard, false for Compact
    showCategory?: boolean;
    className?: string;
    priority?: boolean; // For LCP optimization on Hero images
}

export default function ArticleCard({
    article,
    variant = 'standard',
    showExcerpt = false,
    showCategory = false,
    className = '',
    priority = false,
}: ArticleCardProps) {
    const excerptText = article.excerpt || generateExcerpt(article.body || '', 120);

    // --- VARIANT LOGIC ---

    // 1. HERO VARIANT (The Lead)
    // - 16:9 Image
    // - Category Absolute Top-Left
    // - Huge Title
    // - Excerpt Visible
    if (variant === 'hero') {
        return (
            <Link to={`/article/${article.slug}`} className={`group block ${className}`}>
                <div className="relative w-full aspect-[16/9] overflow-hidden rounded-sm mb-4 bg-neutral-200">
                    {article.image_url && (
                        <img
                            src={article.image_url}
                            alt={article.title}
                            loading={priority ? "eager" : "lazy"}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                        />
                    )}
                    {/* Hero Category Badge - Absolute */}
                    {showCategory && article.category && (
                        <span className="absolute top-0 left-0 bg-brand-red text-white text-[10px] sm:text-xs font-bold uppercase tracking-widest px-3 py-1.5 shadow-sm">
                            {article.category}
                        </span>
                    )}
                </div>

                <div className="space-y-3">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold text-neutral-900 leading-[1.1] tracking-tight group-hover:text-brand-red transition-colors duration-200">
                        {article.title}
                    </h2>

                    <p className="text-sm sm:text-base text-neutral-600 leading-relaxed line-clamp-3">
                        {excerptText}
                    </p>

                    <CardMeta
                        authorName={article.author_name}
                        date={article.created_at}
                        className="pt-1"
                    />
                </div>
            </Link>
        );
    }

    // 2. WIDE VARIANT (Grid Span 2x1)
    // - Flex Row Layout
    // - Image Left (50%), Content Right (50%)
    // - Best for filling gaps in grid
    if (variant === 'wide') {
        return (
            <Link to={`/article/${article.slug}`} className={`group block h-full flex flex-row gap-6 bg-white overflow-hidden ${className}`}>
                <div className="relative w-1/2 aspect-[4/3] sm:aspect-[3/2] overflow-hidden rounded-sm bg-neutral-200 shrink-0">
                    {article.image_url && (
                        <img
                            src={article.image_url}
                            alt={article.title}
                            loading="lazy"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                    )}
                </div>

                <div className="flex flex-col flex-1 py-1">
                    {showCategory && article.category && (
                        <span className="text-[10px] sm:text-xs font-bold text-brand-red uppercase tracking-widest mb-2 block">
                            {article.category}
                        </span>
                    )}

                    <h3 className="text-lg sm:text-xl lg:text-2xl font-heading font-bold text-neutral-900 leading-tight mb-3 group-hover:text-brand-red transition-colors">
                        {article.title}
                    </h3>

                    <p className="hidden sm:block text-sm text-neutral-600 leading-relaxed line-clamp-3 mb-4">
                        {excerptText}
                    </p>

                    <div className="mt-auto">
                        <CardMeta
                            authorName={article.author_name}
                            date={article.created_at}
                        />
                    </div>
                </div>
            </Link>
        );
    }

    // 3. COMPACT VARIANT (Sidebar / List)
    // - Flex Layout (Row)
    // - Small 1:1 Thumbnail (w-20)
    // - No Excerpt
    if (variant === 'compact') {
        return (
            <Link to={`/article/${article.slug}`} className={`group flex gap-4 items-start ${className}`}>
                {/* Fixed width thumbnail */}
                <div className="shrink-0 w-20 h-20 bg-neutral-200 rounded-sm overflow-hidden relative">
                    {article.image_url && (
                        <img
                            src={article.image_url}
                            alt={article.title}
                            loading="lazy"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                    )}
                </div>

                <div className="flex flex-col justify-center h-20">
                    {showCategory && article.category && (
                        <span className="text-[10px] font-bold text-brand-red uppercase tracking-widest mb-1 block">
                            {article.category}
                        </span>
                    )}
                    <h4 className="text-base sm:text-lg font-heading font-semibold text-neutral-900 leading-tight group-hover:text-brand-red transition-colors line-clamp-2">
                        {article.title}
                    </h4>
                    <CardMeta
                        date={article.created_at}
                        showAuthor={false}
                        className="mt-1"
                    />
                </div>
            </Link>
        );
    }

    // 3. STANDARD VARIANT (Grid Default)
    // - 3:2 Image
    // - Category Static Above Title
    // - Large Title
    // - Excerpt (Hidden on Mobile, Visible on Desktop)
    return (
        <Link to={`/article/${article.slug}`} className={`group block h-full flex flex-col ${className}`}>
            <div className="relative w-full aspect-[3/2] overflow-hidden rounded-sm mb-3 bg-neutral-200">
                {article.image_url && (
                    <img
                        src={article.image_url}
                        alt={article.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                )}
            </div>

            <div className="flex flex-col flex-grow">
                {showCategory && article.category && (
                    <span className="text-[10px] sm:text-xs font-bold text-brand-red uppercase tracking-widest mb-1.5 block">
                        {article.category}
                    </span>
                )}

                <h3 className="text-lg sm:text-xl font-heading font-bold text-neutral-900 leading-[1.2] tracking-normal mb-2 group-hover:text-brand-red transition-colors">
                    {article.title}
                </h3>

                {showExcerpt && (
                    <p className="hidden sm:block text-sm text-neutral-600 leading-relaxed line-clamp-2 mb-3">
                        {excerptText}
                    </p>
                )}

                <div className="mt-auto pt-2">
                    <CardMeta
                        authorName={article.author_name}
                        date={article.created_at}
                    />
                </div>
            </div>
        </Link>
    );
}
