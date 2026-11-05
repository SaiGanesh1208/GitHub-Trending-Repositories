import React from 'react';
import { Container, Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import SentimentDissatisfiedRoundedIcon from '@mui/icons-material/SentimentDissatisfiedRounded';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8fafc',
      }}
    >
      <Container maxWidth="sm" sx={{ textAlign: 'center', py: 6 }}>
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 80,
            height: 80,
            borderRadius: '50%',
            backgroundColor: '#eff6ff',
            color: '#2563eb',
            mb: 3,
          }}
        >
          <SentimentDissatisfiedRoundedIcon sx={{ fontSize: 44 }} />
        </Box>
        <Typography
          variant="h3"
          component="h1"
          sx={{ fontWeight: 800, color: '#0f172a', mb: 1, letterSpacing: '-0.02em' }}
        >
          404
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 600, color: '#334155', mb: 1.5 }}>
          Page Not Found
        </Typography>
        <Typography variant="body1" sx={{ color: '#64748b', mb: 4, maxWidth: 420, mx: 'auto' }}>
          The repository page you are looking for does not exist or may have been moved.
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate('/')}
          startIcon={<HomeRoundedIcon />}
          sx={{
            backgroundColor: '#2563eb',
            color: '#ffffff',
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: 2,
            px: 3,
            py: 1.2,
            '&:hover': {
              backgroundColor: '#1d4ed8',
            },
          }}
        >
          Back to Trending Repositories
        </Button>
      </Container>
    </Box>
  );
};

export default NotFound;

