import { createApi } from '@reduxjs/toolkit/query/react';

import Endpoints from '../../Endpoints';
import { baseQuery } from '../../../config/reduxjs.config';

const { RESULTS } = Endpoints;

// create the createApi
const ResultApi = createApi({
  baseQuery,
  keepUnusedDataFor: 0,
  reducerPath: 'resultApi',
  tagTypes: ['Results', 'Result'],
  refetchOnReconnect: true,
  endpoints: builder => ({
    getResults: builder.query<PaginatedResponse<ResultData>, GetResultsPayload>({
      query: ({ params }) => ({ params, method: 'GET', url: RESULTS.FETCH }),
      providesTags: ['Results'],
    }),
    getResult: builder.query<ResultResponse, string>({
      query: electionID => ({ method: 'GET', url: RESULTS.RESULT.replace(':id', electionID) }),
      providesTags: ['Result'],
    }),
  }),
});

export const { useGetResultsQuery, useGetResultQuery } = ResultApi;

export default ResultApi;
