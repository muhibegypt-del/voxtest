import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import {
  BarChart3,
  Users,
  Image as ImageIcon,
  ShoppingBag,
  BookOpen,
  Archive,
  Book,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  Upload,
  History,
  Calendar,
  Tag as TagIcon,
  ArrowLeft,
  FileText,
} from 'lucide-react';
import RichTextEditor from '../components/RichTextEditor';
import TagInput from '../components/TagInput';

type ViewState = 'SECTION_OVERVIEW' | 'EDITOR' | 'MEDIA_HUB' | 'SETTINGS';

interface ContentSection {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  sort_order: number;
  enabled: boolean;
}

interface ContentItem {
  id: string;
  section_id: string;
  title: string;
  slug: string;
  body: string;
  excerpt: string | null;
  author_id: string;
  author_name: string;
  status: 'draft' | 'published' | 'archived';
  featured_image: string | null;
  images: any;
  metadata: any;
  tags: string[];
  published_at: string | null;
  scheduled_at: string | null;
  view_count: number;
  created_at: string;
  updated_at: string;
}

interface MediaItem {
  id: string;
  filename: string;
  storage_path: string;
  file_size: number;
  mime_type: string;
  width: number | null;
  height: number | null;
  alt_text: string | null;
  uploaded_by: string;
  created_at: string;
}

interface Revision {
  id: string;
  article_id: string;
  title: string;
  body: string;
  changed_by: string;
  change_summary: string | null;
  created_at: string;
}

const iconMap: Record<string, any> = {
  BarChart3,
  Users,
  Image: ImageIcon,
  ShoppingBag,
  BookOpen,
  Archive,
  Book,
};

export default function AdminDashboard() {
  const { user } = useAuth();
  const [viewState, setViewState] = useState<ViewState>('SECTION_OVERVIEW');
  const [sections, setSections] = useState<ContentSection[]>([]);
  const [sectionItems, setSectionItems] = useState<Record<string, ContentItem[]>>({});
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<ContentItem | null>(null);
  const [currentSection, setCurrentSection] = useState<ContentSection | null>(null);
  const [quickDraftInputs, setQuickDraftInputs] = useState<Record<string, string>>({});
  const [revisions, setRevisions] = useState<Revision[]>([]);
  const [showRevisions, setShowRevisions] = useState(false);

  const [editorData, setEditorData] = useState({
    title: '',
    slug: '',
    body: '',
    excerpt: '',
    featured_image: '',
    tags: [] as string[],
    scheduled_at: null as string | null,
    metadata: {} as any,
  });

  const [showPreview, setShowPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [preflightIssues, setPreflightIssues] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      fetchSections();
      fetchMediaItems();
    }
  }, [user]);

  const fetchSections = async () => {
    try {
      setLoading(true);
      const { data: sectionsData, error } = await supabase
        .from('content_sections')
        .select('*')
        .eq('enabled', true)
        .order('sort_order');

      if (error) throw error;

      setSections(sectionsData || []);

      const itemsMap: Record<string, ContentItem[]> = {};
      for (const section of sectionsData || []) {
        const { data: items } = await supabase
          .from('content_items')
          .select('*')
          .eq('section_id', section.id)
          .order('updated_at', { ascending: false })
          .limit(5);

        itemsMap[section.id] = items || [];
      }

      setSectionItems(itemsMap);
    } catch (error) {
      console.error('Error fetching sections:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMediaItems = async () => {
    try {
      const { data, error } = await supabase
        .from('media_library')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMediaItems(data || []);
    } catch (error) {
      console.error('Error fetching media:', error);
    }
  };

  const handleQuickDraft = async (sectionId: string) => {
    const title = quickDraftInputs[sectionId]?.trim();
    if (!title || !user) return;

    try {
      const slug = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`;

      const { error } = await supabase.from('content_items').insert({
        section_id: sectionId,
        title,
        slug,
        body: '',
        author_id: user.id,
        author_name: user.email?.split('@')[0] || 'Staff Writer',
        status: 'draft',
      });

      if (error) throw error;

      setQuickDraftInputs({ ...quickDraftInputs, [sectionId]: '' });
      fetchSections();
    } catch (error) {
      console.error('Error creating quick draft:', error);
    }
  };

  const openEditor = (item: ContentItem | null, section: ContentSection) => {
    if (item) {
      setEditingItem(item);
      setEditorData({
        title: item.title,
        slug: item.slug,
        body: item.body,
        excerpt: item.excerpt || '',
        featured_image: item.featured_image || '',
        tags: item.tags || [],
        scheduled_at: item.scheduled_at,
        metadata: item.metadata || {},
      });
      fetchRevisions(item.id);
    } else {
      setEditingItem(null);
      setEditorData({
        title: '',
        slug: '',
        body: '',
        excerpt: '',
        featured_image: '',
        tags: [],
        scheduled_at: null,
        metadata: {},
      });
    }
    setCurrentSection(section);
    setViewState('EDITOR');
    setShowPreview(false);
    setPreflightIssues([]);
  };

  const fetchRevisions = async (itemId: string) => {
    try {
      const { data, error } = await supabase
        .from('article_revisions')
        .select('*')
        .eq('article_id', itemId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRevisions(data || []);
    } catch (error) {
      console.error('Error fetching revisions:', error);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const runPreflightChecks = () => {
    const issues: string[] = [];

    if (!editorData.title.trim()) {
      issues.push('Title is required');
    }

    if (!editorData.body.trim()) {
      issues.push('Content body is required');
    }

    if (!editorData.featured_image) {
      issues.push('Featured image is missing - this will affect social media shares');
    }

    if (!editorData.excerpt && editorData.body.length > 200) {
      issues.push('Consider adding an excerpt for better SEO and listings');
    }

    if (editorData.tags.length === 0) {
      issues.push('No tags added - tags help with content discovery');
    }

    setPreflightIssues(issues);
    return issues.length === 0;
  };

  const handleSave = async (publishNow: boolean = false) => {
    if (!user || !currentSection) return;

    if (publishNow && !runPreflightChecks()) {
      alert('Please address pre-flight issues before publishing');
      return;
    }

    try {
      setSaving(true);

      const slug = editorData.slug || generateSlug(editorData.title);
      const itemData: any = {
        section_id: currentSection.id,
        title: editorData.title,
        slug: editingItem ? editorData.slug : `${slug}-${Date.now()}`,
        body: editorData.body,
        excerpt: editorData.excerpt || editorData.body.substring(0, 200),
        author_id: user.id,
        author_name: user.email?.split('@')[0] || 'Staff Writer',
        status: publishNow ? 'published' : 'draft',
        featured_image: editorData.featured_image || null,
        tags: editorData.tags,
        scheduled_at: editorData.scheduled_at,
        metadata: editorData.metadata,
      };

      if (publishNow && !editingItem) {
        itemData.published_at = new Date().toISOString();
      }

      if (editingItem) {
        const { error } = await supabase
          .from('content_items')
          .update(itemData)
          .eq('id', editingItem.id);

        if (error) throw error;
      } else {
        const { error } = await supabase.from('content_items').insert(itemData);

        if (error) throw error;
      }

      fetchSections();
      setViewState('SECTION_OVERVIEW');
      setEditingItem(null);
      setCurrentSection(null);
    } catch (error: any) {
      console.error('Error saving content:', error);
      alert(error.message || 'Failed to save content');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (itemId: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      const { error } = await supabase.from('content_items').delete().eq('id', itemId);

      if (error) throw error;
      fetchSections();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const restoreRevision = (revision: Revision) => {
    setEditorData({
      ...editorData,
      title: revision.title,
      body: revision.body,
    });
    setShowRevisions(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'published':
        return '🟢';
      case 'draft':
        return '🟡';
      case 'archived':
        return '🔴';
      default:
        return '⚪';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Please log in to access the CMS</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {viewState === 'SECTION_OVERVIEW' && (
        <SectionOverviewDashboard
          sections={sections}
          sectionItems={sectionItems}
          quickDraftInputs={quickDraftInputs}
          setQuickDraftInputs={setQuickDraftInputs}
          handleQuickDraft={handleQuickDraft}
          openEditor={openEditor}
          handleDelete={handleDelete}
          setViewState={setViewState}
          getStatusIcon={getStatusIcon}
          getStatusColor={getStatusColor}
          formatDate={formatDate}
          loading={loading}
        />
      )}

      {viewState === 'EDITOR' && currentSection && (
        <EditorView
          editorData={editorData}
          setEditorData={setEditorData}
          showPreview={showPreview}
          setShowPreview={setShowPreview}
          handleSave={handleSave}
          saving={saving}
          editingItem={editingItem}
          currentSection={currentSection}
          setViewState={setViewState}
          preflightIssues={preflightIssues}
          runPreflightChecks={runPreflightChecks}
          revisions={revisions}
          showRevisions={showRevisions}
          setShowRevisions={setShowRevisions}
          restoreRevision={restoreRevision}
          mediaItems={mediaItems}
        />
      )}

      {viewState === 'MEDIA_HUB' && (
        <MediaHubView
          mediaItems={mediaItems}
          setViewState={setViewState}
          fetchMediaItems={fetchMediaItems}
          user={user}
        />
      )}

      {viewState === 'SETTINGS' && (
        <SettingsView setViewState={setViewState} />
      )}
    </div>
  );
}

interface SectionOverviewDashboardProps {
  sections: ContentSection[];
  sectionItems: Record<string, ContentItem[]>;
  quickDraftInputs: Record<string, string>;
  setQuickDraftInputs: (inputs: Record<string, string>) => void;
  handleQuickDraft: (sectionId: string) => void;
  openEditor: (item: ContentItem | null, section: ContentSection) => void;
  handleDelete: (itemId: string) => void;
  setViewState: (view: ViewState) => void;
  getStatusIcon: (status: string) => string;
  getStatusColor: (status: string) => string;
  formatDate: (date: string) => string;
  loading: boolean;
}

function SectionOverviewDashboard({
  sections,
  sectionItems,
  quickDraftInputs,
  setQuickDraftInputs,
  handleQuickDraft,
  openEditor,
  handleDelete,
  setViewState,
  getStatusIcon,
  getStatusColor,
  formatDate,
  loading,
}: SectionOverviewDashboardProps) {
  return (
    <>
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Mission Control</h1>
              <p className="text-gray-600 mt-1">The Newsroom Floor</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setViewState('MEDIA_HUB')}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <ImageIcon size={18} />
                <span>Media Hub</span>
              </button>
              <button
                onClick={() => setViewState('SETTINGS')}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <FileText size={18} />
                <span>Settings</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sections.map((section) => {
              const Icon = iconMap[section.icon] || FileText;
              const items = sectionItems[section.id] || [];

              return (
                <div key={section.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                    <div className="flex items-center space-x-3">
                      <Icon className="text-blue-600" size={24} />
                      <div>
                        <h3 className="font-bold text-gray-900">{section.name}</h3>
                        <p className="text-xs text-gray-600">{items.length} items</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-3">
                    <div className="mb-3">
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          placeholder="Quick draft..."
                          value={quickDraftInputs[section.id] || ''}
                          onChange={(e) =>
                            setQuickDraftInputs({
                              ...quickDraftInputs,
                              [section.id]: e.target.value,
                            })
                          }
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              handleQuickDraft(section.id);
                            }
                          }}
                          className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        />
                        <button
                          onClick={() => handleQuickDraft(section.id)}
                          className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {items.map((item) => (
                        <div
                          key={item.id}
                          className="p-3 border border-gray-200 rounded-lg hover:border-blue-600 transition-all group"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-1">
                                <span className="text-lg">{getStatusIcon(item.status)}</span>
                                <span
                                  className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(
                                    item.status
                                  )}`}
                                >
                                  {item.status}
                                </span>
                              </div>
                              <h4 className="font-semibold text-sm text-gray-900 truncate">
                                {item.title}
                              </h4>
                              <p className="text-xs text-gray-500 mt-1">
                                {formatDate(item.updated_at)}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => openEditor(item, section)}
                              className="flex-1 text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors"
                            >
                              <Edit size={12} className="inline mr-1" />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="text-xs px-2 py-1 bg-red-50 text-red-700 rounded hover:bg-red-100 transition-colors"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                      ))}

                      {items.length === 0 && (
                        <div className="text-center py-8 text-gray-400">
                          <FileText size={32} className="mx-auto mb-2 opacity-50" />
                          <p className="text-sm">No content yet</p>
                        </div>
                      )}

                      <button
                        onClick={() => openEditor(null, section)}
                        className="w-full py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-dashed border-blue-300"
                      >
                        + New Article
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}

interface EditorViewProps {
  editorData: any;
  setEditorData: (data: any) => void;
  showPreview: boolean;
  setShowPreview: (show: boolean) => void;
  handleSave: (publishNow: boolean) => void;
  saving: boolean;
  editingItem: ContentItem | null;
  currentSection: ContentSection;
  setViewState: (view: ViewState) => void;
  preflightIssues: string[];
  runPreflightChecks: () => boolean;
  revisions: Revision[];
  showRevisions: boolean;
  setShowRevisions: (show: boolean) => void;
  restoreRevision: (revision: Revision) => void;
  mediaItems: MediaItem[];
}

function EditorView({
  editorData,
  setEditorData,
  showPreview,
  setShowPreview,
  handleSave,
  saving,
  editingItem,
  currentSection,
  setViewState,
  preflightIssues,
  runPreflightChecks,
  revisions,
  showRevisions,
  setShowRevisions,
  restoreRevision,
}: EditorViewProps) {
  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setViewState('SECTION_OVERVIEW')}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft size={24} />
            </button>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {editingItem ? 'Edit' : 'New'} - {currentSection.name}
              </h2>
              <p className="text-sm text-gray-600">
                {editingItem ? `Last saved: ${new Date(editingItem.updated_at).toLocaleString()}` : 'Not saved yet'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {editingItem && revisions.length > 0 && (
              <button
                onClick={() => setShowRevisions(!showRevisions)}
                className="inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <History size={18} />
                <span>Revisions ({revisions.length})</span>
              </button>
            )}
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Eye size={18} />
              <span>{showPreview ? 'Edit' : 'Preview'}</span>
            </button>
            <button
              onClick={() => handleSave(false)}
              disabled={saving}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
            >
              <Save size={18} />
              <span>{saving ? 'Saving...' : 'Save Draft'}</span>
            </button>
            <button
              onClick={() => {
                runPreflightChecks();
                if (preflightIssues.length === 0) {
                  handleSave(true);
                }
              }}
              disabled={saving}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              <CheckCircle size={18} />
              <span>Publish</span>
            </button>
          </div>
        </div>

        {preflightIssues.length > 0 && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <AlertCircle className="text-yellow-600 flex-shrink-0" size={20} />
              <div className="flex-1">
                <h4 className="font-semibold text-yellow-900 mb-2">Pre-Flight Issues</h4>
                <ul className="text-sm text-yellow-800 space-y-1">
                  {preflightIssues.map((issue, idx) => (
                    <li key={idx}>• {issue}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {showRevisions && (
        <div className="absolute right-6 top-20 w-80 bg-white border border-gray-300 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-bold text-gray-900">Revision History</h3>
          </div>
          <div className="p-2">
            {revisions.map((revision) => (
              <div
                key={revision.id}
                className="p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
                onClick={() => restoreRevision(revision)}
              >
                <div className="font-medium text-sm text-gray-900">{revision.title}</div>
                <div className="text-xs text-gray-600 mt-1">
                  {new Date(revision.created_at).toLocaleString()}
                </div>
                {revision.change_summary && (
                  <div className="text-xs text-gray-500 mt-1">{revision.change_summary}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex-1 overflow-hidden">
        {showPreview ? (
          <div className="h-full overflow-y-auto p-8 bg-gray-50">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
              {editorData.featured_image && (
                <img
                  src={editorData.featured_image}
                  alt={editorData.title}
                  className="w-full h-64 object-cover rounded-lg mb-6"
                />
              )}
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{editorData.title || 'Untitled'}</h1>
              {editorData.excerpt && (
                <p className="text-xl text-gray-600 mb-6">{editorData.excerpt}</p>
              )}
              <div className="prose prose-lg max-w-none">
                <div dangerouslySetInnerHTML={{ __html: editorData.body }} />
              </div>
              {editorData.tags.length > 0 && (
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <div className="flex flex-wrap gap-2">
                    {editorData.tags.map((tag: string) => (
                      <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="h-full overflow-y-auto p-6">
            <div className="max-w-5xl mx-auto space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={editorData.title}
                  onChange={(e) => setEditorData({ ...editorData, title: e.target.value })}
                  placeholder="Enter article title"
                  className="w-full px-4 py-3 text-2xl font-bold border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Excerpt</label>
                <textarea
                  value={editorData.excerpt}
                  onChange={(e) => setEditorData({ ...editorData, excerpt: e.target.value })}
                  placeholder="Brief summary for listings and SEO"
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Featured Image <ImageIcon size={16} className="inline ml-1" />
                </label>
                <input
                  type="url"
                  value={editorData.featured_image}
                  onChange={(e) => setEditorData({ ...editorData, featured_image: e.target.value })}
                  placeholder="Image URL"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
                {editorData.featured_image && (
                  <img
                    src={editorData.featured_image}
                    alt="Preview"
                    className="mt-3 w-full h-48 object-cover rounded-lg"
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content <span className="text-red-600">*</span>
                </label>
                <RichTextEditor
                  value={editorData.body}
                  onChange={(value) => setEditorData({ ...editorData, body: value })}
                  placeholder="Write your content here..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags <TagIcon size={16} className="inline ml-1" />
                </label>
                <TagInput
                  value={editorData.tags}
                  onChange={(tags) => setEditorData({ ...editorData, tags })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Schedule Publication <Clock size={16} className="inline ml-1" />
                </label>
                <input
                  type="datetime-local"
                  value={editorData.scheduled_at ? editorData.scheduled_at.slice(0, 16) : ''}
                  onChange={(e) =>
                    setEditorData({
                      ...editorData,
                      scheduled_at: e.target.value ? new Date(e.target.value).toISOString() : null,
                    })
                  }
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface MediaHubViewProps {
  mediaItems: MediaItem[];
  setViewState: (view: ViewState) => void;
  fetchMediaItems: () => void;
  user: any;
}

function MediaHubView({ mediaItems, setViewState, fetchMediaItems, user }: MediaHubViewProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setUploading(true);

      for (const file of Array.from(files)) {
        const fileName = `${Date.now()}-${file.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('media')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage.from('media').getPublicUrl(fileName);

        const { error: dbError } = await supabase.from('media_library').insert({
          filename: file.name,
          storage_path: fileName,
          file_size: file.size,
          mime_type: file.type,
          uploaded_by: user.id,
        });

        if (dbError) throw dbError;
      }

      fetchMediaItems();
    } catch (error) {
      console.error('Error uploading files:', error);
      alert('Failed to upload files');
    } finally {
      setUploading(false);
    }
  };

  const copyImageUrl = (path: string) => {
    const { data } = supabase.storage.from('media').getPublicUrl(path);
    navigator.clipboard.writeText(data.publicUrl);
    alert('Image URL copied to clipboard!');
  };

  return (
    <>
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button onClick={() => setViewState('SECTION_OVERVIEW')} className="text-gray-600 hover:text-gray-900">
                <ArrowLeft size={24} />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Media Hub</h1>
                <p className="text-gray-600">Central Asset Management</p>
              </div>
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <Upload size={18} />
              <span>{uploading ? 'Uploading...' : 'Upload Media'}</span>
            </button>
          </div>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />

      <div className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {mediaItems.map((item) => (
            <div
              key={item.id}
              className="group relative aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-blue-600"
              onClick={() => copyImageUrl(item.storage_path)}
            >
              <img
                src={supabase.storage.from('media').getPublicUrl(item.storage_path).data.publicUrl}
                alt={item.alt_text || item.filename}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center">
                <span className="text-white opacity-0 group-hover:opacity-100 text-sm font-medium">
                  Click to copy URL
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

interface SettingsViewProps {
  setViewState: (view: ViewState) => void;
}

function SettingsView({ setViewState }: SettingsViewProps) {
  return (
    <>
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <button onClick={() => setViewState('SECTION_OVERVIEW')} className="text-gray-600 hover:text-gray-900">
              <ArrowLeft size={24} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
              <p className="text-gray-600">CMS Configuration</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">CMS Settings</h2>
          <p className="text-gray-600">Settings interface coming soon...</p>
        </div>
      </div>
    </>
  );
}
