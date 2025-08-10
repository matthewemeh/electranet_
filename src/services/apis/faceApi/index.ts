import { createApi } from '@reduxjs/toolkit/query/react';

import Endpoints from '../../Endpoints';
import { updateFormData } from '../../../utils';
import { baseQuery } from '../../../config/reduxjs.config';

const { FACE_ID } = Endpoints;

// create the createApi
const faceIdApi = createApi({
  baseQuery,
  refetchOnReconnect: true,
  reducerPath: 'faceIdApi',
  endpoints: builder => ({
    registerFace: builder.mutation<NullResponse, RegisterFacePayload>({
      query: body => {
        const formData = new FormData();
        Object.entries(body).forEach(updateFormData(formData));

        return { body: formData, method: 'POST', url: FACE_ID.REGISTER };
      },
    }),
    fetchFace: builder.mutation<NullResponse, void>({
      query: () => ({ method: 'GET', url: FACE_ID.FETCH }),
    }),
  }),
});

export const { useFetchFaceMutation, useRegisterFaceMutation } = faceIdApi;

export default faceIdApi;
