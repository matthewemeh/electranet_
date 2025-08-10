/* persist our store */
import { combineReducers } from 'redux';
import storage from 'redux-persist/lib/storage';
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';

import logApi from './apis/logApi';
import authApi from './apis/authApi';
import userApi from './apis/userApi';
import voteApi from './apis/voteApi';
import faceApi from './apis/faceApi';
import partyApi from './apis/partyApi';
import resultApi from './apis/resultApi';
import electionApi from './apis/electionApi';
import contestantApi from './apis/contestantApi';
import authStoreSlice from './apis/authApi/store';
import notificationApi from './apis/notificationApi';

// reducers
const reducer = combineReducers({
  authStore: authStoreSlice,
  [logApi.reducerPath]: logApi.reducer,
  [authApi.reducerPath]: authApi.reducer,
  [userApi.reducerPath]: userApi.reducer,
  [voteApi.reducerPath]: voteApi.reducer,
  [faceApi.reducerPath]: faceApi.reducer,
  [partyApi.reducerPath]: partyApi.reducer,
  [resultApi.reducerPath]: resultApi.reducer,
  [electionApi.reducerPath]: electionApi.reducer,
  [contestantApi.reducerPath]: contestantApi.reducer,
  [notificationApi.reducerPath]: notificationApi.reducer,
});

const persistConfig = {
  storage,
  key: 'root',
  blackList: [authApi.reducerPath],
};

// persist our store
const persistedReducer = persistReducer(persistConfig, reducer);

// creating our store
const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: { ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER] },
    }).concat(
      logApi.middleware,
      authApi.middleware,
      userApi.middleware,
      voteApi.middleware,
      faceApi.middleware,
      partyApi.middleware,
      resultApi.middleware,
      electionApi.middleware,
      contestantApi.middleware,
      notificationApi.middleware
    ),
});

// enables refetching on reconnecting to the internet
setupListeners(store.dispatch);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
