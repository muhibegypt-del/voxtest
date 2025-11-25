import { useState, useEffect } from 'react';
import {
  FileText,
  Image as ImageIcon,
  Tag as TagIcon,
  BarChart3,
  Users,
  Settings,
  History,
  ShoppingBag,
  BookOpen,
  Archive,
  Book
} from 'lucide-react';
import ArticlesManager from '../components/ArticlesManager';
import AnalyticsDashboard from '../components/AnalyticsDashboard';
import TagsManager from '../components/TagsManager';
import MediaLibrary from '../components/MediaLibrary';
import { supabase } from '../lib/supabase';

// Renamed from EnhancedAdminDashboard
type Tab = 'analysis' | 'voices' | 'media' | 'store' | 'foundations' | 'archive' | 'bookshelf' | 'analytics' | 'tags' | 'library' | 'users' | 'settings';

interface ContentSection {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
}

const iconMap: Record<string, any> = {
  BarChart3: <BarChart3 size={20} />,
  Users: <Users size={20} />,
  Image: <ImageIcon size={20} />,
  ShoppingBag: <ShoppingBag size={20} />,
  BookOpen: <BookOpen size={20} />,
  Archive: <Archive size={20} />,
  Book: <Book size={20} />,
};

export default function AdminDashboard() { // Export name change
  const [activeTab, setActiveTab] = useState<Tab>('analysis');
  const [sections, setSections] = useState<ContentSection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    try {
      const { data, error } = await supabase
        .from('content_sections')
        .select('*')
        .eq('enabled', true)
        .order('sort_order');

      if (error) throw error;
      setSections(data || []);
      
      // Set the active tab to the first content section if currently on the default 'analysis'
      if (!data?.some(s => s.slug === activeTab) && data?.length > 0) {
        setActiveTab(data[0].slug as Tab);
      }
      
    } catch (error) {
      console.error('Error fetching sections:', error);
    } finally {
      setLoading(false);
    }
  };

  const contentTabs = sections.map(section => ({
    id: section.slug as Tab,
    name: section.name,
    icon: iconMap[section.icon] || <FileText size={20} />,
    sectionId: section.id,
  }));

  const utilityTabs = [
    { id: 'analytics' as Tab, name: 'Analytics', icon: <BarChart3 size={20} /> },
    { id: 'tags' as Tab, name: 'Tags', icon: <TagIcon size={20} /> },
    { id: 'library' as Tab, name: 'Media Library', icon: <ImageIcon size={20} /> },
    { id: 'users' as Tab, name: 'Users', icon: <Users size={20} /> },
    { id: 'settings' as Tab, name: 'Settings', icon: <Settings size={20} /> },
  ];

  const tabs = [...contentTabs, ...utilityTabs];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <h1 className="text-2xl font-bold text-gray-900">CMS Dashboard</h1>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <History size={16} />
              <span>Last updated: just now</span>
            </div>
          </div>
          <div className="flex space-x-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-3 font-medium text-sm transition-colors border-b-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-red-700 text-red-700' // Use red for focus/active state for a cleaner look
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                {tab.icon}
                <span>{tab.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-700"></div>
          </div>
        ) : (
          <>
            {/* Render ArticlesManager for content sections */}
            {contentTabs.map(tab =>
              activeTab === tab.id && (
                <ArticlesManager key={tab.id} sectionId={tab.sectionId} sectionName={tab.name} />
              )
            )}
            {activeTab === 'analytics' && <AnalyticsDashboard />}
            {activeTab === 'tags' && <TagsManager />}
            {activeTab === 'library' && <MediaLibrary />}
            {activeTab === 'users' && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">User Management</h2>
                <p className="text-gray-600">User management interface coming soon...</p>
              </div>
            )}
            {activeTab === 'settings' && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">CMS Settings</h2>
                <p className="text-gray-600">Settings interface coming soon...</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}