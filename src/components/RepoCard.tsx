import React from 'react';
import { Download, Github, Star, Clock, Bookmark, BookmarkCheck } from 'lucide-react';
import RepoContributors from './RepoContributors';
import type { GitHubRepo } from '../types';

interface RepoCardProps {
  repo: GitHubRepo;
  bookmarks: GitHubRepo[];
  toggleBookmark: (repo: GitHubRepo) => void;
}

export default function RepoCard({ repo, bookmarks, toggleBookmark }: RepoCardProps) {
  const isSaved = bookmarks.some(r => r.id === repo.id);

  return (
    <div className="bg-slate-800/50 border border-slate-700 hover:border-blue-500/50 transition-colors p-6 rounded-2xl flex flex-col h-full group relative">
      <button
        onClick={() => toggleBookmark(repo)}
        className={`absolute top-4 right-4 p-2 rounded-lg transition-all ${isSaved ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30' : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 border border-slate-700'}`}
        title={isSaved ? "Bỏ lưu" : "Lưu vào danh sách"}
      >
        {isSaved ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
      </button>

      <div className="flex justify-between items-start mb-4 gap-4 pr-10">
        <h3 className="text-xl font-bold text-white truncate group-hover:text-blue-400 transition-colors" title={repo.name}>
          {repo.name}
        </h3>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center text-yellow-400 text-sm font-medium bg-yellow-400/10 px-2 py-1 rounded-md shrink-0">
          <Star className="w-4 h-4 mr-1 fill-current" />
          {repo.stargazers_count.toLocaleString()}
        </div>
        <div className="flex items-center text-slate-400 text-xs bg-slate-800 px-2 py-1 rounded-md shrink-0">
          <Clock className="w-3 h-3 mr-1" />
          {new Date(repo.updated_at).toLocaleDateString('vi-VN')}
        </div>
        <div className="flex items-center text-blue-400 text-xs bg-blue-900/30 px-2 py-1 rounded-md shrink-0 max-w-[120px] truncate">
          <Github className="w-3 h-3 mr-1" />
          {repo.owner.login}
        </div>
      </div>

      <RepoContributors url={repo.contributors_url} />

      <p className="text-slate-400 text-sm flex-1 mb-6 line-clamp-3" title={repo.description || undefined}>
        {repo.description || 'Chưa có mô tả cho dự án này.'}
      </p>

      <div className="flex items-center gap-3 mt-auto pt-4 border-t border-slate-700">
        <a
          href={`https://github.com/${repo.full_name}/archive/refs/heads/${repo.default_branch || 'main'}.zip`}
          className="flex-1 bg-blue-600/10 hover:bg-blue-600 text-blue-400 hover:text-white text-sm font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center transition-all border border-blue-600/20 hover:border-blue-600"
        >
          <Download className="w-4 h-4 mr-2" />
          Tải ZIP
        </a>
        <a
          href={repo.html_url}
          target="_blank"
          rel="noreferrer"
          className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white p-2.5 rounded-xl transition-colors border border-slate-700"
          title="Xem trên GitHub"
        >
          <Github className="w-5 h-5" />
        </a>
      </div>
    </div>
  );
}
