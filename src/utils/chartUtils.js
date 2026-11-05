import { formatUnixWeekDate } from './dateUtils.js';

/**
 * Metric options definition
 */
export const METRIC_OPTIONS = [
  { value: 'commits', label: 'Commits', color: '#2563eb' },
  { value: 'additions', label: 'Additions', color: '#16a34a' },
  { value: 'deletions', label: 'Deletions', color: '#dc2626' },
];

/**
 * Normalizes and aligns weekly development statistics from GitHub endpoints:
 * - code_frequency: [ [timestamp, additions, deletions], ... ]
 * - commit_activity: [ { week: timestamp, total: number, days: [...] }, ... ]
 * - contributors: [ { author: { login, avatar_url }, total, weeks: [ { w, a, d, c }, ... ] }, ... ]
 *
 * @param {Array} codeFrequency - Code frequency data from GitHub
 * @param {Array} commitActivity - Commit activity data from GitHub
 * @param {Array} contributors - Contributor data from GitHub
 * @returns {{ timeline: Array, normalizedTotal: Array, normalizedContributors: Array }}
 */
export const normalizeAnalyticsData = (codeFrequency = [], commitActivity = [], contributors = []) => {
  // 1. Gather all unique week timestamps across all data sources
  const weekTimestampsSet = new Set();

  if (Array.isArray(codeFrequency)) {
    codeFrequency.forEach((item) => {
      if (Array.isArray(item) && item[0]) {
        weekTimestampsSet.add(item[0]);
      }
    });
  }

  if (Array.isArray(commitActivity)) {
    commitActivity.forEach((item) => {
      if (item && item.week) {
        weekTimestampsSet.add(item.week);
      }
    });
  }

  if (Array.isArray(contributors)) {
    contributors.forEach((contrib) => {
      if (contrib && Array.isArray(contrib.weeks)) {
        contrib.weeks.forEach((w) => {
          if (w && w.w) {
            weekTimestampsSet.add(w.w);
          }
        });
      }
    });
  }

  // Sort timestamps chronologically ascending
  const sortedTimestamps = Array.from(weekTimestampsSet).sort((a, b) => a - b);

  // If there are too many weeks (e.g. 52 weeks or 5 years), let's keep the last 52 weeks (1 year)
  // as per PRD FR-07: "Display the latest available year of activity"
  const relevantTimestamps = sortedTimestamps.length > 52 
    ? sortedTimestamps.slice(-52) 
    : sortedTimestamps;

  // 2. Build lookup maps for fast access
  const codeFreqMap = new Map();
  if (Array.isArray(codeFrequency)) {
    codeFrequency.forEach((item) => {
      if (Array.isArray(item) && item.length >= 3) {
        codeFreqMap.set(item[0], {
          additions: item[1] || 0,
          deletions: Math.abs(item[2] || 0), // Convert negative deletions to positive
        });
      }
    });
  }

  const commitActivityMap = new Map();
  if (Array.isArray(commitActivity)) {
    commitActivity.forEach((item) => {
      if (item && item.week) {
        commitActivityMap.set(item.week, item.total || 0);
      }
    });
  }

  // 3. Build normalized total weekly data aligned with relevant timestamps
  const normalizedTotal = relevantTimestamps.map((timestamp) => {
    const codeData = codeFreqMap.get(timestamp);
    const commitCount = commitActivityMap.get(timestamp);

    // If code frequency or commit activity is missing, we check if contributor data can supply it
    let additions = codeData ? codeData.additions : 0;
    let deletions = codeData ? codeData.deletions : 0;
    let commits = commitCount !== undefined ? commitCount : 0;

    // Fallback if code_frequency endpoint was empty or 0 but contributors had data
    if ((!codeData || (additions === 0 && deletions === 0)) && Array.isArray(contributors)) {
      let contribAdd = 0;
      let contribDel = 0;
      contributors.forEach((c) => {
        const foundWeek = c.weeks?.find((w) => w.w === timestamp);
        if (foundWeek) {
          contribAdd += foundWeek.a || 0;
          contribDel += Math.abs(foundWeek.d || 0);
        }
      });
      if (contribAdd > 0 || contribDel > 0) {
        additions = contribAdd;
        deletions = contribDel;
      }
    }

    // Fallback if commitActivity endpoint was 0 or undefined but contributors had data
    if (commits === 0 && Array.isArray(contributors)) {
      let contribCommits = 0;
      contributors.forEach((c) => {
        const foundWeek = c.weeks?.find((w) => w.w === timestamp);
        if (foundWeek) {
          contribCommits += foundWeek.c || 0;
        }
      });
      if (contribCommits > 0) {
        commits = contribCommits;
      }
    }

    return {
      week: timestamp,
      date: formatUnixWeekDate(timestamp, true),
      shortDate: formatUnixWeekDate(timestamp, false),
      commits,
      additions,
      deletions,
    };
  });

  // 4. Build normalized contributor weekly data
  const normalizedContributors = [];
  if (Array.isArray(contributors)) {
    // Sort contributors by total contributions descending and take top 10 (or all if <= 10)
    const sortedContributors = [...contributors].sort((a, b) => (b.total || 0) - (a.total || 0));

    sortedContributors.forEach((contrib) => {
      if (!contrib || !contrib.author) return;

      const weekMap = new Map();
      if (Array.isArray(contrib.weeks)) {
        contrib.weeks.forEach((w) => {
          if (w && w.w) {
            weekMap.set(w.w, {
              commits: w.c || 0,
              additions: w.a || 0,
              deletions: Math.abs(w.d || 0),
            });
          }
        });
      }

      const weeksData = relevantTimestamps.map((timestamp) => {
        const weekEntry = weekMap.get(timestamp);
        return {
          week: timestamp,
          date: formatUnixWeekDate(timestamp, true),
          shortDate: formatUnixWeekDate(timestamp, false),
          commits: weekEntry ? weekEntry.commits : 0,
          additions: weekEntry ? weekEntry.additions : 0,
          deletions: weekEntry ? weekEntry.deletions : 0,
        };
      });

      normalizedContributors.push({
        login: contrib.author.login || 'Unknown',
        avatarUrl: contrib.author.avatar_url || '',
        htmlUrl: contrib.author.html_url || '',
        total: contrib.total || 0,
        weeks: weeksData,
      });
    });
  }

  return {
    timeline: relevantTimestamps,
    normalizedTotal,
    normalizedContributors,
  };
};

/**
 * Palette of distinct colors for contributor lines
 */
export const CONTRIBUTOR_COLORS = [
  '#2563eb', // Blue
  '#16a34a', // Green
  '#d97706', // Amber
  '#9333ea', // Purple
  '#db2777', // Pink
  '#0891b2', // Cyan
  '#ea580c', // Orange
  '#4f46e5', // Indigo
  '#059669', // Emerald
  '#e11d48', // Rose
  '#84cc16', // Lime
  '#6366f1', // Violet
];

/**
 * Creates Highcharts configuration for Total Activity Chart
 * @param {Array} normalizedTotal - Array of weekly totals
 * @param {string} selectedMetric - 'commits' | 'additions' | 'deletions'
 * @returns {object} Highcharts options
 */
export const getTotalActivityChartOptions = (normalizedTotal = [], selectedMetric = 'commits') => {
  const categories = normalizedTotal.map((item) => item.shortDate);
  const data = normalizedTotal.map((item) => item[selectedMetric] || 0);

  const metricMeta = METRIC_OPTIONS.find((m) => m.value === selectedMetric) || METRIC_OPTIONS[0];

  return {
    chart: {
      type: 'column',
      backgroundColor: 'transparent',
      style: {
        fontFamily: 'Inter, Roboto, sans-serif',
      },
      height: 380,
    },
    title: {
      text: `Total Weekly ${metricMeta.label}`,
      align: 'left',
      style: {
        fontSize: '18px',
        fontWeight: '600',
        color: '#1e293b',
      },
    },
    subtitle: {
      text: `Aggregate ${metricMeta.label.toLowerCase()} across all contributors per week`,
      align: 'left',
      style: {
        fontSize: '13px',
        color: '#64748b',
      },
    },
    credits: {
      enabled: false,
    },
    xAxis: {
      categories,
      crosshair: {
        enabled: true,
        color: 'rgba(0, 0, 0, 0.05)',
      },
      labels: {
        rotation: -45,
        style: {
          fontSize: '11px',
          color: '#64748b',
        },
        step: Math.ceil(categories.length / 15) || 1,
      },
      lineColor: '#e2e8f0',
      tickColor: '#e2e8f0',
    },
    yAxis: {
      min: 0,
      title: {
        text: `${metricMeta.label} Count`,
        style: {
          color: '#475569',
          fontWeight: '500',
        },
      },
      gridLineColor: '#f1f5f9',
      labels: {
        style: {
          color: '#64748b',
        },
      },
    },
    legend: {
      enabled: false,
    },
    tooltip: {
      useHTML: true,
      backgroundColor: '#1e293b',
      borderRadius: 8,
      borderWidth: 0,
      shadow: true,
      style: {
        color: '#f8fafc',
      },
      formatter: function () {
        const item = normalizedTotal[this.point.index];
        const dateStr = item ? item.date : this.x;
        return `
          <div style="padding: 6px 10px; font-family: inherit;">
            <div style="font-size: 11px; color: #94a3b8; margin-bottom: 4px;">Week: ${dateStr}</div>
            <div style="font-size: 14px; font-weight: 600; color: #fff;">
              <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background-color:${metricMeta.color};margin-right:6px;"></span>
              Total ${metricMeta.label}: ${this.y.toLocaleString()}
            </div>
          </div>
        `;
      },
    },
    plotOptions: {
      column: {
        borderRadius: 4,
        color: metricMeta.color,
        borderWidth: 0,
        maxPointWidth: 32,
      },
    },
    series: [
      {
        name: `Total ${metricMeta.label}`,
        data,
      },
    ],
  };
};

/**
 * Creates Highcharts configuration for Contributor Activity Chart
 * @param {Array} normalizedContributors - Array of contributor data
 * @param {Array} normalizedTotal - For categories / timeline
 * @param {string} selectedMetric - 'commits' | 'additions' | 'deletions'
 * @returns {object} Highcharts options
 */
export const getContributorChartOptions = (
  normalizedContributors = [],
  normalizedTotal = [],
  selectedMetric = 'commits'
) => {
  const categories = normalizedTotal.map((item) => item.shortDate);
  const metricMeta = METRIC_OPTIONS.find((m) => m.value === selectedMetric) || METRIC_OPTIONS[0];

  const series = normalizedContributors.map((contrib, idx) => {
    const color = CONTRIBUTOR_COLORS[idx % CONTRIBUTOR_COLORS.length];
    const data = contrib.weeks.map((w) => w[selectedMetric] || 0);

    return {
      name: contrib.login,
      data,
      color,
      avatarUrl: contrib.avatarUrl,
      visible: idx < 6, // Show top 6 by default to keep the chart clean, others can be toggled
    };
  });

  return {
    chart: {
      type: 'line',
      backgroundColor: 'transparent',
      style: {
        fontFamily: 'Inter, Roboto, sans-serif',
      },
      height: 420,
    },
    title: {
      text: `Contributor ${metricMeta.label} Activity`,
      align: 'left',
      style: {
        fontSize: '18px',
        fontWeight: '600',
        color: '#1e293b',
      },
    },
    subtitle: {
      text: `Weekly breakdown per individual contributor (click legend to toggle contributors)`,
      align: 'left',
      style: {
        fontSize: '13px',
        color: '#64748b',
      },
    },
    credits: {
      enabled: false,
    },
    xAxis: {
      categories,
      crosshair: {
        enabled: true,
        color: 'rgba(0, 0, 0, 0.05)',
      },
      labels: {
        rotation: -45,
        style: {
          fontSize: '11px',
          color: '#64748b',
        },
        step: Math.ceil(categories.length / 15) || 1,
      },
      lineColor: '#e2e8f0',
      tickColor: '#e2e8f0',
    },
    yAxis: {
      min: 0,
      title: {
        text: `${metricMeta.label} Count`,
        style: {
          color: '#475569',
          fontWeight: '500',
        },
      },
      gridLineColor: '#f1f5f9',
      labels: {
        style: {
          color: '#64748b',
        },
      },
    },
    legend: {
      enabled: true,
      layout: 'horizontal',
      align: 'center',
      verticalAlign: 'bottom',
      itemStyle: {
        color: '#334155',
        fontSize: '12px',
        fontWeight: '500',
      },
      itemHoverStyle: {
        color: '#0f172a',
      },
      itemHiddenStyle: {
        color: '#cbd5e1',
      },
    },
    tooltip: {
      useHTML: true,
      backgroundColor: '#1e293b',
      borderRadius: 8,
      borderWidth: 0,
      shadow: true,
      style: {
        color: '#f8fafc',
      },
      formatter: function () {
        const item = normalizedTotal[this.point.index];
        const dateStr = item ? item.date : this.x;
        const color = this.series.color;
        return `
          <div style="padding: 6px 10px; font-family: inherit;">
            <div style="font-size: 11px; color: #94a3b8; margin-bottom: 4px;">Week: ${dateStr}</div>
            <div style="font-size: 13px; font-weight: 600; color: #fff; margin-bottom: 2px;">
              <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background-color:${color};margin-right:6px;"></span>
              Contributor: ${this.series.name}
            </div>
            <div style="font-size: 12px; color: #cbd5e1;">
              ${metricMeta.label}: <strong>${this.y.toLocaleString()}</strong>
            </div>
          </div>
        `;
      },
    },
    plotOptions: {
      line: {
        lineWidth: 2.5,
        marker: {
          radius: 3,
          symbol: 'circle',
        },
        states: {
          hover: {
            lineWidth: 3.5,
          },
        },
      },
    },
    series,
  };
};
