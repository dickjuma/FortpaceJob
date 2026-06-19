// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { Card } from '../../platform/components/common/Card';
import { Button } from '../../platform/components/common/Button';
import { Badge } from '../../platform/components/common/Badge';
import { Edit, Trash2, ExternalLink } from 'lucide-react';
import { api } from '../../platform/common/services/api';

export const ArticlesPage = () => {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    setError(null);

    api
      .get('/admin_rbc/articles')
      .then(({ data }) => {
        if (!active) return;
        setArticles(data.items || data.articles || []);
      })
      .catch((err) => {
        if (!active) return;
        setError(err?.message || 'Unable to load articles.');
      })
      .finally(() => {
        if (!active) return;
        setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#222222]">My Articles</h1>
          <p className="text-text-secondary mt-1">Manage your blog posts and knowledge base articles.</p>
        </div>
        <Button variant="primary">Create Article</Button>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="rounded-2xl border border-zinc-200 bg-zinc-100 p-8 text-center text-zinc-500 animate-pulse">
          Loading articles...
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {articles.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border border-border">
              <p className="text-text-secondary">No articles found.</p>
            </div>
          ) : (
            articles.map((article) => (
              <Card key={article.id} hover className="flex flex-col md:flex-row justify-between items-start md:items-center p-6">
                <div className="mb-4 md:mb-0">
                  <h3 className="text-lg font-bold text-[#222222] mb-2">{article.title || article.name}</h3>
                  <div className="flex items-center space-x-4 text-sm text-text-secondary">
                    <Badge variant={article.status === 'Published' ? 'success' : 'default'}>
                      {article.status}
                    </Badge>
                    <span>{article.date}</span>
                    <span>{article.views} views</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 w-full md:w-auto justify-end">
                  <Button variant="ghost" size="sm" icon={<ExternalLink size={16} />}>View</Button>
                  <Button variant="ghost" size="sm" icon={<Edit size={16} />}>Edit</Button>
                  <Button variant="ghost" size="sm" className="text-error hover:text-error hover:bg-red-50" icon={<Trash2 size={16} />}></Button>
                </div>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ArticlesPage;
