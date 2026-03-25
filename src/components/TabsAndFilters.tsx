import React from 'react';
import { Search, Bookmark, Filter } from 'lucide-react';

interface TabsAndFiltersProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  bookmarksCount: number;
  filterText: string;
  setFilterText: (text: string) => void;
  starFilter: string;
  setStarFilter: (filter: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
}

export default function TabsAndFilters({
  activeTab, setActiveTab,
  bookmarksCount,
  filterText, setFilterText,
  starFilter, setStarFilter,
  sortBy, setSortBy
}: TabsAndFiltersProps) {
  return (
    <section className="bg-slate-900 border-b border-slate-800 sticky top-16 z-30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 py-4">
          {/* Tabs */}
          <div className="flex items-center gap-2 bg-slate-800/50 p-1 rounded-lg w-full lg:w-auto">
            <button
              onClick={() => setActiveTab('search')}
              className={`flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-md font-medium text-sm transition-all ${activeTab === 'search' ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}
            >
              <Search className="w-4 h-4" />
              Kết quả tìm kiếm
            </button>
            <button
              onClick={() => setActiveTab('bookmarks')}
              className={`flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-md font-medium text-sm transition-all ${activeTab === 'bookmarks' ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}
            >
              <Bookmark className="w-4 h-4" />
              Đã lưu ({bookmarksCount})
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <div className="relative flex-1 min-w-[150px]">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="h-4 w-4 text-slate-500" />
              </div>
              <input
                type="text"
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                placeholder="Lọc tên dự án..."
                className="block w-full pl-9 pr-3 py-2 border border-slate-700 rounded-lg bg-slate-800/50 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
              />
            </div>

            <select
              value={starFilter}
              onChange={(e) => setStarFilter(e.target.value)}
              className="block flex-1 lg:flex-none pl-3 pr-8 py-2 border border-slate-700 rounded-lg bg-slate-800/50 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none cursor-pointer text-sm"
            >
              <option value="all">🌟 Mọi khoảng Star</option>
              <option value="0-1000">0 - 1.000 Stars</option>
              <option value="1000-10000">1.000 - 10.000 Stars</option>
              <option value="10000-50000">10.000 - 50.000 Stars</option>
              <option value="50000+">&gt; 50.000 Stars</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="block flex-1 lg:flex-none pl-3 pr-8 py-2 border border-slate-700 rounded-lg bg-slate-800/50 text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none cursor-pointer text-sm"
            >
              <option value="stars">⭐ Nhiều Star nhất</option>
              <option value="updated">🕒 Mới cập nhật</option>
            </select>
          </div>
        </div>
      </div>
    </section>
  );
}
