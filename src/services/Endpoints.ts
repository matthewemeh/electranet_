import { isDevMode } from '../helpers/devDetect';

export default {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH_TOKEN: '/auth/refresh-token',
    REGISTER: {
      USER: '/auth/register/user',
      ADMIN: '/auth/register/admin',
      VERIFY: '/auth/register/verify',
    },
    FORGOT_PASSWORD: {
      RESET: '/auth/forgot-password/reset',
      VERIFY: '/auth/forgot-password/verify',
      INITIATE: '/auth/forgot-password/initiate',
    },
  },
  USERS: {
    FETCH: '/users',
    TOKENS: '/users/tokens',
    INVITE: '/users/invite',
    MODIFY_TOKEN: '/users/tokens/:id',
  },
  PARTIES: {
    FETCH: '/parties',
    ADD: '/parties/add',
    EDIT: '/parties/edit/:id',
  },
  CONTESTANTS: {
    FETCH: '/contestants',
    ADD: '/contestants/add',
    ELECTION: '/contestants/:id',
    EDIT: '/contestants/edit/:id',
  },
  ELECTIONS: '/elections',
  ELECTION: '/elections/:id',
  GET_USER_ELECTIONS: '/elections/get-user-elections',
  ADD_ELECTION_CONTESTANT: '/elections/add-contestant/:id',
  REMOVE_ELECTION_CONTESTANT: '/elections/remove-contestant/:id',
  GET_USER_VOTED_ELECTIONS: '/elections/get-user-voted-elections',
  FACE_ID: {
    FETCH: '/face-id/fetch',
    REGISTER: '/face-id/register',
  },
  VOTES: {
    CAST: '/votes/cast',
    FETCH: '/votes/:id',
    TOKEN: '/votes/token',
    VERIFY: '/votes/verify',
  },
  LOGS: '/logs',
  SEND_OTP: '/otp/send',
  RESULTS: {
    FETCH: '/results',
    RESULT: '/results/:id',
  },
  NOTIFICATIONS: '/notifications',
  BASE_URL: isDevMode() ? 'http://localhost:3000/v1' : import.meta.env.VITE_ELECTRANET_API_URL,
};
