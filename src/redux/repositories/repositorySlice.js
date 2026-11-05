import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  selectedPeriod: 7, // Default: Last 1 Week (7 days)
  currentPage: 1,
  perPage: 30,
  hasMore: true,
  loading: false,
  loadingMore: false,
  error: null,
  totalCount: 0,
};

const repositorySlice = createSlice({
  name: 'repositories',
  initialState,
  reducers: {
    // Action triggered by UI to fetch repositories
    fetchRepositoriesRequest: (state, action) => {
      const { isNewSearch = false } = action.payload || {};
      if (isNewSearch) {
        state.loading = true;
        state.currentPage = 1;
        state.hasMore = true;
      } else {
        state.loadingMore = true;
      }
      state.error = null;
    },

    // Action dispatched by saga upon success
    fetchRepositoriesSuccess: (state, action) => {
      const { items, totalCount, isNewSearch, page } = action.payload;

      state.loading = false;
      state.loadingMore = false;
      state.error = null;
      state.totalCount = totalCount;
      state.currentPage = page;

      if (isNewSearch) {
        state.items = items;
      } else {
        // Prevent duplicate repositories by id
        const existingIds = new Set(state.items.map((repo) => repo.id));
        const uniqueNewItems = items.filter((repo) => !existingIds.has(repo.id));
        state.items = [...state.items, ...uniqueNewItems];
      }

      // GitHub Search API limitation: max 1,000 results accessible
      const maxResults = Math.min(totalCount, 1000);
      state.hasMore = state.items.length < maxResults && items.length > 0;
    },

    // Action dispatched by saga upon error
    fetchRepositoriesFailure: (state, action) => {
      state.loading = false;
      state.loadingMore = false;
      state.error = action.payload;
    },

    // Action when user changes date filter
    setSelectedPeriod: (state, action) => {
      state.selectedPeriod = action.payload;
      state.currentPage = 1;
      state.items = [];
      state.hasMore = true;
      state.error = null;
    },

    // Reset repositories
    resetRepositories: (state) => {
      state.items = [];
      state.currentPage = 1;
      state.hasMore = true;
      state.error = null;
      state.loading = false;
      state.loadingMore = false;
    },
  },
});

export const {
  fetchRepositoriesRequest,
  fetchRepositoriesSuccess,
  fetchRepositoriesFailure,
  setSelectedPeriod,
  resetRepositories,
} = repositorySlice.actions;

export default repositorySlice.reducer;

