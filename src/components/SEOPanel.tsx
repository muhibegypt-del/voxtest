import { AlertCircle, CheckCircle } from 'lucide-react';

interface SEOPanelProps {
  metaTitle: string;
  metaDescription: string;
  ogImageUrl: string;
  articleTitle: string;
  excerpt: string;
  onMetaTitleChange: (value: string) => void;
  onMetaDescriptionChange: (value: string) => void;
  onOgImageUrlChange: (value: string) => void;
}

export default function SEOPanel({
  metaTitle,
  metaDescription,
  ogImageUrl,
  articleTitle,
  excerpt,
  onMetaTitleChange,
  onMetaDescriptionChange,
  onOgImageUrlChange,
}: SEOPanelProps) {
  const effectiveMetaTitle = metaTitle || articleTitle;
  const effectiveMetaDescription = metaDescription || excerpt;

  const metaTitleLength = effectiveMetaTitle.length;
  const metaDescriptionLength = effectiveMetaDescription.length;

  const getTitleStatus = () => {
    if (metaTitleLength === 0) return { color: 'text-red-600', icon: <AlertCircle size={14} />, message: 'Title is required' };
    if (metaTitleLength < 30) return { color: 'text-orange-600', icon: <AlertCircle size={14} />, message: 'Too short (aim for 50-60 characters)' };
    if (metaTitleLength > 60) return { color: 'text-orange-600', icon: <AlertCircle size={14} />, message: 'Too long (may be truncated in search results)' };
    return { color: 'text-green-600', icon: <CheckCircle size={14} />, message: 'Good length' };
  };

  const getDescriptionStatus = () => {
    if (metaDescriptionLength === 0) return { color: 'text-red-600', icon: <AlertCircle size={14} />, message: 'Description recommended' };
    if (metaDescriptionLength < 120) return { color: 'text-orange-600', icon: <AlertCircle size={14} />, message: 'Too short (aim for 150-160 characters)' };
    if (metaDescriptionLength > 160) return { color: 'text-orange-600', icon: <AlertCircle size={14} />, message: 'Too long (may be truncated)' };
    return { color: 'text-green-600', icon: <CheckCircle size={14} />, message: 'Good length' };
  };

  const titleStatus = getTitleStatus();
  const descriptionStatus = getDescriptionStatus();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Search Engine Optimization
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Optimize how your article appears in search results and social media shares.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Meta Title
          <span className={`float-right text-xs ${metaTitleLength > 60 ? 'text-red-600 font-semibold' : metaTitleLength > 50 ? 'text-orange-600' : 'text-gray-500'}`}>
            {metaTitleLength}/60
          </span>
        </label>
        <input
          type="text"
          value={metaTitle}
          onChange={(e) => onMetaTitleChange(e.target.value)}
          placeholder={articleTitle || 'Defaults to article title'}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          maxLength={70}
        />
        <div className={`flex items-center mt-1 text-xs ${titleStatus.color}`}>
          {titleStatus.icon}
          <span className="ml-1">{titleStatus.message}</span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Meta Description
          <span className={`float-right text-xs ${metaDescriptionLength > 160 ? 'text-red-600 font-semibold' : metaDescriptionLength > 150 ? 'text-orange-600' : 'text-gray-500'}`}>
            {metaDescriptionLength}/160
          </span>
        </label>
        <textarea
          value={metaDescription}
          onChange={(e) => onMetaDescriptionChange(e.target.value)}
          placeholder={excerpt || 'Defaults to article excerpt'}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          maxLength={170}
        />
        <div className={`flex items-center mt-1 text-xs ${descriptionStatus.color}`}>
          {descriptionStatus.icon}
          <span className="ml-1">{descriptionStatus.message}</span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Social Media Image (Open Graph)
        </label>
        <input
          type="url"
          value={ogImageUrl}
          onChange={(e) => onOgImageUrlChange(e.target.value)}
          placeholder="https://example.com/social-image.jpg"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <p className="mt-1 text-xs text-gray-500">
          Recommended size: 1200x630px. Defaults to article image if not specified.
        </p>
        {ogImageUrl && ogImageUrl.match(/^https?:\/\//) && (
          <div className="mt-3">
            <img
              src={ogImageUrl}
              alt="Social preview"
              className="w-full max-w-md h-auto rounded border border-gray-300"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">
          Search Preview
        </h4>
        <div className="space-y-1">
          <div className="text-blue-700 text-lg hover:underline cursor-default truncate">
            {effectiveMetaTitle || 'Your Article Title'}
          </div>
          <div className="text-green-700 text-xs">
            www.voxummah.com › article › example-slug
          </div>
          <div className="text-sm text-gray-600 line-clamp-2">
            {effectiveMetaDescription || 'Your article description will appear here in search results.'}
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-blue-900 mb-2">
          SEO Tips
        </h4>
        <ul className="text-xs text-blue-800 space-y-1 list-disc list-inside">
          <li>Include your main keyword in the title</li>
          <li>Write compelling descriptions that encourage clicks</li>
          <li>Use unique titles and descriptions for each article</li>
          <li>High-quality images improve social media engagement</li>
        </ul>
      </div>
    </div>
  );
}
