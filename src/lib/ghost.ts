// Ghost API Configuration - Direct fetch (no SDK needed)
const GHOST_URL = 'https://voxtest.ghost.io';
const GHOST_KEY = 'c447c6899807ecc0a386de8a74';

export interface GhostPost {
    id: string;
    uuid: string;
    title: string;
    slug: string;
    html: string;
    excerpt: string;
    feature_image: string | null;
    featured: boolean;
    created_at: string;
    updated_at: string;
    published_at: string;
    reading_time: number;
    primary_tag?: {
        id: string;
        name: string;
        slug: string;
    };
    tags?: Array<{
        id: string;
        name: string;
        slug: string;
    }>;
    primary_author?: {
        id: string;
        name: string;
        slug: string;
        profile_image: string | null;
        bio: string | null;
    };
}

interface GhostResponse {
    posts: GhostPost[];
    meta?: {
        pagination: {
            page: number;
            limit: number;
            pages: number;
            total: number;
        };
    };
}

const buildUrl = (endpoint: string, params: Record<string, string> = {}) => {
    const url = new URL(`${GHOST_URL}/ghost/api/content/${endpoint}/`);
    url.searchParams.set('key', GHOST_KEY);
    Object.entries(params).forEach(([key, value]) => {
        url.searchParams.set(key, value);
    });
    return url.toString();
};

export const GhostService = {
    // Fetch all posts
    async getPosts(): Promise<GhostPost[]> {
        try {
            const url = buildUrl('posts', {
                include: 'tags,authors',
                limit: 'all'
            });
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const data: GhostResponse = await response.json();
            console.log('Ghost posts fetched:', data.posts.length);
            return data.posts;
        } catch (err) {
            console.error('Ghost API error:', err);
            return [];
        }
    },

    // Fetch single post by slug
    async getPostBySlug(slug: string): Promise<GhostPost | null> {
        try {
            const url = buildUrl(`posts/slug/${slug}`, {
                include: 'tags,authors'
            });
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const data: GhostResponse = await response.json();
            return data.posts[0] || null;
        } catch (err) {
            console.error('Ghost API error:', err);
            return null;
        }
    },

    // Fetch posts by tag
    async getPostsByTag(tagSlug: string): Promise<GhostPost[]> {
        try {
            const url = buildUrl('posts', {
                include: 'tags,authors',
                filter: `tag:${tagSlug}`,
                limit: 'all'
            });
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const data: GhostResponse = await response.json();
            return data.posts;
        } catch (err) {
            console.error('Ghost API error:', err);
            return [];
        }
    }
};
