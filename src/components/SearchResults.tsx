import React from 'react';
import { Loader2, Download, LayoutGrid } from 'lucide-react';
import RepoCard from './RepoCard';
import type { GitHubRepo, CurrentSearch } from '../types';

interface SearchResultsProps {
  loading: boolean;
  error: string | null;
  hasSearched: boolean;
  currentSearch: CurrentSearch;
  extensions: GitHubRepo[];
  getDisplayedRepos: (list: GitHubRepo[]) => GitHubRepo[];
  hasMore: boolean;
  loadMore: () => void;
  loadingMore: boolean;
  bookmarks: GitHubRepo[];
  toggleBookmark: (repo: GitHubRepo) => void;
}

export default function SearchResults({
  loading, error, hasSearched, currentSearch,
  extensions, getDisplayedRepos,
  hasMore, loadMore, loadingMore,
  bookmarks, toggleBookmark
}: SearchResultsProps) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-blue-400">
        <Loader2 className="w-10 h-10 animate-spin mb-4" />
        <p className="animate-pulse">Đang truy xuất dữ liệu từ GitHub...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded-xl text-center max-w-2xl mx-auto">
        <p>{error}</p>
      </div>
    );
  }

  if (!hasSearched) return null;

  const displayedRepos = getDisplayedRepos(extensions);

  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-6">
        {currentSearch.searchType === 'repo' && (
          <>Chi tiết Repository <span className="text-blue-400">"{currentSearch.query}"</span></>
        )}
        {currentSearch.searchType === 'user' && (
          <>Dự án của Username <span className="text-blue-400">"{currentSearch.query}"</span></>
        )}
        {currentSearch.searchType === 'text' && (
          <>Kết quả tìm kiếm cho <span className="text-blue-400">"{currentSearch.query}"</span></>
        )}
      </h2>

      {displayedRepos.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedRepos.map(repo => <RepoCard key={repo.id} repo={repo} bookmarks={bookmarks} toggleBookmark={toggleBookmark} />)}
          </div>

          {hasMore && !currentSearch.isExactRepo && (
            <div className="mt-12 flex justify-center">
              <button
                onClick={loadMore}
                disabled={loadingMore}
                className="flex items-center justify-center gap-2 px-8 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-semibold transition-all border border-slate-700 disabled:opacity-50"
              >
                {loadingMore ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
                Tải thêm kết quả
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center text-slate-500 py-12">
          <LayoutGrid className="w-12 h-12 mx-auto mb-4 opacity-20" />
          <p>Không có kết quả nào khớp với bộ lọc Star hoặc Tên hiện tại.</p>
        </div>
      )}
    </div>
  );
}
