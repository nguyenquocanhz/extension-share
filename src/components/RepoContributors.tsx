import React, { useState, useEffect, useRef } from 'react';
import { Users } from 'lucide-react';
import { getHeaders, contributorsCache } from '../utils/github';
import type { GitHubContributor } from '../types';

interface RepoContributorsProps {
  url: string;
}

export default function RepoContributors({ url }: RepoContributorsProps) {
  const [contributors, setContributors] = useState<GitHubContributor[] | null>(() => {
    const cached = contributorsCache[url];
    return Array.isArray(cached) ? cached as GitHubContributor[] : null;
  });

  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Intersection Observer: Chỉ đánh dấu isVisible = true khi component lọt vào màn hình
  useEffect(() => {
    if (contributors) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '100px' }
    );

    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [contributors]);

  // Chỉ gọi API khi component đã visible trên màn hình
  useEffect(() => {
    if (!isVisible || contributors) return;

    let isMounted = true;
    const fetchContributors = async () => {
      if (!contributorsCache[url]) {
        contributorsCache[url] = fetch(`${url}?per_page=5`, { headers: getHeaders() })
          .then(res => res.ok ? res.json() : [])
          .catch(() => []);
      }

      const data = await (contributorsCache[url] as Promise<GitHubContributor[]>);
      contributorsCache[url] = data;

      if (isMounted) setContributors(data);
    };

    fetchContributors();
    return () => { isMounted = false; };
  }, [isVisible, url, contributors]);

  if (!contributors) return <div ref={containerRef} className="text-xs text-slate-500 mt-2 mb-4 animate-pulse h-6 flex items-center">Đang tải Contributors...</div>;
  if (contributors.length === 0) return <div ref={containerRef} className="mb-4 h-6"></div>;

  return (
    <div ref={containerRef} className="flex items-center gap-2 mt-2 mb-4 h-6">
      <span className="text-xs text-slate-500 flex items-center gap-1">
        <Users className="w-3 h-3" /> Contributors:
      </span>
      <div className="flex -space-x-2 overflow-hidden">
        {contributors.map(c => (
          <a key={c.id} href={c.html_url} target="_blank" rel="noreferrer" title={c.login}>
            <img
              className="inline-block h-6 w-6 rounded-full ring-2 ring-slate-800 hover:ring-blue-500 transition-all bg-slate-700"
              src={c.avatar_url}
              alt={c.login}
            />
          </a>
        ))}
      </div>
    </div>
  );
}
