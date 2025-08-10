import { createApi } from '@reduxjs/toolkit/query/react';

import Endpoints from '../../Endpoints';
import { baseQuery } from '../../../config/reduxjs.config';

const { RESULT } = Endpoints;

// create the createApi
const ResultApi = createApi({
  baseQuery,
  tagTypes: ['Results'],
  reducerPath: 'resultApi',
  refetchOnReconnect: true,
  endpoints: builder => ({
    getResults: builder.query<PaginatedResponse<Result>, string>({
      query: electionID => ({ method: 'GET', url: RESULT.replace(':id', electionID) }),
      providesTags: ['Results'],
    }),
  }),
});

export const { useGetResultsQuery } = ResultApi;

export default ResultApi;
