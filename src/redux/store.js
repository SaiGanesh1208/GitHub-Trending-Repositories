import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import repositoryReducer from './repositories/repositorySlice';
import analyticsReducer from './analytics/analyticsSlice';
import rootSaga from './rootSaga';

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    repositories: repositoryReducer,
    analytics: analyticsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: false,
      serializableCheck: false,
    }).concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

export default store;

