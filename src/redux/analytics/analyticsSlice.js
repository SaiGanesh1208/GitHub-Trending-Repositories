import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  repository: null,
  codeFrequency: [],
  commitActivity: [],
  contributors: [],
  selectedMetric: 'commits', // 'commits' | 'additions' | 'deletions'
  loading: false,
  isPendingCalculation: false,
  error: null,
};

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    fetchAnalyticsRequest: (state) => {
      state.loading = true;
      state.isPendingCalculation = false;
      state.error = null;
    },

    fetchAnalyticsSuccess: (state, action) => {
      state.loading = false;
      state.isPendingCalculation = false;
      state.error = null;
      state.repository = action.payload.repository || state.repository;
      state.codeFrequency = action.payload.codeFrequency || [];
      state.commitActivity = action.payload.commitActivity || [];
      state.contributors = action.payload.contributors || [];
    },

    fetchAnalyticsFailure: (state, action) => {
      state.loading = false;
      state.isPendingCalculation = false;
      state.error = action.payload;
    },

    setPendingCalculation: (state, action) => {
      state.isPendingCalculation = action.payload;
    },

    setSelectedMetric: (state, action) => {
      state.selectedMetric = action.payload;
    },

    clearAnalytics: (state) => {
      state.repository = null;
      state.codeFrequency = [];
      state.commitActivity = [];
      state.contributors = [];
      state.selectedMetric = 'commits';
      state.loading = false;
      state.isPendingCalculation = false;
      state.error = null;
    },
  },
});

export const {
  fetchAnalyticsRequest,
  fetchAnalyticsSuccess,
  fetchAnalyticsFailure,
  setPendingCalculation,
  setSelectedMetric,
  clearAnalytics,
} = analyticsSlice.actions;

export default analyticsSlice.reducer;

