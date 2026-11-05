import React, { useMemo } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { Card, CardContent, Box, Typography } from '@mui/material';
import BarChartRoundedIcon from '@mui/icons-material/BarChartRounded';
import { getTotalActivityChartOptions } from '../utils/chartUtils';

const TotalActivityChart = ({ normalizedTotal = [], selectedMetric = 'commits' }) => {
  const chartOptions = useMemo(() => {
    return getTotalActivityChartOptions(normalizedTotal, selectedMetric);
  }, [normalizedTotal, selectedMetric]);

  const hasData = normalizedTotal && normalizedTotal.length > 0;

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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 38,
              height: 38,
              borderRadius: 2,
              backgroundColor: '#eff6ff',
              color: '#2563eb',
            }}
          >
            <BarChartRoundedIcon />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b', fontSize: '1.1rem' }}>
              Total Weekly Activity
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748b' }}>
              Aggregate development volume over time across the entire repository
            </Typography>
          </Box>
        </Box>

        {hasData ? (
          <Box sx={{ width: '100%', minHeight: 380 }}>
            <HighchartsReact highcharts={Highcharts} options={chartOptions} />
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
              No weekly total activity recorded for this repository yet.
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default TotalActivityChart;
