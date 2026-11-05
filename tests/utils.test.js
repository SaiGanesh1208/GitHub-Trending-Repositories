import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateStartDate,
  formatUnixWeekDate,
  formatDate,
  formatNumber,
  FILTER_PERIODS,
} from '../src/utils/dateUtils.js';
import {
  normalizeAnalyticsData,
  getTotalActivityChartOptions,
  getContributorChartOptions,
  METRIC_OPTIONS,
} from '../src/utils/chartUtils.js';

test('dateUtils - calculateStartDate', () => {
  const fixedDate = new Date('2026-11-05T00:00:00Z');
  
  // 7 days back from Nov 5, 2026 -> Oct 29, 2026
  assert.equal(calculateStartDate(7, fixedDate), '2026-10-29');

  // 14 days back from Nov 5, 2026 -> Oct 22, 2026
  assert.equal(calculateStartDate(14, fixedDate), '2026-10-22');

  // 30 days back from Nov 5, 2026 -> Oct 6, 2026
  assert.equal(calculateStartDate(30, fixedDate), '2026-10-06');
});

test('dateUtils - formatUnixWeekDate', () => {
  // 1730592000 is 2024-11-03 00:00:00 UTC
  const formatted = formatUnixWeekDate(1730592000, true);
  assert.match(formatted, /November \d+, 2024/);

  const formattedShort = formatUnixWeekDate(1730592000, false);
  assert.match(formattedShort, /Nov \d+, 2024/);
});

test('dateUtils - formatNumber', () => {
  assert.equal(formatNumber(1250), '1,250');
  assert.equal(formatNumber(1000000), '1,000,000');
  assert.equal(formatNumber(0), '0');
  assert.equal(formatNumber(null), '0');
});

test('dateUtils - FILTER_PERIODS configuration', () => {
  assert.equal(FILTER_PERIODS.length, 3);
  assert.deepEqual(
    FILTER_PERIODS.map((p) => p.days),
    [7, 14, 30]
  );
});

test('chartUtils - normalizeAnalyticsData converts negative deletions and aligns data', () => {
  const mockCodeFreq = [
    [1730592000, 500, -100],
    [1731196800, 800, -200],
  ];

  const mockCommitActivity = [
    { week: 1730592000, total: 25, days: [5, 5, 5, 5, 5, 0, 0] },
    { week: 1731196800, total: 40, days: [10, 10, 10, 5, 5, 0, 0] },
  ];

  const mockContributors = [
    {
      author: { login: 'octocat', avatar_url: 'https://github.com/octocat.png' },
      total: 65,
      weeks: [
        { w: 1730592000, a: 300, d: -60, c: 15 },
        { w: 1731196800, a: 500, d: -120, c: 25 },
      ],
    },
    {
      author: { login: 'alice', avatar_url: 'https://github.com/alice.png' },
      total: 25,
      weeks: [
        { w: 1730592000, a: 200, d: -40, c: 10 },
        { w: 1731196800, a: 300, d: -80, c: 15 },
      ],
    },
  ];

  const { timeline, normalizedTotal, normalizedContributors } = normalizeAnalyticsData(
    mockCodeFreq,
    mockCommitActivity,
    mockContributors
  );

  assert.equal(timeline.length, 2);
  assert.equal(normalizedTotal.length, 2);
  
  // Verify week 1
  assert.equal(normalizedTotal[0].week, 1730592000);
  assert.equal(normalizedTotal[0].commits, 25);
  assert.equal(normalizedTotal[0].additions, 500);
  // FR-06: Convert negative deletion values into positive display counts
  assert.equal(normalizedTotal[0].deletions, 100);

  // Verify contributors
  assert.equal(normalizedContributors.length, 2);
  assert.equal(normalizedContributors[0].login, 'octocat');
  assert.equal(normalizedContributors[0].weeks[0].commits, 15);
  assert.equal(normalizedContributors[0].weeks[0].deletions, 60); // Positive
});

test('chartUtils - metric options definitions', () => {
  const metricValues = METRIC_OPTIONS.map((m) => m.value);
  assert.ok(metricValues.includes('commits'));
  assert.ok(metricValues.includes('additions'));
  assert.ok(metricValues.includes('deletions'));
});

test('chartUtils - Highcharts configuration generation', () => {
  const normalizedTotal = [
    { week: 1730592000, date: 'November 2, 2026', shortDate: 'Nov 2, 2026', commits: 50, additions: 200, deletions: 30 },
  ];
  const normalizedContributors = [
    {
      login: 'alice',
      avatarUrl: 'https://example.com/alice.png',
      weeks: [{ week: 1730592000, date: 'November 2, 2026', shortDate: 'Nov 2, 2026', commits: 50, additions: 200, deletions: 30 }],
    },
  ];

  const totalOptions = getTotalActivityChartOptions(normalizedTotal, 'commits');
  assert.equal(totalOptions.chart.type, 'column');
  assert.equal(totalOptions.series[0].data[0], 50);

  const contribOptions = getContributorChartOptions(normalizedContributors, normalizedTotal, 'commits');
  assert.equal(contribOptions.chart.type, 'line');
  assert.equal(contribOptions.series[0].name, 'alice');
  assert.equal(contribOptions.series[0].data[0], 50);
});

