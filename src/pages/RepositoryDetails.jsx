import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Box,
  Typography,
  Button,
  Avatar,
  Chip,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
  Alert,
  Breadcrumbs,
  Link,
} from '@mui/material';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded';
import StarOutlineRoundedIcon from '@mui/icons-material/StarOutlineRounded';
import AdjustRoundedIcon from '@mui/icons-material/AdjustRounded';
import ForkRightRoundedIcon from '@mui/icons-material/ForkRightRounded';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';
import CalendarTodayRoundedIcon from '@mui/icons-material/CalendarTodayRounded';
import InsightsRoundedIcon from '@mui/icons-material/InsightsRounded';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import TotalActivityChart from '../charts/TotalActivityChart';
import ContributorChart from '../charts/ContributorChart';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import {
  clearAnalytics,
  fetchAnalyticsRequest,
  setSelectedMetric,
} from '../redux/analytics/analyticsSlice';
import { normalizeAnalyticsData, METRIC_OPTIONS } from '../utils/chartUtils';
import { formatDate, formatNumber } from '../utils/dateUtils';

const RepositoryDetails = () => {
  const { owner, repo } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [avatarError, setAvatarError] = useState(false);

  // Redux state
  const {
    repository,
    codeFrequency,
    commitActivity,
    contributors,
    selectedMetric,
    loading,
    isPendingCalculation,
    error,
  } = useSelector((state) => state.analytics);

  // Optional repo passed from navigation state
  const navRepoData = location.state?.repository;

  useEffect(() => {
    if (owner && repo) {
      dispatch(
        fetchAnalyticsRequest({
          owner,
          repo,
          repositoryData: navRepoData,
        })
      );
    }

    return () => {
      dispatch(clearAnalytics());
    };
  }, [dispatch, owner, repo, navRepoData]);

  const handleMetricChange = (event) => {
    dispatch(setSelectedMetric(event.target.value));
  };

  const handleRetry = () => {
    dispatch(
      fetchAnalyticsRequest({
        owner,
        repo,
        repositoryData: navRepoData,
      })
    );
  };

  // Process and align data for Highcharts
  const { normalizedTotal, normalizedContributors } = useMemo(() => {
    return normalizeAnalyticsData(codeFrequency, commitActivity, contributors);
  }, [codeFrequency, commitActivity, contributors]);

  const activeRepo = repository || navRepoData;
  const ownerAvatar = activeRepo?.owner?.avatar_url;
  const ownerLogin = activeRepo?.owner?.login || owner;
  const repoName = activeRepo?.name || repo;
  const repoFullName = activeRepo?.full_name || `${owner}/${repo}`;

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f8fafc' }}>
      <Container maxWidth="lg" sx={{ py: { xs: 3, sm: 4 }, flexGrow: 1 }}>
        {/* Navigation / Breadcrumb Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/')}
            startIcon={<ArrowBackRoundedIcon />}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              borderRadius: 2,
              color: '#334155',
              borderColor: '#cbd5e1',
              backgroundColor: '#ffffff',
              '&:hover': {
                backgroundColor: '#f1f5f9',
                borderColor: '#94a3b8',
              },
            }}
          >
            Back to Trending
          </Button>

          <Breadcrumbs aria-label="breadcrumb" sx={{ display: { xs: 'none', sm: 'block' } }}>
            <Link
              underline="hover"
              color="inherit"
              onClick={() => navigate('/')}
              sx={{ cursor: 'pointer', fontSize: '0.85rem' }}
            >
              Trending
            </Link>
            <Typography color="text.primary" sx={{ fontSize: '0.85rem', fontWeight: 600 }}>
              {repoFullName}
            </Typography>
          </Breadcrumbs>
        </Box>

        {/* Error State */}
        {error && (
          <ErrorMessage
            error={error}
            onRetry={handleRetry}
            title="Failed to Load Repository Analytics"
          />
        )}

        {/* Pending Calculation Notice (HTTP 202) */}
        {isPendingCalculation && (
          <Alert
            severity="info"
            icon={<AutoAwesomeIcon />}
            sx={{
              mb: 3,
              borderRadius: 2.5,
              border: '1px solid #bfdbfe',
              backgroundColor: '#eff6ff',
              color: '#1e3a8a',
            }}
          >
            GitHub is currently compiling activity statistics for <strong>{repoFullName}</strong>.
            The page will automatically update as data finishes calculating.
          </Alert>
        )}

        {/* Repository Overview Card */}
        {activeRepo && (
          <Card
            elevation={0}
            sx={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: 3,
              mb: 3.5,
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
            }}
          >
            <CardContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', md: 'row' },
                  justifyContent: 'space-between',
                  alignItems: { xs: 'flex-start', md: 'center' },
                  gap: 2.5,
                }}
              >
                {/* Repo Info */}
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2.5 }}>
                  <Avatar
                    src={avatarError ? undefined : ownerAvatar}
                    alt={ownerLogin}
                    onError={() => setAvatarError(true)}
                    sx={{
                      width: { xs: 54, sm: 64 },
                      height: { xs: 54, sm: 64 },
                      borderRadius: 2.5,
                      border: '1px solid #e2e8f0',
                      backgroundColor: '#f1f5f9',
                      color: '#475569',
                      flexShrink: 0,
                    }}
                  >
                    <PersonOutlineRoundedIcon sx={{ fontSize: 32 }} />
                  </Avatar>

                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                      <Typography
                        variant="h5"
                        component="h1"
                        sx={{
                          fontWeight: 700,
                          color: '#0f172a',
                          fontSize: { xs: '1.25rem', sm: '1.6rem' },
                        }}
                      >
                        {repoName}
                      </Typography>
                      <Chip
                        size="small"
                        label={`@${ownerLogin}`}
                        sx={{
                          backgroundColor: '#f1f5f9',
                          color: '#475569',
                          fontWeight: 500,
                          fontSize: '0.8rem',
                        }}
                      />
                    </Box>

                    <Typography
                      variant="body2"
                      sx={{
                        color: activeRepo.description ? '#475569' : '#94a3b8',
                        fontStyle: activeRepo.description ? 'normal' : 'italic',
                        mt: 0.8,
                        mb: 1.5,
                        maxWidth: 720,
                        lineHeight: 1.6,
                      }}
                    >
                      {activeRepo.description || 'No repository description provided.'}
                    </Typography>

                    {/* Meta stats chips */}
                    <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1.2 }}>
                      <Chip
                        icon={<StarOutlineRoundedIcon sx={{ fontSize: '1.05rem !important', color: '#eab308' }} />}
                        label={`${formatNumber(activeRepo.stargazers_count)} stars`}
                        size="small"
                        sx={{
                          backgroundColor: '#fefce8',
                          color: '#854d0e',
                          fontWeight: 600,
                          border: '1px solid #fef08a',
                        }}
                      />
                      <Chip
                        icon={<ForkRightRoundedIcon sx={{ fontSize: '1.05rem !important', color: '#6366f1' }} />}
                        label={`${formatNumber(activeRepo.forks_count || 0)} forks`}
                        size="small"
                        sx={{
                          backgroundColor: '#eef2ff',
                          color: '#4338ca',
                          fontWeight: 500,
                          border: '1px solid #c7d2fe',
                        }}
                      />
                      <Chip
                        icon={<AdjustRoundedIcon sx={{ fontSize: '1rem !important', color: '#10b981' }} />}
                        label={`${formatNumber(activeRepo.open_issues_count)} open issues`}
                        size="small"
                        sx={{
                          backgroundColor: '#f0fdf4',
                          color: '#166534',
                          fontWeight: 500,
                          border: '1px solid #bbf7d0',
                        }}
                      />
                      {activeRepo.language && (
                        <Chip
                          label={activeRepo.language}
                          size="small"
                          sx={{
                            backgroundColor: '#f8fafc',
                            color: '#334155',
                            fontWeight: 600,
                            border: '1px solid #e2e8f0',
                          }}
                        />
                      )}
                      {activeRepo.created_at && (
                        <Chip
                          icon={<CalendarTodayRoundedIcon sx={{ fontSize: '0.85rem !important', color: '#64748b' }} />}
                          label={`Created ${formatDate(activeRepo.created_at)}`}
                          size="small"
                          sx={{
                            backgroundColor: '#f8fafc',
                            color: '#64748b',
                            border: '1px solid #e2e8f0',
                          }}
                        />
                      )}
                    </Box>
                  </Box>
                </Box>

                {/* External GitHub Link */}
                <Button
                  component="a"
                  href={activeRepo.html_url || `https://github.com/${owner}/${repo}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="outlined"
                  endIcon={<OpenInNewRoundedIcon />}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 600,
                    borderRadius: 2,
                    color: '#0969da',
                    borderColor: '#bfdbfe',
                    backgroundColor: '#eff6ff',
                    px: 2,
                    py: 1,
                    alignSelf: { xs: 'flex-start', md: 'center' },
                    '&:hover': {
                      backgroundColor: '#dbeafe',
                      borderColor: '#93c5fd',
                    },
                  }}
                >
                  GitHub Repository
                </Button>
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Analytics Section Header & Metric Controls */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
            gap: 2,
            mb: 3,
            p: 2,
            backgroundColor: '#ffffff',
            borderRadius: 2.5,
            border: '1px solid #e2e8f0',
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
              <InsightsRoundedIcon />
            </Box>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1e293b' }}>
                Development Activity Analytics
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748b' }}>
                Select an activity metric to analyze weekly totals and individual contributors
              </Typography>
            </Box>
          </Box>

          {/* Metric Selector Dropdown (FR-09) */}
          <FormControl size="small" sx={{ minWidth: 200, width: { xs: '100%', sm: 'auto' } }}>
            <InputLabel id="metric-select-label" sx={{ fontWeight: 500, color: '#475569' }}>
              Activity Metric
            </InputLabel>
            <Select
              labelId="metric-select-label"
              id="metric-select"
              value={selectedMetric}
              label="Activity Metric"
              onChange={handleMetricChange}
              sx={{
                borderRadius: 2,
                backgroundColor: '#f8fafc',
                fontWeight: 600,
                color: '#1e293b',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#cbd5e1',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#94a3b8',
                },
              }}
            >
              {METRIC_OPTIONS.map((metric) => (
                <MenuItem key={metric.value} value={metric.value}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box
                      sx={{
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        backgroundColor: metric.color,
                      }}
                    />
                    <span>{metric.label}</span>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Loading Spinner for Analytics */}
        {loading && !activeRepo && (
          <Loading message="Loading repository and statistics..." isPendingCalculation={isPendingCalculation} />
        )}

        {/* Vertically Stacked Highcharts Graphs (FR-12) */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
          {/* Graph 1: Total Activity Chart (FR-10) */}
          <TotalActivityChart
            normalizedTotal={normalizedTotal}
            selectedMetric={selectedMetric}
          />

          {/* Graph 2: Contributor Activity Chart (FR-11) */}
          <ContributorChart
            normalizedContributors={normalizedContributors}
            normalizedTotal={normalizedTotal}
            selectedMetric={selectedMetric}
          />
        </Box>
      </Container>
    </Box>
  );
};

export default RepositoryDetails;

