# Sanity CMS Setup Guide

This project is integrated with Sanity CMS for content management.

## Environment Variables

Add your Sanity credentials to `.env`:

```env
VITE_SANITY_PROJECT_ID=your_sanity_project_id
VITE_SANITY_DATASET=production
```

## Sanity Schema

Create the following schema in your Sanity Studio:

### Article Schema

```javascript
export default {
  name: 'article',
  title: 'Article',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3
    },
    {
      name: 'mainImage',
      title: 'Main Image',
      type: 'image',
      options: {
        hotspot: true
      }
    },
    {
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{type: 'author'}]
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          {title: 'News', value: 'news'},
          {title: 'Analysis', value: 'analysis'},
          {title: 'Video', value: 'video'}
        ]
      }
    },
    {
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      description: 'Featured articles appear in the hero section'
    },
    {
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
      validation: Rule => Rule.required()
    }
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      media: 'mainImage'
    }
  }
}
```

### Author Schema

```javascript
export default {
  name: 'author',
  title: 'Author',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96
      }
    },
    {
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true
      }
    },
    {
      name: 'bio',
      title: 'Bio',
      type: 'text',
      rows: 3
    }
  ],
  preview: {
    select: {
      title: 'name',
      media: 'image'
    }
  }
}
```

## Features

- **Hero Section**: Displays 2 featured articles
- **Latest Stories**: Shows 4 most recent non-featured articles
- **Category Sections**: Displays articles by category (News and Video)
- **Graceful Fallback**: Shows placeholder content when Sanity is not configured
- **Loading States**: Smooth loading animations while fetching data
- **Image Optimization**: Automatic image resizing via Sanity CDN

## Getting Started

1. Create a Sanity project at https://sanity.io
2. Set up the schemas in your Sanity Studio
3. Add your project ID to `.env`
4. Add some content in Sanity Studio
5. The site will automatically fetch and display your content

## Placeholder Content

The site includes placeholder content that displays when:
- Sanity is not configured
- No articles are published
- While content is loading

This ensures the site is always functional and visually complete.
