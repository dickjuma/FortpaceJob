// @ts-nocheck
import React from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Edit, Trash2, ExternalLink } from 'lucide-react';

const articles = [
  { id: '1', title: 'Top 10 Freelancing Tips for 2025', status: 'Published', views: '1.2k', date: 'May 10, 2025' },
  { id: '2', name: 'How to Write a Winning Proposal', status: 'Draft', views: '-', date: 'May 20, 2025' },
  { id: '3', title: 'Understanding Marketplace Fees', status: 'Published', views: '3.4k', date: 'Apr 15, 2025' },
];

export const ArticlesPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy">My Articles</h1>
          <p className="text-text-secondary mt-1">Manage your blog posts and knowledge base articles.</p>
        </div>
        <Button variant="primary">Create Article</Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {articles.map(article => (
          <Card key={article.id} hover className="flex flex-col md:flex-row justify-between items-start md:items-center p-6">
            <div className="mb-4 md:mb-0">
              <h3 className="text-lg font-bold text-navy mb-2">{article.title || article.name}</h3>
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
        ))}
      </div>
    </div>
  );
};

export default ArticlesPage;
