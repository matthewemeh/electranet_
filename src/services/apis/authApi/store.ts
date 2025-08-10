import { type CaseReducer, type PayloadAction, createSlice } from '@reduxjs/toolkit';

import authApi from './index';

const initialState: AuthStore = {
  resetToken: '',
  isAuthenticated: false,
  prefersDarkMode: false,
  currentUser: {
    email: '',
    role: 'USER',
    lastName: '',
    firstName: '',
    emailVerified: false,
  },
};

const refreshAction: CaseReducer<AuthStore, PayloadAction<TokensResponse>> = (
  state,
  { payload }
) => {
  localStorage.setItem('auth', JSON.stringify(payload.data));
  return state;
};

const loginAction: CaseReducer<AuthStore, PayloadAction<LoginResponse>> = (state, { payload }) => {
  const { user, tokens } = payload.data;
  localStorage.setItem('auth', JSON.stringify(tokens));
  return { ...state, currentUser: user, isAuthenticated: true };
};

const logoutAction = () => {
  localStorage.removeItem('auth');
  return initialState;
};

export const authStoreSlice = createSlice({
  name: 'authStore',
  initialState,
  reducers: {
    logout: logoutAction,
    updateUser: (state, action: PayloadAction<Partial<CurrentUser>>) => {
      state = Object.assign(state, { currentUser: { ...state.currentUser, ...action.payload } });
    },
    updateAuthStore: (state, action: PayloadAction<Partial<Omit<AuthStore, 'currentUser'>>>) => {
      state = Object.assign(state, action.payload);
    },
  },
  extraReducers: builder => {
    // these are backend routes(endpoints) which when fufilled, return payloads that updates AuthStore
    const { login, logout, refreshTokens } = authApi.endpoints;
    builder.addMatcher(login.matchFulfilled, loginAction);
    builder.addMatcher(logout.matchFulfilled, logoutAction);
    builder.addMatcher(refreshTokens.matchFulfilled, refreshAction);
  },
});

export const { updateUser, updateAuthStore, logout } = authStoreSlice.actions;
export default authStoreSlice.reducer;
