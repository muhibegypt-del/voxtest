import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Edit2, Trash2, Plus, X, AlertCircle, CheckCircle } from 'lucide-react';

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

export default function AdminDashboard() {
  const { user } = useAuth();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    body: '',
    image_url: '',
    category: 'News',
    published: false,
  });
  const [validationErrors, setValidationErrors] = useState({
    title: '',
    body: '',
    slug: '',
    image_url: '',
  });
  const [isCheckingSlug, setIsCheckingSlug] = useState(false);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setArticles(data || []);
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors = {
      title: '',
      body: '',
      slug: '',
      image_url: '',
    };
    let isValid = true;

    if (formData.title.length === 0) {
      errors.title = 'Title is required';
      isValid = false;
    } else if (formData.title.length > 150) {
      errors.title = 'Title must be 150 characters or less';
      isValid = false;
    }

    if (formData.body.length < 100) {
      errors.body = `Body must be at least 100 characters (current: ${formData.body.length})`;
      isValid = false;
    }

    if (formData.slug.length === 0) {
      errors.slug = 'Slug is required';
      isValid = false;
    }

    if (formData.image_url && !formData.image_url.match(/^https?:\/\//)) {
      errors.image_url = 'Image URL must start with http:// or https://';
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

  const checkSlugUniqueness = async (slug: string) => {
    if (!slug || slug === editingArticle?.slug) return true;

    setIsCheckingSlug(true);
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('id')
        .eq('slug', slug)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setValidationErrors(prev => ({
          ...prev,
          slug: 'This slug is already in use. Please choose another.',
        }));
        return false;
      }

      setValidationErrors(prev => ({ ...prev, slug: '' }));
      return true;
    } catch (error) {
      console.error('Error checking slug:', error);
      return true;
    } finally {
      setIsCheckingSlug(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const isSlugUnique = await checkSlugUniqueness(formData.slug);
    if (!isSlugUnique) {
      return;
    }

    try {
      const dataToSubmit = {
        ...formData,
        image_url: formData.image_url.trim() || null,
      };

      if (editingArticle) {
        const { error } = await supabase
          .from('articles')
          .update(dataToSubmit)
          .eq('id', editingArticle.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('articles')
          .insert([{ ...dataToSubmit, author_id: user?.id }]);

        if (error) throw error;
      }

      fetchArticles();
      closeModal();
    } catch (error: any) {
      console.error('Error saving article:', error);
      if (error.message?.includes('articles_title_length_check')) {
        alert('Title must be between 1 and 150 characters.');
      } else if (error.message?.includes('articles_body_length_check')) {
        alert('Article body must be at least 100 characters.');
      } else if (error.message?.includes('articles_category_check')) {
        alert('Invalid category selected.');
      } else if (error.message?.includes('duplicate key')) {
        alert('This slug is already in use. Please choose a different title.');
      } else {
        alert('Error saving article. Please check your inputs and try again.');
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return;

    try {
      const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchArticles();
    } catch (error) {
      console.error('Error deleting article:', error);
      alert('Error deleting article. Please try again.');
    }
  };

  const openCreateModal = () => {
    setEditingArticle(null);
    setFormData({
      title: '',
      slug: '',
      body: '',
      image_url: '',
      category: 'News',
      published: false,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (article: Article) => {
    setEditingArticle(article);
    setFormData({
      title: article.title,
      slug: article.slug,
      body: article.body,
      image_url: article.image_url || '',
      category: article.category,
      published: article.published,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingArticle(null);
    setValidationErrors({
      title: '',
      body: '',
      slug: '',
      image_url: '',
    });
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <button
            onClick={openCreateModal}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            <span>New Article</span>
          </button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {articles.map((article) => (
                <tr key={article.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{article.title}</div>
                    <div className="text-sm text-gray-500">{article.slug}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {article.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        article.published
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {article.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(article.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => openEditModal(article)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(article.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {articles.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No articles yet. Create your first article!</p>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 relative">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>

            <h2 className="text-2xl font-bold mb-6">
              {editingArticle ? 'Edit Article' : 'Create New Article'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title <span className="text-red-500">*</span>
                  <span className={`float-right text-xs ${formData.title.length > 150 ? 'text-red-600 font-semibold' : formData.title.length > 130 ? 'text-orange-600' : 'text-gray-500'}`}>
                    {formData.title.length}/150
                  </span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => {
                    const title = e.target.value.slice(0, 150);
                    setFormData({
                      ...formData,
                      title,
                      slug: generateSlug(title),
                    });
                    if (validationErrors.title) {
                      setValidationErrors(prev => ({ ...prev, title: '' }));
                    }
                  }}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    validationErrors.title ? 'border-red-500' : 'border-gray-300'
                  }`}
                  maxLength={150}
                  required
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
                  {isCheckingSlug && <span className="float-right text-xs text-gray-500">Checking...</span>}
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => {
                    setFormData({ ...formData, slug: e.target.value });
                    if (validationErrors.slug) {
                      setValidationErrors(prev => ({ ...prev, slug: '' }));
                    }
                  }}
                  onBlur={() => checkSlugUniqueness(formData.slug)}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    validationErrors.slug ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                />
                {validationErrors.slug && (
                  <div className="flex items-center mt-1 text-sm text-red-600">
                    <AlertCircle size={14} className="mr-1" />
                    {validationErrors.slug}
                  </div>
                )}
                <p className="mt-1 text-xs text-gray-500">URL: /article/{formData.slug || 'your-article-slug'}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="News">News</option>
                  <option value="Politics">Politics</option>
                  <option value="Technology">Technology</option>
                  <option value="Business">Business</option>
                  <option value="Sports">Sports</option>
                  <option value="Entertainment">Entertainment</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL (optional)
                </label>
                <input
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => {
                    setFormData({ ...formData, image_url: e.target.value });
                    if (validationErrors.image_url) {
                      setValidationErrors(prev => ({ ...prev, image_url: '' }));
                    }
                  }}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    validationErrors.image_url ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="https://example.com/image.jpg"
                />
                {validationErrors.image_url && (
                  <div className="flex items-center mt-1 text-sm text-red-600">
                    <AlertCircle size={14} className="mr-1" />
                    {validationErrors.image_url}
                  </div>
                )}
                {formData.image_url && formData.image_url.match(/^https?:\/\//) && (
                  <div className="mt-2">
                    <img
                      src={formData.image_url}
                      alt="Preview"
                      className="w-full h-32 object-cover rounded"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Body <span className="text-red-500">*</span>
                  <span className={`float-right text-xs ${
                    formData.body.length < 100 ? 'text-red-600 font-semibold' :
                    formData.body.length < 120 ? 'text-orange-600' :
                    'text-gray-500'
                  }`}>
                    {formData.body.length} characters {formData.body.length < 100 ? `(${100 - formData.body.length} more needed)` : ''}
                  </span>
                </label>
                <textarea
                  value={formData.body}
                  onChange={(e) => {
                    setFormData({ ...formData, body: e.target.value });
                    if (validationErrors.body) {
                      setValidationErrors(prev => ({ ...prev, body: '' }));
                    }
                  }}
                  rows={10}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    validationErrors.body ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                />
                {validationErrors.body && (
                  <div className="flex items-center mt-1 text-sm text-red-600">
                    <AlertCircle size={14} className="mr-1" />
                    {validationErrors.body}
                  </div>
                )}
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="published"
                  checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="published" className="ml-2 block text-sm text-gray-900">
                  Publish immediately
                </label>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  disabled={isCheckingSlug}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {editingArticle ? 'Update Article' : 'Create Article'}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
