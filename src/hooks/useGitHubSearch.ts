import { useState, useEffect, useRef, type FormEvent } from 'react';
import { getHeaders } from '../utils/github';
import type { GitHubRepo, GitHubUser, CurrentSearch } from '../types';

export default function useGitHubSearch() {
  const [username, setUsername] = useState('');
  const [tag, setTag] = useState('chrome-extension');
  const [extensions, setExtensions] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // States cho Load More
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentSearch, setCurrentSearch] = useState<CurrentSearch>({ query: '', tag: '', isExactRepo: false, searchType: 'text' });

  // Refs cho AbortController
  const searchAbortRef = useRef<AbortController | null>(null);
  const loadMoreAbortRef = useRef<AbortController | null>(null);

  // States cho Top 5 Global
  const [topRepos, setTopRepos] = useState<GitHubRepo[]>([]);
  const [loadingTop, setLoadingTop] = useState(false);

  // States cho Auto-suggest Username
  const [suggestions, setSuggestions] = useState<GitHubUser[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestLoading, setSuggestLoading] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const popularTags = ['chrome-extension', 'web-extension', 'manifest-v3', 'firefox-extension', 'react-extension'];

  // Cleanup abort controllers on unmount
  useEffect(() => {
    return () => {
      if (searchAbortRef.current) searchAbortRef.current.abort();
      if (loadMoreAbortRef.current) loadMoreAbortRef.current.abort();
    };
  }, []);

  // Thuật toán lấy Top 5 Global dựa trên Tag
  useEffect(() => {
    if (!tag.trim()) return;

    const fetchTop5 = async () => {
      setLoadingTop(true);
      try {
        const res = await fetch(`https://api.github.com/search/repositories?q=topic:${tag.trim()}&sort=stars&order=desc&per_page=5`, { headers: getHeaders() });
        if (res.ok) {
          const data = await res.json();
          setTopRepos(data.items || []);
        }
      } catch (err) {
        console.error('Lỗi khi lấy Top 5:', err);
      } finally {
        setLoadingTop(false);
      }
    };

    const timeoutId = setTimeout(fetchTop5, 500);
    return () => clearTimeout(timeoutId);
  }, [tag]);

  // Thuật toán Auto-suggest Username
  useEffect(() => {
    if (!username.trim() || username.trim().length < 2 || username.includes('/')) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const controller = new AbortController();
    const signal = controller.signal;

    const fetchSuggestions = async () => {
      setSuggestLoading(true);
      try {
        const res = await fetch(`https://api.github.com/search/users?q=${encodeURIComponent(username.trim())}&per_page=15`, {
          signal,
          headers: getHeaders()
        });
        if (res.ok) {
          const data = await res.json();
          setSuggestions(data.items || []);
          setShowSuggestions(true);
        }
      } catch (err: unknown) {
        if (err instanceof Error && err.name !== 'AbortError') console.error('Lỗi fetch gợi ý:', err);
      } finally {
        setSuggestLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchSuggestions, 400);
    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [username]);

  // Click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // XỬ LÝ KỸ THUẬT TÌM KIẾM THÔNG MINH
  const handleSearch = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    if (!username.trim()) return;

    if (searchAbortRef.current) {
      searchAbortRef.current.abort();
    }
    searchAbortRef.current = new AbortController();
    const signal = searchAbortRef.current.signal;

    const queryUser = username.trim().replace(/\/$/, '');
    const queryTag = tag.trim();

    let exactRepo: string | null = null;
    let targetUser: string | null = null;
    let generalSearch: string | null = null;

    // Phân loại tìm kiếm
    const matchUrl = queryUser.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    if (matchUrl) {
      exactRepo = `${matchUrl[1]}/${matchUrl[2].replace('.git', '')}`;
    } else if (queryUser.match(/github\.com\/([^\/]+)$/)) {
      targetUser = queryUser.match(/github\.com\/([^\/]+)$/)![1];
    } else if (queryUser.includes('/') && !queryUser.startsWith('http')) {
      exactRepo = queryUser;
    } else {
      if (!queryUser.includes(' ')) {
        targetUser = queryUser;
      } else {
        generalSearch = queryUser;
      }
    }

    setLoading(true);
    setError(null);
    setHasSearched(true);
    setPage(1);

    let fetchUrl = '';
    let isExact = false;
    let searchType: CurrentSearch['searchType'] = 'text';
    let actualQuery = '';

    if (exactRepo) {
      fetchUrl = `https://api.github.com/repos/${exactRepo}`;
      isExact = true;
      searchType = 'repo';
      actualQuery = exactRepo;
    } else if (targetUser) {
      const q = `user:${targetUser} ${queryTag ? `topic:${queryTag}` : ''}`.trim();
      fetchUrl = `https://api.github.com/search/repositories?q=${encodeURIComponent(q)}&sort=stars&order=desc&per_page=30&page=1`;
      searchType = 'user';
      actualQuery = targetUser;
    } else {
      const q = `${generalSearch} ${queryTag ? `topic:${queryTag}` : ''}`.trim();
      fetchUrl = `https://api.github.com/search/repositories?q=${encodeURIComponent(q)}&sort=stars&order=desc&per_page=30&page=1`;
      searchType = 'text';
      actualQuery = generalSearch || '';
    }

    setCurrentSearch({ query: actualQuery, tag: queryTag, isExactRepo: isExact, searchType });

    try {
      const response = await fetch(fetchUrl, { headers: getHeaders(), signal });
      if (!response.ok) throw new Error(isExact ? `Không tìm thấy repository: ${exactRepo}` : 'Không thể lấy dữ liệu (Vượt giới hạn API hoặc sai thông tin).');

      const data = await response.json();

      if (isExact) {
        setExtensions([data]);
        setHasMore(false);
      } else {
        setExtensions(data.items || []);
        setHasMore(data.items && data.items.length > 0 && data.items.length < data.total_count);

        if (data.items && data.items.length === 0) {
          setError(`Không tìm thấy kết quả nào khớp với "${actualQuery}" ${queryTag ? `và tag "${queryTag}"` : ''}.`);
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          console.log('Đã hủy request tìm kiếm cũ.');
        } else {
          setError(err.message);
        }
      }
    } finally {
      if (searchAbortRef.current && searchAbortRef.current.signal === signal) {
        setLoading(false);
      }
    }
  };

  const loadMore = async () => {
    if (!hasMore || loadingMore || currentSearch.isExactRepo) return;

    if (loadMoreAbortRef.current) {
      loadMoreAbortRef.current.abort();
    }
    loadMoreAbortRef.current = new AbortController();
    const signal = loadMoreAbortRef.current.signal;

    setLoadingMore(true);
    const nextPage = page + 1;

    let q = '';
    if (currentSearch.searchType === 'user') {
      q = `user:${currentSearch.query} ${currentSearch.tag ? `topic:${currentSearch.tag}` : ''}`.trim();
    } else {
      q = `${currentSearch.query} ${currentSearch.tag ? `topic:${currentSearch.tag}` : ''}`.trim();
    }

    const fetchUrl = `https://api.github.com/search/repositories?q=${encodeURIComponent(q)}&sort=stars&order=desc&per_page=30&page=${nextPage}`;

    try {
      const response = await fetch(fetchUrl, { headers: getHeaders(), signal });
      if (!response.ok) throw new Error('Không thể lấy thêm dữ liệu từ GitHub.');
      const data = await response.json();

      const newItems: GitHubRepo[] = data.items || [];
      setExtensions(prev => [...prev, ...newItems]);
      setPage(nextPage);

      setHasMore(extensions.length + newItems.length < data.total_count);
    } catch (err: unknown) {
      if (err instanceof Error && err.name !== 'AbortError') {
        console.error('Lỗi khi tải thêm:', err);
      }
    } finally {
      if (loadMoreAbortRef.current && loadMoreAbortRef.current.signal === signal) {
        setLoadingMore(false);
      }
    }
  };

  return {
    // Search states
    username, setUsername,
    tag, setTag,
    extensions, loading, error,
    hasSearched, setHasSearched,
    page, hasMore, loadingMore,
    currentSearch,
    // Top repos
    topRepos, loadingTop,
    // Suggestions
    suggestions, showSuggestions, setShowSuggestions,
    suggestLoading, searchContainerRef,
    // Tags
    popularTags,
    // Actions
    handleSearch, loadMore,
  };
}
