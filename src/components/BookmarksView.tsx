import React from 'react';
import { Bookmark, LayoutGrid } from 'lucide-react';
import RepoCard from './RepoCard';
import type { GitHubRepo } from '../types';

interface BookmarksViewProps {
  bookmarks: GitHubRepo[];
  getDisplayedRepos: (list: GitHubRepo[]) => GitHubRepo[];
  toggleBookmark: (repo: GitHubRepo) => void;
}

export default function BookmarksView({ bookmarks, getDisplayedRepos, toggleBookmark }: BookmarksViewProps) {
  if (bookmarks.length === 0) {
    return (
      <div className="text-center text-slate-500 py-20">
        <Bookmark className="w-16 h-16 mx-auto mb-4 opacity-20" />
        <p className="text-lg">Bạn chưa lưu dự án nào.</p>
        <p className="text-sm mt-2">Hãy nhấn vào biểu tượng Bookmark trên các thẻ để lưu lại nhé!</p>
      </div>
    );
  }

  const displayed = getDisplayedRepos(bookmarks);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {displayed.length > 0 ? (
        displayed.map(repo => <RepoCard key={`bookmark-${repo.id}`} repo={repo} bookmarks={bookmarks} toggleBookmark={toggleBookmark} />)
      ) : (
        <div className="col-span-full text-center text-slate-500 py-12">
          <LayoutGrid className="w-12 h-12 mx-auto mb-4 opacity-20" />
          <p>Không có tiện ích đã lưu nào khớp với bộ lọc hiện tại.</p>
        </div>
      )}
    </div>
  );
}
