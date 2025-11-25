import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface Article {
  id: string;
  title: string;
  slug: string;
  body: string;
  image_url: string | null;
  category: string;
  published: boolean;
  created_at: string;
}

interface UseArticlesOptions {
  category?: string;
  limit?: number;
  publishedOnly?: boolean;
  featuredOnly?: boolean;
}

export function useSupabaseArticles(options: UseArticlesOptions = {}) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const { category, limit, publishedOnly = true, featuredOnly = false } = options;

  useEffect(() => {
    async function fetchArticles() {
      try {
        setLoading(true);
        let query = supabase
          .from('articles')
          .select('*');

        if (featuredOnly) {
          query = query.eq('featured', true).order('featured_priority', { ascending: false });
        } else {
          query = query.order('created_at', { ascending: false });
        }

        if (publishedOnly) {
          query = query.eq('published', true);
        }

        if (category) {
          query = query.eq('category', category);
        }

        if (limit) {
          query = query.limit(limit);
        }

        const { data, error: fetchError } = await query;

        if (fetchError) throw fetchError;
        setArticles(data || []);
      } catch (err) {
        setError(err as Error);
        console.error('Error fetching articles:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchArticles();
  }, [category, limit, publishedOnly, featuredOnly]);

  return { articles, loading, error };
}
