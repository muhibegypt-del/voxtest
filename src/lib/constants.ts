// Source of Truth for Tag-Driven Architecture
// These IDs correspond to the frontend sections.
// The 'tags' array defines which Ghost tags map to this section.

export const SECTIONS = {
    NEWS: {
        id: 'News',
        title: 'THE PULSE',
        color: 'brand-red',
        tags: ['news', 'breaking', 'politics']
    },
    ANALYSIS: {
        id: 'Analysis',
        title: 'ANALYSIS',
        color: 'section-analysis', // Blue
        tags: ['analysis', 'investigation', 'deep-dive']
    },
    VOICES: {
        id: 'Voices',
        title: 'VOICES',
        color: 'section-voices', // Purple
        tags: ['voices', 'opinion', 'commentary']
    },
    MEDIA: {
        id: 'Media',
        title: 'MEDIA',
        color: 'section-media', // Orange/Amber
        tags: ['media', 'video', 'watch']
    },
    STORE: {
        id: 'Store',
        title: 'THE STORE',
        color: 'section-store', // Green
        tags: ['store', 'shop', 'merch']
    },
    ARCHIVE: {
        id: 'Archive',
        title: 'THE ARCHIVE',
        color: 'section-archive', // Stone/Grey
        tags: ['archive', 'history', 'collection']
    },
    FOUNDATIONS: {
        id: 'Foundations',
        title: 'FOUNDATIONS',
        color: 'neutral-800',
        tags: ['foundations', 'theory', 'education']
    },
    BOOKSHELF: {
        id: 'Bookshelf',
        title: 'BOOKSHELF',
        color: 'neutral-800',
        tags: ['bookshelf', 'books', 'review']
    },
    CIRCLES: {
        id: 'Circles',
        title: 'CIRCLES',
        color: 'section-circles', // Custom color or reuse one
        tags: ['circles', 'community', 'groups']
    },
    ENTERTAINMENT: { // Legacy/Fallback
        id: 'Entertainment',
        title: 'ENTERTAINMENT',
        color: 'brand-green',
        tags: ['entertainment', 'culture']
    }
} as const;

export type SectionId = keyof typeof SECTIONS;

// Helper to normalize a Ghost tag to a Section ID
export function getSectionFromTags(tags: string[]): string {
    const lowerTags = tags.map(t => t.toLowerCase());

    for (const key in SECTIONS) {
        const section = SECTIONS[key as SectionId];
        if (section.tags.some(t => lowerTags.includes(t))) {
            return section.id;
        }
    }

    return 'News'; // Default fallback
}
