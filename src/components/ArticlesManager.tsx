import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import {
  Edit2,
  Trash2,
  Plus,
  Eye,
  Star,
  Calendar,
  Search,
  Filter,
  Clock
} from 'lucide-react';
import { Article } from '../types/cms';
import ArticleEditor from './ArticleEditor';
import { formatRelativeTime } from '../lib/cms-utils';

interface ArticlesManagerProps {
  sectionId?: string;
  sectionName?: string;
}

export default function ArticlesManager({ sectionId, sectionName }: ArticlesManagerProps) {
  const { user } = useAuth();
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all');
  const [selectedArticles, setSelectedArticles] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchArticles();
  }, [sectionId]);

  useEffect(() => {
    filterArticles();
  }, [articles, searchQuery, filterCategory, filterStatus]);

  const fetchArticles = async () => {
    try {
      if (sectionId) {
        const { data, error } = await supabase
          .from('content_items')
          .select('*')
          .eq('section_id', sectionId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        const mappedData = (data || []).map(item => ({
          id: item.id,
          title: item.title,
          slug: item.slug,
          body: item.body,
          excerpt: item.excerpt,
          image_url: item.featured_image,
          category: sectionName || '',
          published: item.status === 'published',
          created_at: item.created_at,
          updated_at: item.updated_at,
          author_id: item.author_id,
          author_name: item.author_name,
          tags: item.tags || [],
          view_count: item.view_count || 0,
          scheduled_at: item.scheduled_at,
        }));
        setArticles(mappedData);
      } else {
        const { data, error } = await supabase
          .from('articles')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setArticles(data || []);
      }
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterArticles = () => {
    let filtered = articles;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (article) =>
          article.title.toLowerCase().includes(query) ||
          article.body.toLowerCase().includes(query) ||
          article.category.toLowerCase().includes(query)
      );
    }

    if (filterCategory !== 'all') {
      filtered = filtered.filter((article) => article.category === filterCategory);
    }

    if (filterStatus === 'published') {
      filtered = filtered.filter((article) => article.published);
    } else if (filterStatus === 'draft') {
      filtered = filtered.filter((article) => !article.published);
    }

    setFilteredArticles(filtered);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return;

    try {
      const { error } = await supabase.from('articles').delete().eq('id', id);

      if (error) throw error;
      fetchArticles();
      selectedArticles.delete(id);
      setSelectedArticles(new Set(selectedArticles));
    } catch (error) {
      console.error('Error deleting article:', error);
      alert('Error deleting article. Please try again.');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedArticles.size === 0) return;
    if (!confirm(`Delete ${selectedArticles.size} selected articles?`)) return;

    try {
      const { error } = await supabase
        .from('articles')
        .delete()
        .in('id', Array.from(selectedArticles));

      if (error) throw error;
      fetchArticles();
      setSelectedArticles(new Set());
    } catch (error) {
      console.error('Error deleting articles:', error);
      alert('Error deleting articles. Please try again.');
    }
  };

  const handleBulkPublish = async (published: boolean) => {
    if (selectedArticles.size === 0) return;

    try {
      const { error } = await supabase
        .from('articles')
        .update({ published })
        .in('id', Array.from(selectedArticles));

      if (error) throw error;
      fetchArticles();
      setSelectedArticles(new Set());
    } catch (error) {
      console.error('Error updating articles:', error);
      alert('Error updating articles. Please try again.');
    }
  };

  const toggleSelectAll = () => {
    if (selectedArticles.size === filteredArticles.length) {
      setSelectedArticles(new Set());
    } else {
      setSelectedArticles(new Set(filteredArticles.map((a) => a.id)));
    }
  };

  const toggleSelectArticle = (id: string) => {
    const newSelected = new Set(selectedArticles);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedArticles(newSelected);
  };

  const openCreateEditor = () => {
    setEditingArticle(null);
    setIsEditorOpen(true);
  };

  const openEditEditor = (article: Article) => {
    setEditingArticle(article);
    setIsEditorOpen(true);
  };

  const closeEditor = () => {
    setIsEditorOpen(false);
    setEditingArticle(null);
    fetchArticles();
  };

  const categories = ['News', 'Politics', 'Technology', 'Business', 'Sports', 'Entertainment'];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading articles...</p>
        </div>
      </div>
    );
  }

  if (isEditorOpen) {
    return <ArticleEditor article={editingArticle} onClose={closeEditor} sectionId={sectionId} sectionName={sectionName} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Articles</h2>
          <p className="text-sm text-gray-600 mt-1">
            {filteredArticles.length} of {articles.length} articles
          </p>
        </div>
        <button
          onClick={openCreateEditor}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          <span>New Article</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Drafts</option>
          </select>
        </div>

        {selectedArticles.size > 0 && (
          <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-3">
            <span className="text-sm text-blue-900 font-medium">
              {selectedArticles.size} article{selectedArticles.size !== 1 ? 's' : ''} selected
            </span>
            <div className="flex space-x-2">
              <button
                onClick={() => handleBulkPublish(true)}
                className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
              >
                Publish
              </button>
              <button
                onClick={() => handleBulkPublish(false)}
                className="px-3 py-1 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700 transition-colors"
              >
                Unpublish
              </button>
              <button
                onClick={handleBulkDelete}
                className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedArticles.size === filteredArticles.length && filteredArticles.length > 0}
                  onChange={toggleSelectAll}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </th>
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
                Views
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
            {filteredArticles.map((article) => (
              <tr key={article.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedArticles.has(article.id)}
                    onChange={() => toggleSelectArticle(article.id)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-start space-x-2">
                    {article.featured && (
                      <Star size={16} className="text-yellow-500 mt-1 flex-shrink-0" />
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-gray-900 truncate">
                        {article.title}
                      </div>
                      <div className="text-sm text-gray-500 truncate">{article.slug}</div>
                      {article.scheduled_publish_at && !article.published && (
                        <div className="flex items-center space-x-1 text-xs text-orange-600 mt-1">
                          <Clock size={12} />
                          <span>Scheduled: {formatRelativeTime(article.scheduled_publish_at)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {article.category}
                    </span>
                    {article.content_type && article.content_type !== 'News' && (
                      <div className="text-xs text-gray-500">
                        {article.content_type}
                      </div>
                    )}
                    {article.author_name && article.author_name !== 'Staff Writer' && (
                      <div className="text-xs text-gray-600">
                        By {article.author_name}
                      </div>
                    )}
                  </div>
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
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-1 text-sm text-gray-600">
                    <Eye size={14} />
                    <span>{article.view_count || 0}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatRelativeTime(article.created_at)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => openEditEditor(article)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                    title="Edit"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(article.id)}
                    className="text-red-600 hover:text-red-900"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredArticles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">
              {searchQuery || filterCategory !== 'all' || filterStatus !== 'all'
                ? 'No articles match your filters'
                : 'No articles yet. Create your first article!'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
