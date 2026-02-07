import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { GhostService, GhostPost } from '../lib/ghost';
import { Article, ARTICLES, ANALYSIS_ARTICLES, VOICES_ARTICLES, FOUNDATIONS_ARTICLES, BOOKSHELF_ARTICLES } from '../data/mockData';
import { getSectionFromTags } from '../lib/constants';

// Hybrid content provider - fetches from Ghost, falls back to mockData
// Ghost posts are mapped to the existing Article interface for compatibility

interface ContentContextType {
    articles: Article[];
    loading: boolean;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

// Combine all fallback article sources
// Combine all fallback article sources and deduplicate by ID
const FALLBACK_ARTICLES: Article[] = Array.from(
    new Map(
        [
            ...ARTICLES,
            ...ANALYSIS_ARTICLES,
            ...VOICES_ARTICLES,
            ...FOUNDATIONS_ARTICLES,
            ...BOOKSHELF_ARTICLES,
        ].map((article) => [article.id, article])
    ).values()
);

// Map Ghost post to our Article interface
function mapGhostPostToArticle(post: GhostPost): Article {
    // 1. Get all tag names
    const tagNames = post.tags?.map(t => t.name) || [];

    // 2. Determine Section ID from tags (e.g. 'analysis' tag -> 'Analysis' section)
    // If no matching tag is found, it defaults to 'News'
    const sectionCategory = getSectionFromTags(tagNames);

    return {
        id: post.id,
        title: post.title,
        slug: post.slug,
        body: post.html || '',
        excerpt: post.excerpt || '',
        image_url: post.feature_image || '',
        category: sectionCategory, // Normalized Category
        content_type: 'Article',
        author_name: post.primary_author?.name || 'Voxummah',
        published: true,
        featured: post.featured,
        featured_priority: post.featured ? 10 : 0,
        view_count: 0,
        tags: tagNames,
        created_at: post.published_at || post.created_at,
        updated_at: post.updated_at,
    };
}

export function ContentProvider({ children }: { children: React.ReactNode }) {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchContent() {
            try {
                const ghostPosts = await GhostService.getPosts();

                if (ghostPosts.length > 0) {
                    // Map Ghost posts to Article format
                    const ghostArticles = ghostPosts.map(mapGhostPostToArticle);
                    // Combine Ghost articles with fallback (Ghost takes priority)
                    const combined = [...ghostArticles, ...FALLBACK_ARTICLES];
                    setArticles(combined);
                    console.log(`Loaded ${ghostArticles.length} Ghost articles + ${FALLBACK_ARTICLES.length} fallback articles`);
                } else {
                    // No Ghost posts? Use fallback
                    setArticles(FALLBACK_ARTICLES);
                    console.log('Using fallback articles (Ghost returned empty)');
                }
            } catch (error) {
                console.error('Failed to fetch Ghost content:', error);
                setArticles(FALLBACK_ARTICLES);
            } finally {
                setLoading(false);
            }
        }

        fetchContent();
    }, []);

    const value = useMemo(() => ({
        articles,
        loading,
    }), [articles, loading]);

    return (
        <ContentContext.Provider value={value}>
            {children}
        </ContentContext.Provider>
    );
}

export function useContent() {
    const context = useContext(ContentContext);
    if (context === undefined) {
        throw new Error('useContent must be used within a ContentProvider');
    }
    return context;
}
