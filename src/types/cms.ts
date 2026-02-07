export type ArticleCategory =
  | 'News'
  | 'Politics'
  | 'Business'
  | 'Technology'
  | 'Sports'
  | 'Entertainment'
  | 'Analysis'
  | 'Voices'
  | 'Foundations'
  | 'Bookshelf';

export interface Article {
  id: string;
  title: string;
  slug: string;
  body: string;
  excerpt?: string;
  image_url: string | null;
  category: ArticleCategory;
  content_type: string;
  subcategory?: string;
  region?: string;
  published: boolean;
  featured: boolean;
  featured_priority: number;
  scheduled_publish_at?: string | null;
  view_count: number;
  tags: string[];
  meta_title?: string;
  meta_description?: string;
  og_image_url?: string;
  author_name: string;
  created_at: string;
  updated_at: string;
  author_id?: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  usage_count: number;
  created_at: string;
}

export interface MediaItem {
  id: string;
  filename: string;
  storage_path: string;
  file_size: number;
  mime_type: string;
  width?: number;
  height?: number;
  alt_text?: string;
  uploaded_by: string;
  created_at: string;
}

export interface ArticleRevision {
  id: string;
  article_id: string;
  title: string;
  body: string;
  changed_by: string;
  change_summary?: string;
  created_at: string;
}

export interface ArticleView {
  id: string;
  article_id: string;
  viewed_at: string;
  user_agent?: string;
  ip_address?: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: 'admin' | 'editor' | 'contributor';
  granted_by: string;
  granted_at: string;
}

export interface AuthorProfile {
  user_id: string;
  display_name: string;
  bio?: string;
  avatar_url?: string;
  social_twitter?: string;
  social_linkedin?: string;
  updated_at: string;
}

export interface ArticleFormData {
  title: string;
  slug: string;
  body: string;
  excerpt: string;
  image_url: string;
  category: string;
  content_type: string;
  subcategory: string;
  region: string;
  author_name: string;
  published: boolean;
  featured: boolean;
  featured_priority: number;
  scheduled_publish_at: string | null;
  tags: string[];
  meta_title: string;
  meta_description: string;
  og_image_url: string;
}

export interface AnalyticsData {
  totalViews: number;
  totalArticles: number;
  publishedArticles: number;
  draftArticles: number;
  todayViews: number;
  weekViews: number;
  monthViews: number;
  topArticles: Array<{
    id: string;
    title: string;
    view_count: number;
  }>;
  viewsByCategory: Array<{
    category: string;
    count: number;
  }>;
}

export interface SearchFilters {
  query: string;
  category: string;
  tags: string[];
  dateFrom: string | null;
  dateTo: string | null;
  published: boolean | null;
  featured: boolean | null;
  sortBy: 'date' | 'views' | 'title';
  sortOrder: 'asc' | 'desc';
}

export interface ContentType {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color?: string;
  created_at: string;
}

export interface Subcategory {
  id: string;
  name: string;
  slug: string;
  parent_category: string;
  description?: string;
  created_at: string;
}

export interface Region {
  id: string;
  name: string;
  slug: string;
  continent?: string;
  description?: string;
  created_at: string;
}
