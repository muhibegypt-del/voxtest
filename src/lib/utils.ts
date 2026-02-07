/**
 * Utility functions for content display
 */

/**
 * Format a date string as relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 7) {
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
        });
    } else if (diffDays > 0) {
        return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
    } else if (diffHours > 0) {
        return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
    } else if (diffMins > 0) {
        return `${diffMins} minute${diffMins === 1 ? '' : 's'} ago`;
    } else {
        return 'Just now';
    }
}

/**
 * Generate an excerpt from article body text
 */
export function generateExcerpt(body: string, maxLength: number = 150): string {
    if (!body) return '';

    // Strip HTML tags if present
    const plainText = body.replace(/<[^>]*>/g, '');

    if (plainText.length <= maxLength) {
        return plainText;
    }

    // Truncate at word boundary
    const truncated = plainText.substring(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');

    return (lastSpace > 0 ? truncated.substring(0, lastSpace) : truncated) + '...';
}
