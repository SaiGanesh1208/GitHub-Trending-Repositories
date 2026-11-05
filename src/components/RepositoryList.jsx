import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import SearchOffRoundedIcon from '@mui/icons-material/SearchOffRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import RepositoryCard from './RepositoryCard';

const RepositoryList = ({ repositories = [], onRetry }) => {
  if (repositories.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          py: 8,
          px: 3,
          backgroundColor: '#ffffff',
          borderRadius: 3,
          border: '1px dashed #cbd5e1',
          textAlign: 'center',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 64,
            height: 64,
            borderRadius: '50%',
            backgroundColor: '#f1f5f9',
            color: '#64748b',
            mb: 2,
          }}
        >
          <SearchOffRoundedIcon sx={{ fontSize: 36 }} />
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', mb: 0.5 }}>
          No trending repositories found
        </Typography>
        <Typography variant="body2" sx={{ color: '#64748b', maxWidth: 450, mb: 2.5 }}>
          No repositories matching the selected creation date filter were found, or the GitHub API returned no results.
        </Typography>
        {onRetry && (
          <Button
            variant="outlined"
            onClick={onRetry}
            startIcon={<RefreshRoundedIcon />}
            sx={{
              textTransform: 'none',
              borderRadius: 2,
              fontWeight: 500,
            }}
          >
            Retry Search
          </Button>
        )}
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {repositories.map((repo) => (
        <RepositoryCard key={repo.id} repository={repo} />
      ))}
    </Box>
  );
};

export default RepositoryList;
