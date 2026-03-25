import { useState, useEffect } from 'react';
import type { GitHubRepo } from '../types';

export default function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<GitHubRepo[]>(() => {
    try {
      const saved = localStorage.getItem('ext-bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('ext-bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  const toggleBookmark = (repo: GitHubRepo): void => {
    setBookmarks(prev => {
      if (prev.find(r => r.id === repo.id)) return prev.filter(r => r.id !== repo.id);
      return [...prev, repo];
    });
  };

  return { bookmarks, setBookmarks, toggleBookmark };
}
