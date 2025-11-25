import { supabase } from './supabase';
import { Tag } from '../types/cms';

export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

export const checkSlugUniqueness = async (
  slug: string,
  excludeArticleId?: string
): Promise<boolean> => {
  const query = supabase
    .from('articles')
    .select('id')
    .eq('slug', slug);

  if (excludeArticleId) {
    query.neq('id', excludeArticleId);
  }

  const { data, error } = await query.maybeSingle();

  if (error) {
    console.error('Error checking slug uniqueness:', error);
    return false;
  }

  return !data;
};

export const createTag = async (name: string): Promise<Tag | null> => {
  const slug = generateSlug(name);

  const { data: existingTag } = await supabase
    .from('tags')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (existingTag) {
    return existingTag;
  }

  const { data, error } = await supabase
    .from('tags')
    .insert([{ name, slug }])
    .select()
    .single();

  if (error) {
    console.error('Error creating tag:', error);
    return null;
  }

  return data;
};

export const searchTags = async (query: string): Promise<Tag[]> => {
  const { data, error } = await supabase
    .from('tags')
    .select('*')
    .ilike('name', `%${query}%`)
    .order('usage_count', { ascending: false })
    .limit(10);

  if (error) {
    console.error('Error searching tags:', error);
    return [];
  }

  return data || [];
};

export const linkArticleToTags = async (
  articleId: string,
  tagSlugs: string[]
): Promise<void> => {
  const { data: tags } = await supabase
    .from('tags')
    .select('id, slug')
    .in('slug', tagSlugs);

  if (!tags || tags.length === 0) return;

  await supabase
    .from('article_tags')
    .delete()
    .eq('article_id', articleId);

  const articleTags = tags.map(tag => ({
    article_id: articleId,
    tag_id: tag.id,
  }));

  await supabase.from('article_tags').insert(articleTags);

  await supabase
    .from('articles')
    .update({ tags: tagSlugs })
    .eq('id', articleId);
};

export const getArticleTags = async (articleId: string): Promise<Tag[]> => {
  const { data, error } = await supabase
    .from('article_tags')
    .select('tag_id, tags(*)')
    .eq('article_id', articleId);

  if (error || !data) {
    console.error('Error fetching article tags:', error);
    return [];
  }

  return data.map((item: any) => item.tags).filter(Boolean);
};

export const recordArticleView = async (
  articleId: string,
  userAgent?: string
): Promise<void> => {
  await supabase.from('article_views').insert([
    {
      article_id: articleId,
      user_agent: userAgent,
    },
  ]);

  await supabase.rpc('increment_view_count', { article_id: articleId });
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else {
    return formatDate(dateString);
  }
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
};

export const getDefaultImageUrl = (): string => {
  return 'https://images.pexels.com/photos/6077326/pexels-photo-6077326.jpeg?auto=compress&cs=tinysrgb&w=1200';
};

export const validateImageUrl = (url: string): boolean => {
  if (!url) return true;
  return /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(url);
};

export const generateExcerpt = (body: string, maxLength: number = 160): string => {
  const plainText = body.replace(/<[^>]*>/g, '').replace(/\n+/g, ' ').trim();
  return truncateText(plainText, maxLength);
};

export const validateArticleForm = (formData: any): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};

  if (!formData.title || formData.title.length === 0) {
    errors.title = 'Title is required';
  } else if (formData.title.length > 150) {
    errors.title = 'Title must be 150 characters or less';
  }

  if (!formData.body || formData.body.length < 100) {
    errors.body = `Body must be at least 100 characters (current: ${formData.body?.length || 0})`;
  }

  if (!formData.slug || formData.slug.length === 0) {
    errors.slug = 'Slug is required';
  }

  if (formData.image_url && !formData.image_url.match(/^https?:\/\//)) {
    errors.image_url = 'Image URL must start with http:// or https://';
  }

  if (formData.meta_title && formData.meta_title.length > 60) {
    errors.meta_title = 'Meta title should be 60 characters or less for optimal SEO';
  }

  if (formData.meta_description && formData.meta_description.length > 160) {
    errors.meta_description = 'Meta description should be 160 characters or less for optimal SEO';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const categories = [
  'News',
  'Politics',
  'Technology',
  'Business',
  'Sports',
  'Entertainment',
] as const;

export type Category = typeof categories[number];

export const contentTypes = [
  'News',
  'Opinion',
  'Analysis',
  'Explainer',
  'Video',
  'Live',
  'Feature',
] as const;

export type ContentType = typeof contentTypes[number];

export const fetchSubcategories = async (parentCategory: string) => {
  const { data, error } = await supabase
    .from('subcategories')
    .select('*')
    .eq('parent_category', parentCategory)
    .order('name');

  if (error) {
    console.error('Error fetching subcategories:', error);
    return [];
  }

  return data || [];
};

export const fetchAllRegions = async () => {
  const { data, error } = await supabase
    .from('regions')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching regions:', error);
    return [];
  }

  return data || [];
};

export const fetchContentTypes = async () => {
  const { data, error } = await supabase
    .from('content_types')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching content types:', error);
    return [];
  }

  return data || [];
};
