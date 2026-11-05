import React from 'react';
import { Box, ToggleButton, ToggleButtonGroup, Typography, Chip } from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { calculateStartDate, FILTER_PERIODS, formatDate } from '../utils/dateUtils';

const DateFilter = ({ selectedPeriod, onPeriodChange, disabled = false }) => {
  const handlePeriodChange = (event, newPeriod) => {
    if (newPeriod !== null && newPeriod !== selectedPeriod) {
      onPeriodChange(newPeriod);
    }
  };

  const currentCutoffDate = calculateStartDate(selectedPeriod);
  const formattedCutoff = formatDate(currentCutoffDate);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { xs: 'flex-start', sm: 'center' },
        justifyContent: 'space-between',
        gap: 2,
        p: { xs: 2, sm: 2.5 },
        backgroundColor: '#ffffff',
        borderRadius: 2,
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 36,
            height: 36,
            borderRadius: 1.5,
            backgroundColor: '#eff6ff',
            color: '#2563eb',
          }}
        >
          <CalendarMonthIcon fontSize="small" />
        </Box>
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1e293b' }}>
            Filter by Creation Date
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mt: 0.25 }}>
            <AccessTimeIcon sx={{ fontSize: '0.85rem', color: '#64748b' }} />
            <Typography variant="caption" sx={{ color: '#64748b' }}>
              Showing repos created since <strong>{formattedCutoff}</strong>
            </Typography>
          </Box>
        </Box>
      </Box>

      <ToggleButtonGroup
        value={selectedPeriod}
        exclusive
        onChange={handlePeriodChange}
        aria-label="repository creation period filter"
        size="small"
        disabled={disabled}
        sx={{
          backgroundColor: '#f8fafc',
          borderRadius: 2,
          p: 0.4,
          border: '1px solid #e2e8f0',
          '& .MuiToggleButtonGroup-grouped': {
            border: 0,
            mx: 0.3,
            borderRadius: 1.5,
            textTransform: 'none',
            fontWeight: 500,
            fontSize: '0.85rem',
            px: { xs: 1.5, sm: 2 },
            py: 0.6,
            color: '#475569',
            '&.Mui-selected': {
              backgroundColor: '#2563eb',
              color: '#ffffff',
              fontWeight: 600,
              boxShadow: '0 1px 2px rgba(37, 99, 235, 0.2)',
              '&:hover': {
                backgroundColor: '#1d4ed8',
              },
            },
            '&:hover': {
              backgroundColor: '#e2e8f0',
            },
          },
        }}
      >
        {FILTER_PERIODS.map((period) => (
          <ToggleButton key={period.id} value={period.days} aria-label={period.label}>
            {period.label}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Box>
  );
};

export default DateFilter;
