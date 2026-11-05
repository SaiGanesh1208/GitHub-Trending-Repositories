import React from 'react';
import { Box, Card, CardContent, Skeleton, Typography, CircularProgress } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

/**
 * Skeleton loader for repository card rows
 */
export const RepositorySkeleton = () => (
  <Card
    elevation={0}
    sx={{
      backgroundColor: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: 2.5,
    }}
  >
    <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', md: 'center' },
          gap: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, width: '100%' }}>
          <Skeleton variant="rounded" width={48} height={48} sx={{ borderRadius: 2, flexShrink: 0 }} />
          <Box sx={{ width: '100%' }}>
            <Skeleton variant="text" width="40%" height={28} sx={{ mb: 0.5 }} />
            <Skeleton variant="text" width="25%" height={20} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="85%" height={20} sx={{ mb: 1.5 }} />
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Skeleton variant="rounded" width={80} height={24} sx={{ borderRadius: 4 }} />
              <Skeleton variant="rounded" width={90} height={24} sx={{ borderRadius: 4 }} />
              <Skeleton variant="rounded" width={110} height={24} sx={{ borderRadius: 4 }} />
            </Box>
          </Box>
        </Box>
      </Box>
    </CardContent>
  </Card>
);

/**
 * List of skeletons for initial page load
 */
export const RepositoryListSkeleton = ({ count = 5 }) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
    {Array.from({ length: count }).map((_, index) => (
      <RepositorySkeleton key={index} />
    ))}
  </Box>
);

/**
 * Loading indicator for infinite scroll at list bottom
 */
export const PaginationLoading = () => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 1.5,
      py: 4,
    }}
  >
    <CircularProgress size={24} sx={{ color: '#2563eb' }} />
    <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
      Loading more trending repositories...
    </Typography>
  </Box>
);

/**
 * Full page or section loader with custom message
 */
export const Loading = ({ message = 'Loading...', isPendingCalculation = false }) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 260,
      py: 6,
      textAlign: 'center',
    }}
  >
    <Box sx={{ position: 'relative', display: 'inline-flex', mb: 2.5 }}>
      <CircularProgress size={52} thickness={3.5} sx={{ color: '#2563eb' }} />
      {isPendingCalculation && (
        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <AutoAwesomeIcon sx={{ fontSize: 20, color: '#eab308' }} />
        </Box>
      )}
    </Box>
    <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', mb: 0.5 }}>
      {isPendingCalculation ? 'Compiling Repository Statistics' : message}
    </Typography>
    <Typography variant="body2" sx={{ color: '#64748b', maxWidth: 450 }}>
      {isPendingCalculation
        ? 'GitHub is compiling commit activity and contributor breakdown in the background (HTTP 202). We will automatically retry in a moment...'
        : 'Please wait while we communicate with the GitHub REST API.'}
    </Typography>
  </Box>
);

export default Loading;
