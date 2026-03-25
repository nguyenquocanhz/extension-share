import React from 'react';
import { TrendingUp, Loader2 } from 'lucide-react';
import RepoCard from './RepoCard';
import type { GitHubRepo } from '../types';

interface TopReposProps {
  tag: string;
  topRepos: GitHubRepo[];
  loadingTop: boolean;
  getDisplayedRepos: (list: GitHubRepo[]) => GitHubRepo[];
  bookmarks: GitHubRepo[];
  toggleBookmark: (repo: GitHubRepo) => void;
}

export default function TopRepos({ tag, topRepos, loadingTop, getDisplayedRepos, bookmarks, toggleBookmark }: TopReposProps) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-blue-500/10 rounded-xl">
          <TrendingUp className="w-6 h-6 text-blue-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Top 5 Nổi bật toàn cầu</h2>
          <p className="text-slate-400 text-sm">Các dự án có nhiều lượt Star nhất với thẻ <code className="text-blue-300">#{tag}</code></p>
        </div>
      </div>

      {loadingTop ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-500">
          <Loader2 className="w-8 h-8 animate-spin mb-4" />
          <p>Đang tải bảng xếp hạng...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {getDisplayedRepos(topRepos).map(repo => <RepoCard key={`top-${repo.id}`} repo={repo} bookmarks={bookmarks} toggleBookmark={toggleBookmark} />)}
        </div>
      )}
    </div>
  );
}
