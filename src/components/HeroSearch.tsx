import React, { type FormEvent } from 'react';
import { Search, Github, Hash, Loader2, Zap } from 'lucide-react';
import type { GitHubUser } from '../types';

interface HeroSearchProps {
  username: string;
  setUsername: (value: string) => void;
  tag: string;
  setTag: (value: string) => void;
  loading: boolean;
  handleSearch: (e?: FormEvent) => void;
  popularTags: string[];
  suggestions: GitHubUser[];
  showSuggestions: boolean;
  setShowSuggestions: (value: boolean) => void;
  suggestLoading: boolean;
  searchContainerRef: React.RefObject<HTMLDivElement>;
}

export default function HeroSearch({
  username, setUsername, tag, setTag,
  loading, handleSearch, popularTags,
  suggestions, showSuggestions, setShowSuggestions,
  suggestLoading, searchContainerRef
}: HeroSearchProps) {
  return (
    <section className="pt-16 pb-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto text-center border-b border-slate-800 w-full">
      <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-6">
        Kho lưu trữ <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Tiện ích mở rộng</span>
      </h1>

      <form onSubmit={handleSearch} className="max-w-3xl mx-auto mt-10">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Input Tag */}
          <div className="relative md:w-1/3">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Hash className="h-5 w-5 text-slate-500" />
            </div>
            <input
              type="text"
              value={tag}
              onChange={(e) => setTag(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
              placeholder="Để trống hoặc nhập Tag..."
              className="block w-full pl-10 pr-3 py-3 border border-slate-700 rounded-xl leading-5 bg-slate-800 text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>

          {/* Input Username */}
          <div className="relative flex-1" ref={searchContainerRef}>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Github className="h-5 w-5 text-slate-500" />
            </div>
            <input
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => { if (suggestions.length > 0 && !username.includes('/')) setShowSuggestions(true); }}
              placeholder="Tên Repo, Username hoặc Link GitHub..."
              className="block w-full pl-10 pr-10 py-3 border border-slate-700 rounded-xl leading-5 bg-slate-800 text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all relative z-10"
            />
            {suggestLoading && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none z-20">
                <Loader2 className="w-4 h-4 text-slate-500 animate-spin" />
              </div>
            )}

            {/* Autocomplete Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute z-50 w-full mt-2 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl overflow-hidden top-full left-0 text-left">
                <div className="max-h-60 overflow-y-auto">
                  <div className="px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider sticky top-0 bg-slate-800/95 backdrop-blur z-10 border-b border-slate-700/50">
                    Gợi ý người dùng
                  </div>
                  <div className="py-1">
                    {suggestions.map((user) => (
                      <button
                        key={user.id}
                        type="button"
                        onClick={() => {
                          setUsername(user.login);
                          setShowSuggestions(false);
                          setTimeout(() => document.getElementById('search-btn')?.click(), 100);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-700/50 transition-colors text-left"
                      >
                        <img src={user.avatar_url} alt={user.login} className="w-8 h-8 rounded-full bg-slate-700" />
                        <div>
                          <div className="text-sm font-medium text-slate-200">{user.login}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <button
            id="search-btn"
            type="submit"
            disabled={loading || !username.trim()}
            className="flex items-center justify-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold transition-all shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
            <span className="hidden sm:inline">Tìm</span>
          </button>
        </div>

        {/* Popular Tags & Tips */}
        <div className="flex flex-col items-center justify-center mt-6 gap-4">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="text-sm text-slate-500 mr-2">Tag phổ biến:</span>
            {popularTags.map(t => (
              <button
                key={t}
                type="button"
                onClick={() => setTag(t)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-all ${tag === t ? 'bg-blue-600/20 border-blue-500 text-blue-400' : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700 hover:text-white'}`}
              >
                #{t}
              </button>
            ))}
          </div>

          <div className="text-sm text-slate-400 bg-slate-800/50 border border-slate-700/50 px-4 py-2.5 rounded-xl flex flex-col md:flex-row items-center gap-2">
            <span className="flex items-center gap-1.5"><Zap className="w-4 h-4 text-yellow-400" /> <strong>Tìm nhanh:</strong> Dán trực tiếp Link GitHub để tải Repo. Ví dụ:</span>
            <button
              type="button"
              onClick={() => {
                setUsername('https://github.com/J2TEAM/vibe.j2team.org');
                setTimeout(() => document.getElementById('search-btn')?.click(), 100);
              }}
              className="text-blue-400 hover:text-blue-300 hover:underline transition-all truncate max-w-xs"
            >
              https://github.com/J2TEAM/vibe.j2team.org
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}
