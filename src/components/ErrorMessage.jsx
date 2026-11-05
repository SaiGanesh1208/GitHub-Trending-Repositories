import React from 'react';
import { Alert, AlertTitle, Box, Button, Typography } from '@mui/material';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import VpnKeyRoundedIcon from '@mui/icons-material/VpnKeyRounded';

const ErrorMessage = ({
  error,
  onRetry,
  onOpenTokenDialog,
  severity = 'error',
  title = 'Something went wrong',
}) => {
  if (!error) return null;

  const errorMessage = typeof error === 'string' ? error : error.message || 'An unexpected error occurred.';
  const isRateLimit = errorMessage.toLowerCase().includes('rate limit');

  return (
    <Alert
      severity={isRateLimit ? 'warning' : severity}
      sx={{
        borderRadius: 2.5,
        border: '1px solid',
        borderColor: isRateLimit ? '#fed7aa' : '#fecaca',
        backgroundColor: isRateLimit ? '#fffbeb' : '#fef2f2',
        color: '#1e293b',
        p: 2,
        my: 2,
        '& .MuiAlert-icon': {
          color: isRateLimit ? '#d97706' : '#dc2626',
        },
      }}
      action={
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          {isRateLimit && onOpenTokenDialog && (
            <Button
              color="inherit"
              size="small"
              onClick={onOpenTokenDialog}
              startIcon={<VpnKeyRoundedIcon />}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                color: '#b45309',
                border: '1px solid #fde68a',
                borderRadius: 1.5,
                px: 1.5,
              }}
            >
              Add Token
            </Button>
          )}
          {onRetry && (
            <Button
              color="inherit"
              size="small"
              onClick={onRetry}
              startIcon={<RefreshRoundedIcon />}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: 1.5,
                px: 1.5,
              }}
            >
              Retry
            </Button>
          )}
        </Box>
      }
    >
      <AlertTitle sx={{ fontWeight: 600, color: isRateLimit ? '#92400e' : '#991b1b', mb: 0.5 }}>
        {isRateLimit ? 'GitHub Rate Limit Exceeded' : title}
      </AlertTitle>
      <Typography variant="body2" sx={{ color: isRateLimit ? '#78350f' : '#7f1d1d' }}>
        {errorMessage}
      </Typography>
    </Alert>
  );
};

export default ErrorMessage;

