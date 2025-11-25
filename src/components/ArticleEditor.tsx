import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import {
  X,
  Save,
  Eye,
  Calendar,
  Star,
  FileText,
  Search as SearchIcon,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { Article, ArticleFormData } from '../types/cms';
import {
  generateSlug,
  checkSlugUniqueness,
  validateArticleForm,
  generateExcerpt,
  categories,
  contentTypes,
  fetchSubcategories,
  fetchAllRegions,
  linkArticleToTags
} from '../lib/cms-utils';
import { Subcategory, Region } from '../types/cms';
import RichTextEditor from './RichTextEditor';
import TagInput from './TagInput';
import SEOPanel from './SEOPanel';

interface ArticleEditorProps {
  article: Article | null;
  onClose: () => void;
  sectionId?: string;
  sectionName?: string;
}

export default function ArticleEditor({ article, onClose, sectionId, sectionName }: ArticleEditorProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'content' | 'seo' | 'settings'>('content');
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [formData, setFormData] = useState<ArticleFormData>({
    title: '',
    slug: '',
    body: '',
    excerpt: '',
    image_url: '',
    category: 'News',
    content_type: 'News',
    subcategory: '',
    region: '',
    author_name: 'Staff Writer',
    published: false,
    featured: false,
    featured_priority: 0,
    scheduled_publish_at: null,
    tags: [],
    meta_title: '',
    meta_description: '',
    og_image_url: '',
  });
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isCheckingSlug, setIsCheckingSlug] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);

  useEffect(() => {
    const loadRegions = async () => {
      const data = await fetchAllRegions();
      setRegions(data);
    };
    loadRegions();
  }, []);

  useEffect(() => {
    const loadSubcategories = async () => {
      if (formData.category) {
        const data = await fetchSubcategories(formData.category);
        setSubcategories(data);
      }
    };
    loadSubcategories();
  }, [formData.category]);

  useEffect(() => {
    if (article) {
      setFormData({
        title: article.title,
        slug: article.slug,
        body: article.body,
        excerpt: article.excerpt || '',
        image_url: article.image_url || '',
        category: article.category,
        content_type: article.content_type || 'News',
        subcategory: article.subcategory || '',
        region: article.region || '',
        author_name: article.author_name || 'Staff Writer',
        published: article.published,
        featured: article.featured || false,
        featured_priority: article.featured_priority || 0,
        scheduled_publish_at: article.scheduled_publish_at || null,
        tags: article.tags || [],
        meta_title: article.meta_title || '',
        meta_description: article.meta_description || '',
        og_image_url: article.og_image_url || '',
      });
    }
  }, [article]);

  useEffect(() => {
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    if (article && formData.title && formData.body) {
      setAutoSaveStatus('unsaved');
      autoSaveTimerRef.current = setTimeout(() => {
        handleAutoSave();
      }, 30000);
    }

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [formData]);

  const handleAutoSave = async () => {
    if (!article || !user) return;

    setAutoSaveStatus('saving');
    try {
      const dataToSave = {
        ...formData,
        image_url: formData.image_url.trim() || null,
        og_image_url: formData.og_image_url.trim() || null,
        excerpt: formData.excerpt || generateExcerpt(formData.body),
      };

      await supabase
        .from('articles')
        .update(dataToSave)
        .eq('id', article.id);

      setAutoSaveStatus('saved');
    } catch (error) {
      console.error('Auto-save error:', error);
      setAutoSaveStatus('unsaved');
    }
  };

  const handleTitleChange = (title: string) => {
    setFormData({
      ...formData,
      title,
      slug: generateSlug(title),
    });
    setValidationErrors({ ...validationErrors, title: '' });
  };

  const handleSlugBlur = async () => {
    if (formData.slug) {
      const isUnique = await checkSlugUniqueness(formData.slug, article?.id);
      if (!isUnique) {
        setValidationErrors({
          ...validationErrors,
          slug: 'This slug is already in use. Please choose another.',
        });
      } else {
        setValidationErrors({ ...validationErrors, slug: '' });
      }
    }
  };

  const handleSubmit = async (publishNow: boolean = false) => {
    const validation = validateArticleForm(formData);
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      return;
    }

    const isSlugUnique = await checkSlugUniqueness(formData.slug, article?.id);
    if (!isSlugUnique) {
      setValidationErrors({
        ...validationErrors,
        slug: 'This slug is already in use. Please choose another.',
      });
      return;
    }

    setSaving(true);
    try {
      if (sectionId) {
        const contentItemData = {
          section_id: sectionId,
          title: formData.title,
          slug: formData.slug,
          body: formData.body,
          excerpt: formData.excerpt || generateExcerpt(formData.body),
          author_id: user?.id,
          author_name: user?.email?.split('@')[0] || 'Staff Writer',
          status: publishNow ? 'published' : (formData.published ? 'published' : 'draft'),
          featured_image: formData.image_url.trim() || null,
          tags: formData.tags,
          metadata: {
            content_type: formData.content_type,
            region: formData.region,
            subcategory: formData.subcategory,
            meta_title: formData.meta_title,
            meta_description: formData.meta_description,
            og_image_url: formData.og_image_url,
            featured: formData.featured,
          },
          published_at: publishNow ? new Date().toISOString() : null,
        };

        if (article) {
          const { error } = await supabase
            .from('content_items')
            .update(contentItemData)
            .eq('id', article.id);

          if (error) throw error;
        } else {
          const { error } = await supabase
            .from('content_items')
            .insert([contentItemData]);

          if (error) throw error;
        }
      } else {
        const dataToSubmit = {
          ...formData,
          published: publishNow ? true : formData.published,
          image_url: formData.image_url.trim() || null,
          og_image_url: formData.og_image_url.trim() || null,
          excerpt: formData.excerpt || generateExcerpt(formData.body),
        };

        let articleId = article?.id;

        if (article) {
          const { error } = await supabase
            .from('articles')
            .update(dataToSubmit)
            .eq('id', article.id);

          if (error) throw error;
        } else {
          const { data, error } = await supabase
            .from('articles')
            .insert([{ ...dataToSubmit, author_id: user?.id }])
            .select()
            .single();

          if (error) throw error;
          articleId = data.id;
        }

        if (articleId && formData.tags.length > 0) {
          await linkArticleToTags(articleId, formData.tags);
        }
      }

      onClose();
    } catch (error: any) {
      console.error('Error saving article:', error);
      alert('Error saving article. Please check your inputs and try again.');
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'content' as const, name: 'Content', icon: <FileText size={18} /> },
    { id: 'seo' as const, name: 'SEO', icon: <SearchIcon size={18} /> },
    { id: 'settings' as const, name: 'Settings', icon: <Calendar size={18} /> },
  ];

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 z-50 overflow-y-auto">
      <div className="min-h-screen p-4">
        <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-xl">
          <div className="sticky top-0 bg-white border-b border-gray-200 rounded-t-lg z-10">
            <div className="flex items-center justify-between p-4">
              <h2 className="text-2xl font-bold text-gray-900">
                {article ? 'Edit Article' : 'Create New Article'}
              </h2>
              <div className="flex items-center space-x-3">
                {article && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    {autoSaveStatus === 'saving' && (
                      <>
                        <Clock size={14} className="animate-spin" />
                        <span>Saving...</span>
                      </>
                    )}
                    {autoSaveStatus === 'saved' && (
                      <>
                        <CheckCircle size={14} className="text-green-600" />
                        <span className="text-green-600">Saved</span>
                      </>
                    )}
                    {autoSaveStatus === 'unsaved' && (
                      <>
                        <AlertCircle size={14} className="text-orange-600" />
                        <span className="text-orange-600">Unsaved changes</span>
                      </>
                    )}
                  </div>
                )}
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Eye size={18} />
                  <span>{showPreview ? 'Edit' : 'Preview'}</span>
                </button>
                <button
                  onClick={() => handleSubmit(false)}
                  disabled={saving}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                >
                  <Save size={18} />
                  <span>{saving ? 'Saving...' : 'Save Draft'}</span>
                </button>
                <button
                  onClick={() => handleSubmit(true)}
                  disabled={saving}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400"
                >
                  <CheckCircle size={18} />
                  <span>Publish</span>
                </button>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            {!showPreview && (
              <div className="flex space-x-1 px-4">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-4 py-2 font-medium text-sm transition-colors border-b-2 ${
                      activeTab === tab.id
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="p-6">
            {showPreview ? (
              <div className="prose prose-lg max-w-none">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">{formData.title || 'Untitled Article'}</h1>
                {formData.image_url && (
                  <img
                    src={formData.image_url}
                    alt={formData.title}
                    className="w-full h-96 object-cover rounded-lg mb-6"
                  />
                )}
                {formData.excerpt && (
                  <p className="text-xl text-gray-600 mb-6 italic">{formData.excerpt}</p>
                )}
                <div className="whitespace-pre-wrap">{formData.body}</div>
                {formData.tags.length > 0 && (
                  <div className="mt-8 flex flex-wrap gap-2">
                    {formData.tags.map((tag) => (
                      <span key={tag} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <>
                {activeTab === 'content' && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Title <span className="text-red-500">*</span>
                        <span className={`float-right text-xs ${formData.title.length > 150 ? 'text-red-600 font-semibold' : 'text-gray-500'}`}>
                          {formData.title.length}/150
                        </span>
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => handleTitleChange(e.target.value.slice(0, 150))}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          validationErrors.title ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter article title"
                        maxLength={150}
                      />
                      {validationErrors.title && (
                        <div className="flex items-center mt-1 text-sm text-red-600">
                          <AlertCircle size={14} className="mr-1" />
                          {validationErrors.title}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Slug <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        onBlur={handleSlugBlur}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          validationErrors.slug ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="article-url-slug"
                      />
                      {validationErrors.slug && (
                        <div className="flex items-center mt-1 text-sm text-red-600">
                          <AlertCircle size={14} className="mr-1" />
                          {validationErrors.slug}
                        </div>
                      )}
                      <p className="mt-1 text-xs text-gray-500">
                        URL: /article/{formData.slug || 'your-slug'}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Category <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value, subcategory: '' })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          {categories.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Subcategory
                        </label>
                        <select
                          value={formData.subcategory}
                          onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          disabled={subcategories.length === 0}
                        >
                          <option value="">None</option>
                          {subcategories.map((sub) => (
                            <option key={sub.id} value={sub.slug}>
                              {sub.name}
                            </option>
                          ))}
                        </select>
                        <p className="mt-1 text-xs text-gray-500">
                          {subcategories.length === 0 ? 'No subcategories available' : 'Optional refinement'}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Content Type <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={formData.content_type}
                          onChange={(e) => setFormData({ ...formData, content_type: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          {contentTypes.map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                        <p className="mt-1 text-xs text-gray-500">
                          Format: News, Opinion, Analysis, etc.
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Geographic Region
                        </label>
                        <select
                          value={formData.region}
                          onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">None / Global</option>
                          {regions.map((region) => (
                            <option key={region.id} value={region.slug}>
                              {region.name} {region.continent && `(${region.continent})`}
                            </option>
                          ))}
                        </select>
                        <p className="mt-1 text-xs text-gray-500">
                          Optional location-based tagging
                        </p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Author Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.author_name}
                        onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Staff Writer"
                        required
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Writer's display name for article byline
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Featured Image URL
                      </label>
                      <input
                        type="url"
                        value={formData.image_url}
                        onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="https://example.com/image.jpg"
                      />
                      {formData.image_url && formData.image_url.match(/^https?:\/\//) && (
                        <img
                          src={formData.image_url}
                          alt="Preview"
                          className="mt-3 w-full h-48 object-cover rounded"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Excerpt (Optional)
                        <span className="float-right text-xs text-gray-500">
                          {formData.excerpt.length}/200
                        </span>
                      </label>
                      <textarea
                        value={formData.excerpt}
                        onChange={(e) => setFormData({ ...formData, excerpt: e.target.value.slice(0, 200) })}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Brief summary for article listings (auto-generated if empty)"
                        maxLength={200}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Content <span className="text-red-500">*</span>
                        <span className={`float-right text-xs ${formData.body.length < 100 ? 'text-red-600 font-semibold' : 'text-gray-500'}`}>
                          {formData.body.length} characters {formData.body.length < 100 ? `(${100 - formData.body.length} more needed)` : ''}
                        </span>
                      </label>
                      <RichTextEditor
                        value={formData.body}
                        onChange={(value) => setFormData({ ...formData, body: value })}
                        placeholder="Write your article content here..."
                      />
                      {validationErrors.body && (
                        <div className="flex items-center mt-1 text-sm text-red-600">
                          <AlertCircle size={14} className="mr-1" />
                          {validationErrors.body}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tags
                      </label>
                      <TagInput
                        selectedTags={formData.tags}
                        onChange={(tags) => setFormData({ ...formData, tags })}
                      />
                    </div>
                  </div>
                )}

                {activeTab === 'seo' && (
                  <SEOPanel
                    metaTitle={formData.meta_title}
                    metaDescription={formData.meta_description}
                    ogImageUrl={formData.og_image_url}
                    articleTitle={formData.title}
                    excerpt={formData.excerpt || generateExcerpt(formData.body)}
                    onMetaTitleChange={(value) => setFormData({ ...formData, meta_title: value })}
                    onMetaDescriptionChange={(value) => setFormData({ ...formData, meta_description: value })}
                    onOgImageUrlChange={(value) => setFormData({ ...formData, og_image_url: value })}
                  />
                )}

                {activeTab === 'settings' && (
                  <div className="space-y-6">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="featured"
                        checked={formData.featured}
                        onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="featured" className="flex items-center space-x-2 text-sm font-medium text-gray-900">
                        <Star size={16} className="text-yellow-500" />
                        <span>Mark as featured article</span>
                      </label>
                    </div>

                    {formData.featured && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Featured Priority
                        </label>
                        <input
                          type="number"
                          value={formData.featured_priority}
                          onChange={(e) => setFormData({ ...formData, featured_priority: parseInt(e.target.value) || 0 })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          min="0"
                          max="100"
                        />
                        <p className="mt-1 text-xs text-gray-500">
                          Higher numbers appear first (0-100)
                        </p>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Schedule Publication
                      </label>
                      <input
                        type="datetime-local"
                        value={formData.scheduled_publish_at || ''}
                        onChange={(e) => setFormData({ ...formData, scheduled_publish_at: e.target.value || null })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Leave empty for immediate publication
                      </p>
                    </div>

                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">
                        Publishing Settings
                      </h4>
                      <ul className="text-xs text-gray-600 space-y-1">
                        <li>Featured articles appear prominently on the homepage</li>
                        <li>Scheduled articles publish automatically at the specified time</li>
                        <li>Draft articles are visible only to authenticated users</li>
                      </ul>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
