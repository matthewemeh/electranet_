import { createApi } from '@reduxjs/toolkit/query/react';

import Endpoints from '../../Endpoints';
import { baseQuery } from '../../../config/reduxjs.config';

const {
  ELECTION,
  ELECTIONS,
  GET_USER_ELECTIONS,
  ADD_ELECTION_CONTESTANT,
  GET_USER_VOTED_ELECTIONS,
  REMOVE_ELECTION_CONTESTANT,
} = Endpoints;

// create the createApi
const electionApi = createApi({
  baseQuery,
  refetchOnReconnect: true,
  reducerPath: 'electionApi',
  tagTypes: ['Elections', 'Contestants'],
  endpoints: builder => ({
    getUserElections: builder.query<PaginatedResponse<Election>, GetUserElectionsPayload>({
      query: ({ params }) => ({ params, method: 'GET', url: GET_USER_ELECTIONS }),
      providesTags: ['Elections'],
    }),
    getUserVotedElections: builder.query<VotedElectionsResponse, void>({
      query: () => ({ method: 'GET', url: GET_USER_VOTED_ELECTIONS }),
    }),
    getElections: builder.query<PaginatedResponse<Election>, GetElectionsPayload>({
      query: ({ params }) => ({ params, method: 'GET', url: ELECTIONS }),
      providesTags: ['Elections'],
    }),
    addElection: builder.mutation<PaginatedResponse<Election>, AddElectionPayload>({
      query: body => ({ body, method: 'POST', url: ELECTIONS }),
      invalidatesTags: ['Elections'],
    }),
    updateElection: builder.mutation<NullResponse, UpdateElectionPayload>({
      query: ({ id, ...body }) => ({ body, method: 'PATCH', url: ELECTION.replace(':id', id) }),
      invalidatesTags: ['Elections'],
    }),
    deleteElection: builder.mutation<NullResponse, string>({
      query: electionID => ({ method: 'DELETE', url: ELECTION.replace(':id', electionID) }),
      invalidatesTags: ['Elections'],
    }),
    addElectionContestant: builder.mutation<NullResponse, ElectionContestantPayload>({
      query: ({ electionID, ...body }) => ({
        body,
        method: 'PATCH',
        url: ADD_ELECTION_CONTESTANT.replace(':id', electionID),
      }),
      invalidatesTags: ['Contestants'],
    }),
    removeElectionContestant: builder.mutation<NullResponse, ElectionContestantPayload>({
      query: ({ electionID, ...body }) => ({
        body,
        method: 'PATCH',
        url: REMOVE_ELECTION_CONTESTANT.replace(':id', electionID),
      }),
      invalidatesTags: ['Contestants'],
    }),
  }),
});

export const {
  useGetElectionsQuery,
  useAddElectionMutation,
  useGetUserElectionsQuery,
  useUpdateElectionMutation,
  useDeleteElectionMutation,
  useGetUserVotedElectionsQuery,
  useAddElectionContestantMutation,
  useRemoveElectionContestantMutation,
} = electionApi;

export default electionApi;
