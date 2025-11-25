import { useState, useEffect } from 'react';
import { Image as ImageIcon, Upload, Trash2, Search, Grid, List } from 'lucide-react';

export default function MediaLibrary() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Media Library</h2>
          <p className="text-sm text-gray-600 mt-1">Manage your images and files</p>
        </div>
        <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          <Upload size={20} />
          <span>Upload Media</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center space-x-4">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search media..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${
                viewMode === 'grid'
                  ? 'bg-blue-100 text-blue-600'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Grid size={20} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${
                viewMode === 'list'
                  ? 'bg-blue-100 text-blue-600'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <List size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-8">
        <div className="text-center py-12">
          <ImageIcon size={64} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Media Library Coming Soon
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Upload and manage images directly within the CMS. For now, you can use external image URLs in your articles.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto text-left">
            <h4 className="text-sm font-semibold text-blue-900 mb-2">Planned Features</h4>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li>Drag-and-drop file upload</li>
              <li>Automatic image optimization and resizing</li>
              <li>WebP conversion for better performance</li>
              <li>Image editing tools (crop, rotate, filters)</li>
              <li>Search and filter by filename and date</li>
              <li>Storage usage tracking</li>
              <li>Bulk operations (delete, download)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
