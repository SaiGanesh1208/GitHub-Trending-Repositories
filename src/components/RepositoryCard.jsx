import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Chip,
  Button,
  IconButton,
  Tooltip,
} from '@mui/material';
import StarOutlineRoundedIcon from '@mui/icons-material/StarOutlineRounded';
import AdjustRoundedIcon from '@mui/icons-material/AdjustRounded';
import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded';
import BarChartRoundedIcon from '@mui/icons-material/BarChartRounded';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';
import CalendarTodayRoundedIcon from '@mui/icons-material/CalendarTodayRounded';
import { useNavigate } from 'react-router-dom';
import { formatDate, formatNumber } from '../utils/dateUtils';

// GitHub language colors mapping
const LANGUAGE_COLORS = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python: '#3572A5',
  Java: '#b07219',
  Go: '#00ADD8',
  Rust: '#dea584',
  'C++': '#f34b7d',
  C: '#555555',
  Ruby: '#701516',
  PHP: '#4F5D95',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
  Dart: '#00B4AB',
  Shell: '#89e051',
  Csharp: '#178600',
  'C#': '#178600',
};

const RepositoryCard = ({ repository }) => {
  const navigate = useNavigate();
  const [avatarError, setAvatarError] = useState(false);

  if (!repository) return null;

  const {
    name,
    full_name,
    description,
    stargazers_count,
    open_issues_count,
    language,
    created_at,
    html_url,
    owner = {},
  } = repository;

  const ownerLogin = owner.login || 'Unknown';
  const ownerAvatar = owner.avatar_url;

  const handleViewDetails = () => {
    navigate(`/repository/${ownerLogin}/${name}`, {
      state: { repository },
    });
  };

  const languageColor = language ? LANGUAGE_COLORS[language] || '#64748b' : null;

  return (
    <Card
      elevation={0}
      sx={{
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: 2.5,
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          borderColor: '#93c5fd',
          boxShadow: '0 4px 16px rgba(37, 99, 235, 0.08)',
          transform: 'translateY(-1px)',
        },
      }}
    >
      <CardContent sx={{ p: { xs: 2, sm: 2.5 }, '&:last-child': { pb: { xs: 2, sm: 2.5 } } }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', md: 'center' },
            gap: 2,
          }}
        >
          {/* Main Info */}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, flexGrow: 1, minWidth: 0 }}>
            {/* Avatar */}
            <Tooltip title={`Owner: @${ownerLogin}`}>
              <Avatar
                src={avatarError ? undefined : ownerAvatar}
                alt={ownerLogin}
                onError={() => setAvatarError(true)}
                sx={{
                  width: { xs: 44, sm: 48 },
                  height: { xs: 44, sm: 48 },
                  borderRadius: 2,
                  border: '1px solid #e2e8f0',
                  backgroundColor: '#f1f5f9',
                  color: '#475569',
                  flexShrink: 0,
                }}
              >
                <PersonOutlineRoundedIcon />
              </Avatar>
            </Tooltip>

            {/* Repo Details */}
            <Box sx={{ minWidth: 0, flexGrow: 1 }}>
              {/* Repo Name & Owner */}
              <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                <Typography
                  component="span"
                  onClick={handleViewDetails}
                  sx={{
                    fontWeight: 700,
                    fontSize: { xs: '1rem', sm: '1.15rem' },
                    color: '#0969da',
                    cursor: 'pointer',
                    '&:hover': { textDecoration: 'underline' },
                    wordBreak: 'break-word',
                  }}
                >
                  {name}
                </Typography>
                <Typography
                  component="span"
                  variant="caption"
                  sx={{ color: '#64748b', fontSize: '0.8rem' }}
                >
                  ({full_name || `${ownerLogin}/${name}`})
                </Typography>
              </Box>

              {/* Owner Subtitle */}
              <Typography
                variant="body2"
                sx={{
                  color: '#475569',
                  fontSize: '0.85rem',
                  mb: 0.8,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                }}
              >
                by <strong>@{ownerLogin}</strong>
              </Typography>

              {/* Description */}
              <Typography
                variant="body2"
                sx={{
                  color: description ? '#334155' : '#94a3b8',
                  fontStyle: description ? 'normal' : 'italic',
                  fontSize: '0.9rem',
                  lineHeight: 1.5,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  mb: 1.5,
                }}
              >
                {description || 'No description provided.'}
              </Typography>

              {/* Metadata Badges */}
              <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1.2 }}>
                {/* Language */}
                {language && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
                    <Box
                      sx={{
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        backgroundColor: languageColor,
                        display: 'inline-block',
                      }}
                    />
                    <Typography variant="caption" sx={{ color: '#475569', fontWeight: 500 }}>
                      {language}
                    </Typography>
                  </Box>
                )}

                {/* Stars Chip */}
                <Chip
                  icon={<StarOutlineRoundedIcon sx={{ fontSize: '1rem !important', color: '#eab308' }} />}
                  label={`${formatNumber(stargazers_count)} stars`}
                  size="small"
                  sx={{
                    backgroundColor: '#fefce8',
                    color: '#854d0e',
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    border: '1px solid #fef08a',
                  }}
                />

                {/* Issues Chip */}
                <Chip
                  icon={<AdjustRoundedIcon sx={{ fontSize: '0.95rem !important', color: '#10b981' }} />}
                  label={`${formatNumber(open_issues_count)} issues`}
                  size="small"
                  sx={{
                    backgroundColor: '#f0fdf4',
                    color: '#166534',
                    fontWeight: 500,
                    fontSize: '0.75rem',
                    border: '1px solid #bbf7d0',
                  }}
                />

                {/* Created Date */}
                {created_at && (
                  <Chip
                    icon={<CalendarTodayRoundedIcon sx={{ fontSize: '0.85rem !important', color: '#64748b' }} />}
                    label={`Created ${formatDate(created_at)}`}
                    size="small"
                    sx={{
                      backgroundColor: '#f8fafc',
                      color: '#64748b',
                      fontSize: '0.75rem',
                      border: '1px solid #e2e8f0',
                    }}
                  />
                )}
              </Box>
            </Box>
          </Box>

          {/* Action Buttons */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              width: { xs: '100%', md: 'auto' },
              justifyContent: { xs: 'flex-end', md: 'center' },
              flexShrink: 0,
            }}
          >
            <Tooltip title="View on GitHub">
              <IconButton
                component="a"
                href={html_url}
                target="_blank"
                rel="noopener noreferrer"
                size="small"
                sx={{
                  color: '#64748b',
                  border: '1px solid #e2e8f0',
                  borderRadius: 2,
                  p: 0.9,
                  '&:hover': {
                    color: '#0f172a',
                    backgroundColor: '#f1f5f9',
                    borderColor: '#cbd5e1',
                  },
                }}
              >
                <OpenInNewRoundedIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <Button
              variant="contained"
              size="small"
              onClick={handleViewDetails}
              startIcon={<BarChartRoundedIcon />}
              sx={{
                backgroundColor: '#2563eb',
                color: '#ffffff',
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.85rem',
                borderRadius: 2,
                px: 2,
                py: 0.8,
                boxShadow: 'none',
                '&:hover': {
                  backgroundColor: '#1d4ed8',
                  boxShadow: '0 2px 8px rgba(37, 99, 235, 0.25)',
                },
              }}
            >
              View Analytics
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default RepositoryCard;
