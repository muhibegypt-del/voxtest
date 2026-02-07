// Script to create all section tags in Ghost via Admin API
// Run with: npx tsx scripts/create_tags.ts

import jwt from 'jsonwebtoken';

const GHOST_URL = 'https://voxtest.ghost.io';
const ADMIN_KEY = '695c910f63374600016097b5:b86b91a017f1819fa69cc4e16b73d4247772aea44e99e47be88a6a3f6e3daf92';

// Tags to create (matching constants.ts SECTIONS)
const TAGS_TO_CREATE = [
    { name: 'Analysis', slug: 'analysis', description: 'In-depth analysis and investigation' },
    { name: 'Voices', slug: 'voices', description: 'Opinion and commentary pieces' },
    { name: 'Media', slug: 'media', description: 'Video and multimedia content' },
    { name: 'Store', slug: 'store', description: 'Shop and merchandise' },
    { name: 'Archive', slug: 'archive', description: 'Historical collections' },
    { name: 'Foundations', slug: 'foundations', description: 'Theory and educational content' },
    { name: 'Bookshelf', slug: 'bookshelf', description: 'Book reviews and recommendations' },
    { name: 'Circles', slug: 'circles', description: 'Community and group content' },
];

// Generate JWT for Admin API authentication
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

async function createTag(tag: { name: string; slug: string; description: string }) {
    const token = generateToken();
    const url = `${GHOST_URL}/ghost/api/admin/tags/`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Ghost ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                tags: [tag]
            })
        });

        if (response.ok) {
            const data = await response.json();
            console.log(`✓ Created tag: ${tag.name}`);
            return data.tags[0];
        } else {
            const error = await response.json();
            if (error.errors?.[0]?.type === 'ValidationError' && error.errors?.[0]?.message?.includes('already exists')) {
                console.log(`○ Tag already exists: ${tag.name}`);
            } else {
                console.error(`✗ Failed to create ${tag.name}:`, error.errors?.[0]?.message || response.status);
            }
        }
    } catch (err) {
        console.error(`✗ Error creating ${tag.name}:`, err);
    }
}

async function main() {
    console.log('Creating Ghost tags...\n');

    for (const tag of TAGS_TO_CREATE) {
        await createTag(tag);
    }

    console.log('\n✓ Done! All tags should now be available in Ghost Admin.');
}

main();
