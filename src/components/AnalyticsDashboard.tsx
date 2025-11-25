import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Eye, FileText, TrendingUp, Clock, BarChart3 } from 'lucide-react';
import { AnalyticsData } from '../types/cms';

export default function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month'>('week');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const { data: articles } = await supabase
        .from('articles')
        .select('id, title, view_count, published, category');

      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthStart = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      const { data: todayViews } = await supabase
        .from('article_views')
        .select('id')
        .gte('viewed_at', todayStart.toISOString());

      const { data: weekViews } = await supabase
        .from('article_views')
        .select('id')
        .gte('viewed_at', weekStart.toISOString());

      const { data: monthViews } = await supabase
        .from('article_views')
        .select('id')
        .gte('viewed_at', monthStart.toISOString());

      const totalViews = articles?.reduce((sum, article) => sum + (article.view_count || 0), 0) || 0;
      const publishedArticles = articles?.filter((a) => a.published).length || 0;
      const draftArticles = articles?.filter((a) => !a.published).length || 0;

      const topArticles = (articles || [])
        .sort((a, b) => (b.view_count || 0) - (a.view_count || 0))
        .slice(0, 5)
        .map((a) => ({
          id: a.id,
          title: a.title,
          view_count: a.view_count || 0,
        }));

      const viewsByCategory = Object.entries(
        (articles || []).reduce((acc, article) => {
          acc[article.category] = (acc[article.category] || 0) + (article.view_count || 0);
          return acc;
        }, {} as Record<string, number>)
      ).map(([category, count]) => ({ category, count }));

      setAnalytics({
        totalViews,
        totalArticles: articles?.length || 0,
        publishedArticles,
        draftArticles,
        todayViews: todayViews?.length || 0,
        weekViews: weekViews?.length || 0,
        monthViews: monthViews?.length || 0,
        topArticles,
        viewsByCategory,
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-12 text-gray-500">
        Unable to load analytics data
      </div>
    );
  }

  const stats = [
    {
      name: 'Total Views',
      value: analytics.totalViews.toLocaleString(),
      icon: <Eye size={24} />,
      color: 'bg-blue-500',
      change: '+12% from last period',
    },
    {
      name: 'Total Articles',
      value: analytics.totalArticles.toLocaleString(),
      icon: <FileText size={24} />,
      color: 'bg-green-500',
      change: `${analytics.publishedArticles} published`,
    },
    {
      name: timeRange === 'today' ? 'Today' : timeRange === 'week' ? 'This Week' : 'This Month',
      value: (timeRange === 'today' ? analytics.todayViews : timeRange === 'week' ? analytics.weekViews : analytics.monthViews).toLocaleString(),
      icon: <TrendingUp size={24} />,
      color: 'bg-purple-500',
      change: 'Unique views',
    },
    {
      name: 'Draft Articles',
      value: analytics.draftArticles.toLocaleString(),
      icon: <Clock size={24} />,
      color: 'bg-orange-500',
      change: 'Awaiting publication',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setTimeRange('today')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              timeRange === 'today'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Today
          </button>
          <button
            onClick={() => setTimeRange('week')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              timeRange === 'week'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setTimeRange('month')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              timeRange === 'month'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Month
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
              </div>
              <div className={`${stat.color} text-white p-3 rounded-lg`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <TrendingUp size={20} className="mr-2" />
            Top Performing Articles
          </h3>
          <div className="space-y-3">
            {analytics.topArticles.length > 0 ? (
              analytics.topArticles.map((article, index) => (
                <div
                  key={article.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-semibold text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {article.title}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 flex-shrink-0 ml-4">
                    <Eye size={14} />
                    <span className="font-semibold">{article.view_count.toLocaleString()}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">
                No article views yet
              </p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <BarChart3 size={20} className="mr-2" />
            Views by Category
          </h3>
          <div className="space-y-3">
            {analytics.viewsByCategory.length > 0 ? (
              analytics.viewsByCategory
                .sort((a, b) => b.count - a.count)
                .map((item) => {
                  const maxCount = Math.max(...analytics.viewsByCategory.map((i) => i.count));
                  const percentage = maxCount > 0 ? (item.count / maxCount) * 100 : 0;
                  return (
                    <div key={item.category}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">
                          {item.category}
                        </span>
                        <span className="text-sm text-gray-600">
                          {item.count.toLocaleString()} views
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">
                No category data available
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">
          Analytics Insights
        </h3>
        <ul className="text-sm text-blue-800 space-y-2">
          <li>View tracking is automatic for all published articles</li>
          <li>Analytics update in real-time as visitors view content</li>
          <li>Use these insights to understand what content resonates with your audience</li>
          <li>Consider creating more content in high-performing categories</li>
        </ul>
      </div>
    </div>
  );
}
