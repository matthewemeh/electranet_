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
} as const;
