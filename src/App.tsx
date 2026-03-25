import React, { useState, useEffect } from 'react';
import { updateMetaTag } from './utils/seo';
import useGitHubSearch from './hooks/useGitHubSearch';
import useBookmarks from './hooks/useBookmarks';
import type { GitHubRepo } from './types';

// Components
import Navbar from './components/Navbar';
import HeroSearch from './components/HeroSearch';
import TabsAndFilters from './components/TabsAndFilters';
import TopRepos from './components/TopRepos';
import SearchResults from './components/SearchResults';
import BookmarksView from './components/BookmarksView';
import SettingsModal from './components/SettingsModal';
import Footer from './components/Footer';

export default function App() {
  // Custom Hooks
  const {
    username, setUsername,
    tag, setTag,
    extensions, loading, error,
    hasSearched,
    hasMore, loadMore, loadingMore,
    currentSearch,
    topRepos, loadingTop,
    suggestions, showSuggestions, setShowSuggestions,
    suggestLoading, searchContainerRef,
    popularTags,
    handleSearch,
  } = useGitHubSearch();

  const { bookmarks, setBookmarks, toggleBookmark } = useBookmarks();

  // UI States
  const [activeTab, setActiveTab] = useState('search');
  const [filterText, setFilterText] = useState('');
  const [sortBy, setSortBy] = useState('stars');
  const [starFilter, setStarFilter] = useState('all');
  const [showSettings, setShowSettings] = useState(false);

  // Hàm lọc và sắp xếp repos
  const getDisplayedRepos = (sourceList: GitHubRepo[]): GitHubRepo[] => {
    let list = [...sourceList];

    if (filterText) {
      list = list.filter(r =>
        r.name.toLowerCase().includes(filterText.toLowerCase()) ||
        (r.description && r.description.toLowerCase().includes(filterText.toLowerCase()))
      );
    }

    if (starFilter !== 'all') {
      list = list.filter(r => {
        const stars = r.stargazers_count;
        if (starFilter === '0-1000') return stars >= 0 && stars <= 1000;
        if (starFilter === '1000-10000') return stars > 1000 && stars <= 10000;
        if (starFilter === '10000-50000') return stars > 10000 && stars <= 50000;
        if (starFilter === '50000+') return stars > 50000;
        return true;
      });
    }

    return list.sort((a, b) => {
      if (sortBy === 'stars') return b.stargazers_count - a.stargazers_count;
      if (sortBy === 'updated') return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      return 0;
    });
  };

  // TỐI ƯU SEO ĐỘNG
  useEffect(() => {
    let title = "ExtenShare - Khám phá Chrome Extension Mã Nguồn Mở";
    let description = "Nền tảng tìm kiếm, khám phá và chia sẻ mã nguồn Chrome Extension. Tải trực tiếp file ZIP từ GitHub an toàn, miễn phí.";

    if (activeTab === 'bookmarks') {
      title = "Tiện ích đã lưu - ExtenShare";
      description = `Danh sách ${bookmarks.length} tiện ích mở rộng bạn đã lưu trên ExtenShare.`;
    } else if (hasSearched && currentSearch.query) {
      title = `Kết quả: ${currentSearch.query} - ExtenShare`;
      description = `Khám phá các tiện ích mở rộng mã nguồn mở liên quan đến ${currentSearch.query} trên nền tảng ExtenShare.`;
    } else if (tag) {
      title = `Top Tiện ích #${tag} - ExtenShare`;
      description = `Bảng xếp hạng các repository GitHub có nhiều Star nhất thuộc chủ đề #${tag}.`;
    }

    document.title = title;
    updateMetaTag('description', description);
    updateMetaTag('og:title', title, 'property');
    updateMetaTag('og:description', description, 'property');
    updateMetaTag('og:type', 'website', 'property');
    updateMetaTag('og:site_name', 'ExtenShare', 'property');
    updateMetaTag('keywords', 'chrome extension, mã nguồn mở, github, react, extension share, tải extension zip');
  }, [hasSearched, currentSearch.query, tag, activeTab, bookmarks.length]);

  // Handler clear data cho Settings Modal
  const handleClearData = (): void => {
    localStorage.removeItem('ext-github-token');
    localStorage.removeItem('ext-bookmarks');
    setBookmarks([]);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-blue-500/30 flex flex-col">
      <Navbar onSettingsOpen={() => setShowSettings(true)} />

      <HeroSearch
        username={username} setUsername={setUsername}
        tag={tag} setTag={setTag}
        loading={loading} handleSearch={handleSearch}
        popularTags={popularTags}
        suggestions={suggestions}
        showSuggestions={showSuggestions} setShowSuggestions={setShowSuggestions}
        suggestLoading={suggestLoading}
        searchContainerRef={searchContainerRef}
      />

      <TabsAndFilters
        activeTab={activeTab} setActiveTab={setActiveTab}
        bookmarksCount={bookmarks.length}
        filterText={filterText} setFilterText={setFilterText}
        starFilter={starFilter} setStarFilter={setStarFilter}
        sortBy={sortBy} setSortBy={setSortBy}
      />

      <section className="py-12 bg-slate-900/50 flex-1 w-full">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          {activeTab === 'search' && !hasSearched && !loading && (
            <TopRepos
              tag={tag} topRepos={topRepos} loadingTop={loadingTop}
              getDisplayedRepos={getDisplayedRepos}
              bookmarks={bookmarks} toggleBookmark={toggleBookmark}
            />
          )}

          {activeTab === 'search' && (hasSearched || loading || error) && (
            <SearchResults
              loading={loading} error={error}
              hasSearched={hasSearched} currentSearch={currentSearch}
              extensions={extensions} getDisplayedRepos={getDisplayedRepos}
              hasMore={hasMore} loadMore={loadMore} loadingMore={loadingMore}
              bookmarks={bookmarks} toggleBookmark={toggleBookmark}
            />
          )}

          {activeTab === 'bookmarks' && (
            <BookmarksView
              bookmarks={bookmarks}
              getDisplayedRepos={getDisplayedRepos}
              toggleBookmark={toggleBookmark}
            />
          )}

        </div>
      </section>

      <Footer onSettingsOpen={() => setShowSettings(true)} />

      <SettingsModal
        show={showSettings}
        onClose={() => setShowSettings(false)}
        onClearData={handleClearData}
      />
    </div>
  );
}
