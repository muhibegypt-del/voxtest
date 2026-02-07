// Script to create demo posts for each tag in Ghost via Admin API
// Run with: npx tsx scripts/create_demo_posts.ts

import jwt from 'jsonwebtoken';

const GHOST_URL = 'https://voxtest.ghost.io';
const ADMIN_KEY = '695c910f63374600016097b5:b86b91a017f1819fa69cc4e16b73d4247772aea44e99e47be88a6a3f6e3daf92';

// Demo posts to create - one for each section
const DEMO_POSTS = [
    {
        title: '[DEMO] Analysis: The Future of Independent Journalism',
        slug: 'demo-analysis-future-journalism',
        html: '<p>This is a demo article for the <strong>Analysis</strong> section. In-depth investigations and deep dives into complex topics belong here.</p><p>Tag your articles with "analysis" to have them appear in this section.</p>',
        tags: [{ name: 'Analysis' }],
        feature_image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1200',
        status: 'published'
    },
    {
        title: '[DEMO] Voices: A New Perspective on Media Criticism',
        slug: 'demo-voices-media-criticism',
        html: '<p>This is a demo article for the <strong>Voices</strong> section. Opinion pieces, commentary, and personal perspectives belong here.</p><p>Tag your articles with "voices" to have them appear in this section.</p>',
        tags: [{ name: 'Voices' }],
        feature_image: 'https://images.pexels.com/photos/7648047/pexels-photo-7648047.jpeg?auto=compress&cs=tinysrgb&w=1200',
        status: 'published'
    },
    {
        title: '[DEMO] Media: Video Documentary Preview',
        slug: 'demo-media-documentary',
        html: '<p>This is a demo article for the <strong>Media</strong> section. Video content, multimedia pieces, and watch recommendations belong here.</p><p>Tag your articles with "media" to have them appear in this section.</p>',
        tags: [{ name: 'Media' }],
        feature_image: 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=1200',
        status: 'published'
    },
    {
        title: '[DEMO] Store: New Merchandise Available',
        slug: 'demo-store-merchandise',
        html: '<p>This is a demo article for <strong>The Store</strong> section. Product announcements, merch launches, and shop updates belong here.</p><p>Tag your articles with "store" to have them appear in this section.</p>',
        tags: [{ name: 'Store' }],
        feature_image: 'https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=1200',
        status: 'published'
    },
    {
        title: '[DEMO] Foundations: Understanding Historical Materialism',
        slug: 'demo-foundations-materialism',
        html: '<p>This is a demo article for the <strong>Foundations</strong> section. Educational content, theory explainers, and foundational texts belong here.</p><p>Tag your articles with "foundations" to have them appear in this section.</p>',
        tags: [{ name: 'Foundations' }],
        feature_image: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=1200',
        status: 'published'
    },
    {
        title: '[DEMO] Archive: Historical Documents Collection',
        slug: 'demo-archive-documents',
        html: '<p>This is a demo article for <strong>The Archive</strong> section. Historical content, document collections, and retrospectives belong here.</p><p>Tag your articles with "archive" to have them appear in this section.</p>',
        tags: [{ name: 'Archive' }],
        feature_image: 'https://images.pexels.com/photos/256431/pexels-photo-256431.jpeg?auto=compress&cs=tinysrgb&w=1200',
        status: 'published'
    },
    {
        title: '[DEMO] Bookshelf: Essential Reading for 2026',
        slug: 'demo-bookshelf-reading',
        html: '<p>This is a demo article for the <strong>Bookshelf</strong> section. Book reviews, reading recommendations, and literary analysis belong here.</p><p>Tag your articles with "bookshelf" to have them appear in this section.</p>',
        tags: [{ name: 'Bookshelf' }],
        feature_image: 'https://images.pexels.com/photos/1130980/pexels-photo-1130980.jpeg?auto=compress&cs=tinysrgb&w=1200',
        status: 'published'
    },
    {
        title: '[DEMO] Circles: Join Our Community Discussion',
        slug: 'demo-circles-community',
        html: '<p>This is a demo article for the <strong>Circles</strong> section. Community updates, group discussions, and engagement content belong here.</p><p>Tag your articles with "circles" to have them appear in this section.</p>',
        tags: [{ name: 'Circles' }],
        feature_image: 'https://images.pexels.com/photos/3184398/pexels-photo-3184398.jpeg?auto=compress&cs=tinysrgb&w=1200',
        status: 'published'
    }
];

function generateToken(): string {
    const [id, secret] = ADMIN_KEY.split(':');
    const token = jwt.sign({}, Buffer.from(secret, 'hex'), {
        keyid: id,
        algorithm: 'HS256',
        expiresIn: '5m',
        audience: '/admin/'
    });
    return token;
}

async function createPost(post: typeof DEMO_POSTS[0]) {
    const token = generateToken();
    const url = `${GHOST_URL}/ghost/api/admin/posts/`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Ghost ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                posts: [post]
            })
        });

        if (response.ok) {
            const data = await response.json();
            console.log(`✓ Created: ${post.title}`);
            return data.posts[0];
        } else {
            const error = await response.json();
            if (error.errors?.[0]?.message?.includes('already exists')) {
                console.log(`○ Already exists: ${post.title}`);
            } else {
                console.error(`✗ Failed: ${post.title}`, error.errors?.[0]?.message || response.status);
            }
        }
    } catch (err) {
        console.error(`✗ Error: ${post.title}`, err);
    }
}

async function main() {
    console.log('Creating demo posts for each section tag...\n');

    for (const post of DEMO_POSTS) {
        await createPost(post);
    }

    console.log('\n✓ Done! Check your homepage to see the demo posts in each section.');
}

main();
