import { all, call, delay, put, takeLatest } from 'redux-saga/effects';
import {
  getCodeFrequency,
  getCommitActivity,
  getContributors,
  getRepositoryDetails,
} from '../../services/githubApi';
import {
  fetchAnalyticsFailure,
  fetchAnalyticsRequest,
  fetchAnalyticsSuccess,
  setPendingCalculation,
} from './analyticsSlice';

/**
 * Helper generator to fetch statistics with retry logic for HTTP 202 (Accepted - Calculating)
 */
function* fetchWithRetry(apiFn, owner, repo, maxRetries = 3, retryDelayMs = 2000) {
  let attempts = 0;
  while (attempts <= maxRetries) {
    try {
      const result = yield call(apiFn, owner, repo);
      // GitHub sometimes returns empty object {} while calculating
      if (result && typeof result === 'object' && !Array.isArray(result) && Object.keys(result).length === 0) {
        if (attempts < maxRetries) {
          yield put(setPendingCalculation(true));
          yield delay(retryDelayMs);
          attempts++;
          continue;
        }
      }
      return result || [];
    } catch (error) {
      if (error.isPending || error.status === 202) {
        attempts++;
        if (attempts <= maxRetries) {
          yield put(setPendingCalculation(true));
          yield delay(retryDelayMs);
          continue;
        }
      }
      // If error is not a 202 or retries exceeded, return empty array for stats so other charts still work
      console.warn(`Error fetching stat with ${apiFn.name}:`, error.message);
      return [];
    }
  }
  return [];
}

function* handleFetchAnalytics(action) {
  try {
    const { owner, repo, repositoryData } = action.payload;

    if (!owner || !repo) {
      throw new Error('Repository owner and name are required.');
    }

    // 1. Fetch or use existing repository metadata
    let repoDetails = repositoryData;
    if (!repoDetails) {
      repoDetails = yield call(getRepositoryDetails, owner, repo);
    }

    // 2. Fetch the 3 statistics endpoints in parallel with 202 retry support
    const [codeFrequency, commitActivity, contributors] = yield all([
      call(fetchWithRetry, getCodeFrequency, owner, repo),
      call(fetchWithRetry, getCommitActivity, owner, repo),
      call(fetchWithRetry, getContributors, owner, repo),
    ]);

    yield put(
      fetchAnalyticsSuccess({
        repository: repoDetails,
        codeFrequency: Array.isArray(codeFrequency) ? codeFrequency : [],
        commitActivity: Array.isArray(commitActivity) ? commitActivity : [],
        contributors: Array.isArray(contributors) ? contributors : [],
      })
    );
  } catch (error) {
    yield put(
      fetchAnalyticsFailure(
        error.message || 'Failed to load repository analytics.'
      )
    );
  }
}

export default function* analyticsSaga() {
  yield takeLatest(fetchAnalyticsRequest.type, handleFetchAnalytics);
}
