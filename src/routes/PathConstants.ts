export const PATHS = {
  AUTH: {
    LOGIN: '/auth',
    REGISTER_USER: '/auth/register',
    REGISTER_ADMIN: '/auth/register/admin',
    RESET_PASSWORD: '/auth/reset-password',
    FORGOT_PASSWORD: '/auth/forgot-password',
    VERIFY_OTP_PASSWORD: '/auth/forgot-password/verify-otp',
  },
  DASHBOARD: '/',
  LOGS: '/logs',
  USERS: '/users',
  TOKENS: '/tokens',
  CONTESTANTS: {
    FETCH: '/contestants',
    ADD: '/contestants/add',
    EDIT: '/contestants/edit',
  },
  PARTIES: {
    FETCH: '/parties',
    ADD: '/parties/add',
    EDIT: '/parties/edit',
  },
  ELECTIONS: {
    FETCH: '/elections',
    ADD: '/elections/add',
    EDIT: '/elections/edit',
    ELECTION: '/elections/:id',
    CONTESTANTS: '/elections/contestants',
  },
  RESULTS: {
    FETCH: '/results',
    RESULT: '/results/:id',
  },
  NOTIFICATIONS: '/notifications',
  FACE_ID_REGISTER: '/face-id/register',
} as const;
