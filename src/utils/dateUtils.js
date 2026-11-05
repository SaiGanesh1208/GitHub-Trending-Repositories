/**
 * Date utility functions for GitHub Trending Repositories
 */

/**
 * Calculates the start date string (YYYY-MM-DD) based on the number of days back from today.
 * @param {number} days - Number of days to subtract (e.g., 7, 14, 30)
 * @param {Date} [baseDate=new Date()] - Reference date
 * @returns {string} Formatted date string YYYY-MM-DD
 */
export const calculateStartDate = (days, baseDate = new Date()) => {
  const targetDate = new Date(baseDate.getTime());
  targetDate.setDate(targetDate.getDate() - days);
  return targetDate.toISOString().split('T')[0];
};

/**
 * Formats a Unix timestamp (seconds) into a readable date string.
 * e.g., "Nov 2, 2026" or "November 2, 2026"
 * @param {number} unixTimestamp - Timestamp in seconds
 * @param {boolean} [longMonth=false] - Whether to use full month name
 * @returns {string} Formatted date string
 */
export const formatUnixWeekDate = (unixTimestamp, longMonth = false) => {
  if (!unixTimestamp) return '';
  // Convert seconds to milliseconds
  const date = new Date(unixTimestamp * 1000);
  return date.toLocaleDateString('en-US', {
    month: longMonth ? 'long' : 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
};

/**
 * Formats an ISO date string into a readable string (e.g., "Nov 5, 2026")
 * @param {string} isoString
 * @returns {string}
 */
export const formatDate = (isoString) => {
  if (!isoString) return 'N/A';
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

/**
 * Formats numbers into compact representations, e.g. 1.2k, 12,450
 * @param {number} num
 * @returns {string}
 */
export const formatNumber = (num) => {
  if (num === null || num === undefined) return '0';
  return new Intl.NumberFormat('en-US').format(num);
};

/**
 * Filter period definitions
 */
export const FILTER_PERIODS = [
  { id: 7, label: 'Last 1 Week', days: 7, description: 'Created in the past 7 days' },
  { id: 14, label: 'Last 2 Weeks', days: 14, description: 'Created in the past 14 days' },
  { id: 30, label: 'Last 1 Month', days: 30, description: 'Created in the past 30 days' },
];

