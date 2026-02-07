import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { GhostService } from '../lib/ghost';
import type { GhostPost } from '../lib/ghost';

export default function Article() {
    const { slug } = useParams<{ slug: string }>();
    const [post, setPost] = useState<GhostPost | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (slug) {
            GhostService.getPostBySlug(slug).then(data => {
                setPost(data);
                setLoading(false);
            });
        }
    }, [slug]);

    if (loading) {
        return (
            <div className="loading">
                <div className="spinner"></div>
                <p>Loading article...</p>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="not-found">
                <h1>Article not found</h1>
                <Link to="/">← Back to Home</Link>
            </div>
        );
    }

    return (
        <article className="article-page">
            <header className="article-header">
                <Link to="/" className="back-link">← Back to Home</Link>

                {post.primary_tag && (
                    <span className="tag">{post.primary_tag.name}</span>
                )}

                <h1>{post.title}</h1>

                <div className="article-meta">
                    {post.primary_author && (
                        <div className="author-info">
                            {post.primary_author.profile_image && (
                                <img
                                    src={post.primary_author.profile_image}
                                    alt={post.primary_author.name}
                                    className="author-avatar"
                                />
                            )}
                            <span>{post.primary_author.name}</span>
                        </div>
                    )}
                    <span className="date">
                        {new Date(post.published_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </span>
                    {post.reading_time && (
                        <span className="reading-time">{post.reading_time} min read</span>
                    )}
                </div>
            </header>

            {post.feature_image && (
                <img
                    src={post.feature_image}
                    alt={post.title}
                    className="feature-image"
                />
            )}

            <div
                className="article-content"
                dangerouslySetInnerHTML={{ __html: post.html }}
            />

            {post.tags && post.tags.length > 0 && (
                <footer className="article-footer">
                    <div className="tags-list">
                        <strong>Tags:</strong>
                        {post.tags.map(tag => (
                            <span key={tag.id} className="tag">{tag.name}</span>
                        ))}
                    </div>
                </footer>
            )}
        </article>
    );
}
