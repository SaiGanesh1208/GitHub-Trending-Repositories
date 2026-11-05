import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Box,
  Typography,
  Chip,
  Alert,
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import DateFilter from '../components/DateFilter';
import RepositoryList from '../components/RepositoryList';
import InfiniteScroll from '../components/InfiniteScroll';
import { RepositoryListSkeleton, PaginationLoading } from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import {
  fetchRepositoriesRequest,
  setSelectedPeriod,
} from '../redux/repositories/repositorySlice';

const Home = () => {
  const dispatch = useDispatch();
  const {
    items,
    selectedPeriod,
    hasMore,
    loading,
    loadingMore,
    error,
    totalCount,
  } = useSelector((state) => state.repositories);

  // Initial load
  useEffect(() => {
    if (items.length === 0 && !loading && !error) {
      dispatch(fetchRepositoriesRequest({ isNewSearch: true }));
    }
  }, [dispatch, items.length, loading, error]);

  const handlePeriodChange = (newPeriod) => {
    dispatch(setSelectedPeriod(newPeriod));
    dispatch(fetchRepositoriesRequest({ isNewSearch: true }));
  };

  const handleLoadMore = () => {
    if (!loading && !loadingMore && hasMore) {
      dispatch(fetchRepositoriesRequest({ isNewSearch: false }));
    }
  };

  const handleRetry = () => {
    dispatch(fetchRepositoriesRequest({ isNewSearch: items.length === 0 }));
  };

  // Reached GitHub's 1000 search API result limit or totalCount
  const isCapReached = !hasMore && items.length > 0;

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f8fafc' }}>
      <Container maxWidth="lg" sx={{ py: { xs: 3, sm: 4 }, flexGrow: 1 }}>
        {/* Hero / Page Heading */}
        <Box sx={{ mb: 3.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <TrendingUpIcon sx={{ color: '#2563eb', fontSize: 28 }} />
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontWeight: 800,
                color: '#0f172a',
                fontSize: { xs: '1.75rem', sm: '2.25rem' },
                letterSpacing: '-0.02em',
              }}
            >
              Trending Repositories
            </Typography>
          </Box>
          <Typography
            variant="body1"
            sx={{
              color: '#64748b',
              maxWidth: 720,
              fontSize: { xs: '0.95rem', sm: '1.05rem' },
              lineHeight: 1.5,
            }}
          >
            Discover recently created GitHub repositories with the highest star counts.
            Filter by creation date, browse seamlessly with infinite scrolling, and inspect detailed weekly development analytics.
          </Typography>
        </Box>

        {/* Date-Based Filter */}
        <Box sx={{ mb: 3 }}>
          <DateFilter
            selectedPeriod={selectedPeriod}
            onPeriodChange={handlePeriodChange}
            disabled={loading}
          />
        </Box>

        {/* Total Results Summary & Status */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 2,
            px: 0.5,
          }}
        >
          <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
            {loading ? (
              'Searching GitHub...'
            ) : (
              <>
                Showing <strong>{items.length}</strong> {totalCount ? `of ${totalCount.toLocaleString()}` : ''} trending repositories
              </>
            )}
          </Typography>

          <Chip
            size="small"
            label="Sorted by Stars"
            sx={{
              backgroundColor: '#eff6ff',
              color: '#2563eb',
              fontWeight: 600,
              fontSize: '0.75rem',
              border: '1px solid #bfdbfe',
            }}
          />
        </Box>

        {/* Error message */}
        {error && (
          <ErrorMessage
            error={error}
            onRetry={handleRetry}
            title="Failed to Load Repositories"
          />
        )}

        {/* Initial Loading Skeleton */}
        {loading && items.length === 0 && <RepositoryListSkeleton count={6} />}

        {/* Repositories with Infinite Scroll */}
        {!loading && (
          <InfiniteScroll
            hasMore={hasMore}
            isLoading={loadingMore}
            onLoadMore={handleLoadMore}
          >
            <RepositoryList repositories={items} onRetry={handleRetry} />

            {/* Pagination Loading Indicator */}
            {loadingMore && <PaginationLoading />}

            {/* GitHub Search Cap / End of results notice */}
            {isCapReached && (
              <Box sx={{ mt: 3 }}>
                <Alert
                  severity="info"
                  icon={<InfoOutlinedIcon />}
                  sx={{
                    borderRadius: 2,
                    backgroundColor: '#f1f5f9',
                    color: '#475569',
                    border: '1px solid #e2e8f0',
                  }}
                >
                  You have reached the end of available repositories for this period
                  {items.length >= 1000 ? ' (GitHub Search API 1,000 results limit).' : '.'}
                </Alert>
              </Box>
            )}
          </InfiniteScroll>
        )}
      </Container>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          backgroundColor: '#0d1117',
          color: '#8b949e',
          py: 3.5,
          borderTop: '1px solid #30363d',
          mt: 6,
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 2,
              textAlign: { xs: 'center', sm: 'left' },
            }}
          >
            <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
              GitHub Trending Repositories & Analytics Platform
            </Typography>
            <Typography variant="caption" sx={{ color: '#6e7681', fontSize: '0.8rem' }}>
              Data powered by the{' '}
              <a
                href="https://docs.github.com/en/rest"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#58a6ff', textDecoration: 'none' }}
              >
                GitHub REST API
              </a>
              . Built with React, Redux Toolkit, Redux Saga, MUI & Highcharts.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
