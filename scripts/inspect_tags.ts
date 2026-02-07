
// Simple script to fetch tags from the configured Ghost instance
// Run with: npx tsx scripts/inspect_tags.ts

const GHOST_URL = 'https://voxtest.ghost.io';
const GHOST_KEY = 'c447c6899807ecc0a386de8a74';

async function fetchTags() {
    console.log('Fetching posts from Ghost...');
    try {
        const url = `${GHOST_URL}/ghost/api/content/posts/?key=${GHOST_KEY}&include=tags&limit=all`;
        const response = await fetch(url);
        const data = await response.json();

        if (!data.posts) {
            console.log('No posts found or API error.');
            return;
        }

        console.log(`Found ${data.posts.length} posts.`);

        const allTags = new Set();
        data.posts.forEach((post: any) => {
            console.log(`\nPost: "${post.title}"`);
            const tags = post.tags?.map((t: any) => t.name) || [];
            console.log(`  Tags: [${tags.join(', ')}]`);
            tags.forEach((t: string) => allTags.add(t));
        });

        console.log('\n--- ALL UNIQUE TAGS FOUND ---');
        console.log(Array.from(allTags));

    } catch (e) {
        console.error('Error fetching:', e);
    }
}

fetchTags();
