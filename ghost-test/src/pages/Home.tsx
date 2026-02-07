import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { GhostService } from '../lib/ghost';
import type { GhostPost } from '../lib/ghost';

export default function Home() {
    const [posts, setPosts] = useState<GhostPost[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        GhostService.getPosts().then(data => {
            setPosts(data);
            setLoading(false);
        });
    }, []);

    if (loading) {
        return (
            <div className="loading">
                <div className="spinner"></div>
                <p>Loading from Ghost...</p>
            </div>
        );
    }

    return (
        <div className="home">
            <header className="site-header">
                <h1>📰 Ghost Test News</h1>
                <p className="tagline">Testing Ghost CMS Integration</p>
                <a
                    href="https://voxtest.ghost.io/ghost"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="admin-link"
                >
                    Open Ghost Admin →
                </a>
            </header>

            <main className="posts-grid">
                {posts.length === 0 ? (
                    <div className="empty-state">
                        <h2>No posts yet!</h2>
                        <p>Go to <a href="https://voxtest.ghost.io/ghost" target="_blank" rel="noopener noreferrer">Ghost Admin</a> and create your first post.</p>
                    </div>
                ) : (
                    posts.map(post => (
                        <article key={post.id} className="post-card">
                            {post.feature_image && (
                                <img
                                    src={post.feature_image}
                                    alt={post.title}
                                    className="post-image"
                                />
                            )}
                            <div className="post-content">
                                {post.primary_tag && (
                                    <span className="tag">{post.primary_tag.name}</span>
                                )}
                                <h2>
                                    <Link to={`/post/${post.slug}`}>{post.title}</Link>
                                </h2>
                                <p className="excerpt">{post.excerpt}</p>
                                <div className="post-meta">
                                    {post.primary_author && (
                                        <span className="author">By {post.primary_author.name}</span>
                                    )}
                                    <span className="date">
                                        {new Date(post.published_at).toLocaleDateString()}
                                    </span>
                                    {post.reading_time && (
                                        <span className="reading-time">{post.reading_time} min read</span>
                                    )}
                                </div>
                            </div>
                        </article>
                    ))
                )}
            </main>
        </div>
    );
}
