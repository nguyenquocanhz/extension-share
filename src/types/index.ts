// Shared TypeScript interfaces for the ExtenShare app

export interface GitHubUser {
  id: number;
  login: string;
  avatar_url: string;
  html_url: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  updated_at: string;
  default_branch: string;
  contributors_url: string;
  owner: GitHubUser;
}

export interface GitHubContributor {
  id: number;
  login: string;
  avatar_url: string;
  html_url: string;
  contributions: number;
}

export interface CurrentSearch {
  query: string;
  tag: string;
  isExactRepo: boolean;
  searchType: 'text' | 'user' | 'repo';
}
