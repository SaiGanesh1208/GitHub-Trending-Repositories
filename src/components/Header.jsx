import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Tooltip,
  Chip,
} from '@mui/material';
import KeyIcon from '@mui/icons-material/VpnKey';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import GitHubIcon from '@mui/icons-material/GitHub';
import { Link as RouterLink } from 'react-router-dom';
import { getStoredToken, saveToken } from '../services/githubApi';

const Header = () => {
  const [tokenDialogOpen, setTokenDialogOpen] = useState(false);
  const [tokenInput, setTokenInput] = useState(getStoredToken());
  const [hasToken, setHasToken] = useState(Boolean(getStoredToken() || import.meta.env.VITE_GITHUB_TOKEN));

  const handleOpenTokenDialog = () => {
    setTokenInput(getStoredToken());
    setTokenDialogOpen(true);
  };

  const handleCloseTokenDialog = () => {
    setTokenDialogOpen(false);
  };

  const handleSaveToken = () => {
    saveToken(tokenInput);
    setHasToken(Boolean(tokenInput.trim() || import.meta.env.VITE_GITHUB_TOKEN));
    setTokenDialogOpen(false);
    // Reload page to re-trigger API with updated token
    window.location.reload();
  };

  const handleClearToken = () => {
    saveToken('');
    setTokenInput('');
    setHasToken(Boolean(import.meta.env.VITE_GITHUB_TOKEN));
    setTokenDialogOpen(false);
    window.location.reload();
  };

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          backgroundColor: '#0d1117',
          borderBottom: '1px solid #30363d',
          color: '#f0f6fc',
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ minHeight: { xs: 56, sm: 64 }, py: 1 }}>
            <Box
              component={RouterLink}
              to="/"
              sx={{
                display: 'flex',
                alignItems: 'center',
                textDecoration: 'none',
                color: 'inherit',
                flexGrow: 1,
                gap: 1.5,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  backgroundColor: '#21262d',
                  border: '1px solid #30363d',
                }}
              >
                <GitHubIcon sx={{ fontSize: 26, color: '#f0f6fc' }} />
              </Box>
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography
                    variant="h6"
                    component="span"
                    sx={{
                      fontWeight: 700,
                      fontSize: { xs: '1.05rem', sm: '1.25rem' },
                      letterSpacing: '-0.02em',
                      color: '#ffffff',
                    }}
                  >
                    GitHub Trending
                  </Typography>
                  <Chip
                    size="small"
                    label="Analytics"
                    sx={{
                      backgroundColor: 'rgba(56, 139, 253, 0.15)',
                      color: '#58a6ff',
                      fontWeight: 600,
                      fontSize: '0.7rem',
                      height: 20,
                      border: '1px solid rgba(56, 139, 253, 0.4)',
                    }}
                  />
                </Box>
                <Typography
                  variant="caption"
                  sx={{
                    color: '#8b949e',
                    display: { xs: 'none', sm: 'block' },
                    fontSize: '0.75rem',
                  }}
                >
                  Discover & analyze recently created popular repositories
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Button
                component={RouterLink}
                to="/"
                startIcon={<TrendingUpIcon />}
                sx={{
                  color: '#c9d1d9',
                  textTransform: 'none',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  px: 1.5,
                  '&:hover': {
                    color: '#ffffff',
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  },
                }}
              >
                Trending
              </Button>

              <Tooltip title={hasToken ? 'GitHub Token Configured (5,000 req/hr)' : 'Configure GitHub Token (Rate limit helper)'}>
                <IconButton
                  onClick={handleOpenTokenDialog}
                  size="small"
                  sx={{
                    color: hasToken ? '#3fb950' : '#8b949e',
                    border: '1px solid',
                    borderColor: hasToken ? 'rgba(63, 185, 80, 0.4)' : '#30363d',
                    backgroundColor: hasToken ? 'rgba(63, 185, 80, 0.1)' : 'transparent',
                    p: 0.8,
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    },
                  }}
                >
                  <KeyIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* GitHub Token Config Dialog */}
      <Dialog
        open={tokenDialogOpen}
        onClose={handleCloseTokenDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: '#161b22',
            color: '#f0f6fc',
            border: '1px solid #30363d',
            borderRadius: 2,
          },
        }}
      >
        <DialogTitle sx={{ color: '#ffffff', fontWeight: 600 }}>
          GitHub API Token Settings
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: '#8b949e', mb: 2, fontSize: '0.9rem' }}>
            Unauthenticated GitHub API requests are limited to <strong>60 requests/hour</strong>.
            Adding a personal access token increases your rate limit to <strong>5,000 requests/hour</strong>.
            Your token is stored only locally in your browser session.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Personal Access Token (classic or fine-grained)"
            type="password"
            fullWidth
            variant="outlined"
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
            placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
            sx={{
              '& .MuiOutlinedInput-root': {
                color: '#f0f6fc',
                '& fieldset': { borderColor: '#30363d' },
                '&:hover fieldset': { borderColor: '#58a6ff' },
                '&.Mui-focused fieldset': { borderColor: '#58a6ff' },
              },
              '& .MuiInputLabel-root': { color: '#8b949e' },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          {tokenInput && (
            <Button onClick={handleClearToken} color="error" sx={{ mr: 'auto', textTransform: 'none' }}>
              Clear Token
            </Button>
          )}
          <Button onClick={handleCloseTokenDialog} sx={{ color: '#8b949e', textTransform: 'none' }}>
            Cancel
          </Button>
          <Button
            onClick={handleSaveToken}
            variant="contained"
            sx={{
              backgroundColor: '#238636',
              color: '#ffffff',
              textTransform: 'none',
              '&:hover': { backgroundColor: '#2ea043' },
            }}
          >
            Save Token
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Header;
