import { createApi } from '@reduxjs/toolkit/query/react';

import Endpoints from '../../Endpoints';
import { updateFormData } from '../../../utils';
import { baseQuery } from '../../../config/reduxjs.config';

const { CONTESTANTS } = Endpoints;

// create the createApi
const contestantApi = createApi({
  baseQuery,
  tagTypes: ['Contestant'],
  reducerPath: 'contestantApi',
  refetchOnReconnect: true,
  endpoints: builder => ({
    addContestant: builder.mutation<PaginatedResponse<Contestant>, AddContestantPayload>({
      query: body => {
        const formData = new FormData();
        Object.entries(body).forEach(updateFormData(formData));

        return { body: formData, method: 'POST', url: CONTESTANTS.ADD };
      },
      invalidatesTags: ['Contestant'],
    }),
    updateContestant: builder.mutation<NullResponse, UpdateContestantPayload>({
      query: ({ id, ...body }) => {
        const formData = new FormData();
        Object.entries(body).forEach(updateFormData(formData));

        return { body: formData, method: 'PATCH', url: CONTESTANTS.EDIT.replace(':id', id) };
      },
      invalidatesTags: ['Contestant'],
    }),
    getContestants: builder.query<PaginatedResponse<Contestant>, GetContestantsPayload>({
      query: ({ params }) => ({ params, method: 'GET', url: CONTESTANTS.FETCH }),
      providesTags: ['Contestant'],
    }),
    getElectionContestants: builder.query<PaginatedResponse<Contestant>, string>({
      query: electionID => ({
        method: 'GET',
        url: CONTESTANTS.ELECTION.replace(':id', electionID),
      }),
      providesTags: ['Contestant'],
    }),
  }),
});

export const {
  useGetContestantsQuery,
  useAddContestantMutation,
  useUpdateContestantMutation,
  useGetElectionContestantsQuery,
} = contestantApi;

export default contestantApi;
