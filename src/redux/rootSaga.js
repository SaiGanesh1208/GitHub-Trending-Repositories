import { all, fork } from 'redux-saga/effects';
import repositorySaga from './repositories/repositorySaga';
import analyticsSaga from './analytics/analyticsSaga';

export default function* rootSaga() {
  yield all([
    fork(repositorySaga),
    fork(analyticsSaga),
  ]);
}

