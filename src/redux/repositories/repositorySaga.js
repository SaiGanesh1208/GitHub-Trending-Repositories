import { call, put, select, takeLatest } from 'redux-saga/effects';
import { getRepositories } from '../../services/githubApi';
import {
  fetchRepositoriesFailure,
  fetchRepositoriesRequest,
  fetchRepositoriesSuccess,
} from './repositorySlice';

// Selector to get current repository state
const getRepoState = (state) => state.repositories;

function* handleFetchRepositories(action) {
  try {
    const { isNewSearch = false, page: requestedPage } = action.payload || {};
    const state = yield select(getRepoState);
    const { selectedPeriod, perPage, currentPage } = state;

    const pageToFetch = requestedPage !== undefined ? requestedPage : (isNewSearch ? 1 : currentPage + 1);

    const response = yield call(getRepositories, {
      periodDays: selectedPeriod,
      page: pageToFetch,
      perPage: perPage || 30,
    });

    yield put(
      fetchRepositoriesSuccess({
        items: response.items || [],
        totalCount: response.total_count || 0,
        isNewSearch,
        page: pageToFetch,
      })
    );
  } catch (error) {
    yield put(
      fetchRepositoriesFailure(
        error.message || 'Failed to fetch repositories. Please try again.'
      )
    );
  }
}

export default function* repositorySaga() {
  yield takeLatest(fetchRepositoriesRequest.type, handleFetchRepositories);
}

