import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import Endpoints from '../services/Endpoints';

const { BASE_URL } = Endpoints;

export const baseQuery = fetchBaseQuery({
  timeout: 30_000,
  baseUrl: BASE_URL,
  prepareHeaders: headers => {
    headers.append('x-api-key', import.meta.env.VITE_API_KEY);

    const auth = localStorage.getItem('auth');
    if (!auth) return headers;

    const tokens: Tokens = JSON.parse(auth);
    headers.append('Authorization', `Bearer ${tokens.accessToken}`);

    return headers;
  },
});
