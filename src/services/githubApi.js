import { calculateStartDate } from '../utils/dateUtils';

const BASE_URL = 'https://api.github.com';

/**
 * Custom error class for API errors
 */
export class GitHubApiError extends Error {
  constructor(message, status, resetTime = null, isRateLimit = false, isPending = false) {
    super(message);
    this.name = 'GitHubApiError';
    this.status = status;
    this.resetTime = resetTime;
    this.isRateLimit = isRateLimit;
    this.isPending = isPending;
  }
}

/**
 * Gets authentication headers if a token is configured
 * @returns {HeadersInit}
 */
const getHeaders = () => {
  const headers = {
    Accept: 'application/vnd.github.v3+json',
  };

  // Check Vite env var first, then localStorage
  const envToken = import.meta.env.VITE_GITHUB_TOKEN;
  const storedToken = typeof window !== 'undefined' ? localStorage.getItem('github_token') : null;
  const token = envToken || storedToken;

  if (token && token.trim()) {
    headers['Authorization'] = `Bearer ${token.trim()}`;
  }

  return headers;
};

/**
 * Generic fetch wrapper with GitHub-specific error handling
 * @param {string} endpoint
 * @param {RequestInit} [options={}]
 * @returns {Promise<any>}
 */
const apiFetch = async (endpoint, options = {}) => {
  const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...getHeaders(),
        ...options.headers,
      },
    });

    // 202 Accepted: GitHub is currently calculating statistics
    if (response.status === 202) {
      throw new GitHubApiError(
        'GitHub is currently calculating statistics for this repository. Retrying...',
        202,
        null,
        false,
        true
      );
    }

    // Rate limit check: 403 or 429
    if (response.status === 403 || response.status === 429) {
      const resetHeader = response.headers.get('x-ratelimit-reset');
      const resetDate = resetHeader ? new Date(parseInt(resetHeader, 10) * 1000) : null;
      const resetTimeStr = resetDate ? resetDate.toLocaleTimeString() : 'shortly';
      
      throw new GitHubApiError(
        `GitHub API rate limit exceeded. Resets at ${resetTimeStr}. You can add a GitHub token in the header to increase limits to 5,000 requests/hour.`,
        response.status,
        resetDate,
        true
      );
    }

    if (response.status === 404) {
      throw new GitHubApiError('The requested repository or resource was not found on GitHub.', 404);
    }

    if (!response.ok) {
      let errorMsg = `GitHub API error: ${response.status} ${response.statusText}`;
      try {
        const errorData = await response.json();
        if (errorData && errorData.message) {
          errorMsg = errorData.message;
        }
      } catch (_) {
        // Fallback to generic message
      }
      throw new GitHubApiError(errorMsg, response.status);
    }

    // 204 No Content
    if (response.status === 204) {
      return null;
    }

    return await response.json();
  } catch (error) {
    if (error instanceof GitHubApiError) {
      throw error;
    }
    // Network errors (offline, blocked, etc.)
    throw new GitHubApiError(
      error.message || 'Network error: Failed to connect to GitHub API. Please check your internet connection.',
      0
    );
  }
};

/**
 * Fetches trending repositories created within the given number of days.
 * @param {object} params
 * @param {number} [params.periodDays=7] - Number of days back (7, 14, 30)
 * @param {number} [params.page=1] - Page number
 * @param {number} [params.perPage=30] - Results per page (max 100)
 * @returns {Promise<{ items: Array, total_count: number }>}
 */
export const getRepositories = async ({ periodDays = 7, page = 1, perPage = 30 } = {}) => {
  const startDate = calculateStartDate(periodDays);
  const query = `created:>${startDate}`;
  const endpoint = `/search/repositories?q=${encodeURIComponent(query)}&sort=stars&order=desc&page=${page}&per_page=${perPage}`;
  return await apiFetch(endpoint);
};

/**
 * Fetches general details for a repository
 * @param {string} owner
 * @param {string} repo
 * @returns {Promise<object>}
 */
export const getRepositoryDetails = async (owner, repo) => {
  return await apiFetch(`/repos/${owner}/${repo}`);
};

/**
 * Fetches weekly code additions and deletions
 * Response format: [ [timestamp, additions, deletions], ... ]
 * @param {string} owner
 * @param {string} repo
 * @returns {Promise<Array<[number, number, number]>>}
 */
export const getCodeFrequency = async (owner, repo) => {
  return await apiFetch(`/repos/${owner}/${repo}/stats/code_frequency`);
};

/**
 * Fetches weekly commit activity (totals and days)
 * Response format: [ { "week": timestamp, "total": 120, "days": [...] } ]
 * @param {string} owner
 * @param {string} repo
 * @returns {Promise<Array<object>>}
 */
export const getCommitActivity = async (owner, repo) => {
  return await apiFetch(`/repos/${owner}/${repo}/stats/commit_activity`);
};

/**
 * Fetches contributor activity (weekly additions, deletions, commits per contributor)
 * @param {string} owner
 * @param {string} repo
 * @returns {Promise<Array<object>>}
 */
export const getContributors = async (owner, repo) => {
  return await apiFetch(`/repos/${owner}/${repo}/stats/contributors`);
};

/**
 * Token management helpers
 */
export const getStoredToken = () => {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem('github_token') || '';
};

export const saveToken = (token) => {
  if (typeof window === 'undefined') return;
  if (token && token.trim()) {
    localStorage.setItem('github_token', token.trim());
  } else {
    localStorage.removeItem('github_token');
  }
};
