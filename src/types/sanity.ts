export interface SanityImage {
  _type: 'image';
  asset: {
    _ref: string;
    _type: 'reference';
  };
}

export interface Article {
  _id: string;
  _type: 'article';
  title: string;
  slug: {
    current: string;
  };
  excerpt?: string;
  mainImage?: SanityImage;
  author?: {
    name: string;
  };
  publishedAt: string;
  category?: string;
  featured?: boolean;
}
