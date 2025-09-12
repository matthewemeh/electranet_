import { createApi } from '@reduxjs/toolkit/query/react';

import Endpoints from '../../Endpoints';
import { baseQuery } from '../../../config/reduxjs.config';

const { VOTES } = Endpoints;

// create the createApi
const voteApi = createApi({
  baseQuery,
  reducerPath: 'voteApi',
  refetchOnReconnect: true,
  endpoints: builder => ({
    castVote: builder.mutation<VoteResponse, VotePayload>({
      query: body => ({ body, method: 'POST', url: VOTES.CAST }),
    }),
    verifyVote: builder.mutation<VerifyVoteResponse, VerifyVotePayload>({
      query: body => ({ body, method: 'POST', url: VOTES.VERIFY }),
    }),
    addVoteToken: builder.mutation<AddVoteTokenResponse, void>({
      query: () => ({ method: 'POST', url: VOTES.TOKEN }),
    }),
    getVotes: builder.query<PaginatedResponse<Vote>, GetVotesPayload>({
      query: ({ id, params }) => ({ params, method: 'GET', url: VOTES.FETCH.replace(':id', id) }),
      forceRefetch: () => true,
    }),
  }),
});

export const {
  useGetVotesQuery,
  useCastVoteMutation,
  useVerifyVoteMutation,
  useAddVoteTokenMutation,
} = voteApi;

export default voteApi;
