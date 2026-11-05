import React, { useEffect, useRef } from 'react';
import { Box } from '@mui/material';

const InfiniteScroll = ({
  hasMore,
  isLoading,
  onLoadMore,
  threshold = 0.5,
  rootMargin = '200px',
  children,
}) => {
  const sentinelRef = useRef(null);

  useEffect(() => {
    // If no more items or already loading, do nothing
    if (!hasMore || isLoading) return;

    const currentSentinel = sentinelRef.current;
    if (!currentSentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];
        if (firstEntry && firstEntry.isIntersecting && hasMore && !isLoading) {
          onLoadMore();
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(currentSentinel);

    return () => {
      if (currentSentinel) {
        observer.unobserve(currentSentinel);
      }
      observer.disconnect();
    };
  }, [hasMore, isLoading, onLoadMore, threshold, rootMargin]);

  return (
    <Box sx={{ width: '100%' }}>
      {children}
      {/* Sentinel element observed by IntersectionObserver */}
      <Box
        ref={sentinelRef}
        sx={{
          height: 10,
          width: '100%',
          visibility: 'hidden',
          pointerEvents: 'none',
        }}
      />
    </Box>
  );
};

export default InfiniteScroll;

