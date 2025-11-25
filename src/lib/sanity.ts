import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID;
const hasSanityConfig = projectId && projectId !== 'your_sanity_project_id';

export const client = hasSanityConfig
  ? createClient({
      projectId: projectId,
      dataset: import.meta.env.VITE_SANITY_DATASET || 'production',
      useCdn: true,
      apiVersion: '2024-01-01',
    })
  : null;

export function urlFor(source: any) {
  if (!client) return { url: () => '' };
  const builder = imageUrlBuilder(client);
  return builder.image(source);
}
