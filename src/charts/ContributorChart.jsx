import React, { useMemo, useRef } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { Card, CardContent, Box, Typography, Button, Avatar, Chip, Tooltip } from '@mui/material';
import GroupRoundedIcon from '@mui/icons-material/GroupRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
import { getContributorChartOptions } from '../utils/chartUtils';

const ContributorChart = ({
  normalizedContributors = [],
  normalizedTotal = [],
  selectedMetric = 'commits',
}) => {
  const chartComponentRef = useRef(null);

  const chartOptions = useMemo(() => {
    return getContributorChartOptions(normalizedContributors, normalizedTotal, selectedMetric);
  }, [normalizedContributors, normalizedTotal, selectedMetric]);

  const handleShowAll = () => {
    const chart = chartComponentRef.current?.chart;
    if (chart && chart.series) {
      chart.series.forEach((s) => s.setVisible(true, false));
      chart.redraw();
    }
  };

  const handleHideAll = () => {
    const chart = chartComponentRef.current?.chart;
    if (chart && chart.series) {
      chart.series.forEach((s) => s.setVisible(false, false));
      chart.redraw();
    }
  };

  const hasData = normalizedContributors && normalizedContributors.length > 0;

  return (
    <Card
      elevation={0}
      sx={{
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: 3,
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        overflow: 'hidden',
      }}
    >
      <CardContent sx={{ p: { xs: 2, sm: 3 }, '&:last-child': { pb: { xs: 2, sm: 3 } } }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
            gap: 1.5,
            mb: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 38,
                height: 38,
                borderRadius: 2,
                backgroundColor: '#f5f3ff',
                color: '#7c3aed',
              }}
            >
              <GroupRoundedIcon />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b', fontSize: '1.1rem' }}>
                Individual Contributor Activity
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748b' }}>
                Multi-line weekly contribution breakdown. Click any legend item to toggle their line.
              </Typography>
            </Box>
          </Box>

          {hasData && (
            <Box sx={{ display: 'flex', gap: 1, alignSelf: { xs: 'flex-end', sm: 'center' } }}>
              <Button
                size="small"
                variant="outlined"
                onClick={handleShowAll}
                startIcon={<VisibilityRoundedIcon fontSize="small" />}
                sx={{
                  textTransform: 'none',
                  fontSize: '0.78rem',
                  py: 0.4,
                  px: 1.2,
                  borderRadius: 1.5,
                  color: '#475569',
                  borderColor: '#cbd5e1',
                }}
              >
                Show All
              </Button>
              <Button
                size="small"
                variant="outlined"
                onClick={handleHideAll}
                startIcon={<VisibilityOffRoundedIcon fontSize="small" />}
                sx={{
                  textTransform: 'none',
                  fontSize: '0.78rem',
                  py: 0.4,
                  px: 1.2,
                  borderRadius: 1.5,
                  color: '#475569',
                  borderColor: '#cbd5e1',
                }}
              >
                Hide All
              </Button>
            </Box>
          )}
        </Box>

        {/* Top Contributors Pill Bar */}
        {hasData && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 1,
              mb: 2,
              p: 1.5,
              backgroundColor: '#f8fafc',
              borderRadius: 2,
              border: '1px solid #f1f5f9',
            }}
          >
            <Typography variant="caption" sx={{ fontWeight: 600, color: '#475569', mr: 0.5 }}>
              Top Contributors:
            </Typography>
            {normalizedContributors.slice(0, 8).map((c) => (
              <Chip
                key={c.login}
                avatar={<Avatar alt={c.login} src={c.avatarUrl} />}
                label={`${c.login} (${c.total} total)`}
                size="small"
                component="a"
                href={c.htmlUrl || `https://github.com/${c.login}`}
                target="_blank"
                rel="noopener noreferrer"
                clickable
                sx={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  color: '#334155',
                  fontSize: '0.75rem',
                  '&:hover': {
                    backgroundColor: '#eff6ff',
                    borderColor: '#93c5fd',
                  },
                }}
              />
            ))}
          </Box>
        )}

        {hasData ? (
          <Box sx={{ width: '100%', minHeight: 420 }}>
            <HighchartsReact
              highcharts={Highcharts}
              options={chartOptions}
              ref={chartComponentRef}
            />
          </Box>
        ) : (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: 240,
              backgroundColor: '#f8fafc',
              borderRadius: 2,
              color: '#64748b',
              textAlign: 'center',
              p: 3,
            }}
          >
            <Typography variant="body2">
              No contributor statistics available for this repository yet.
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default ContributorChart;

