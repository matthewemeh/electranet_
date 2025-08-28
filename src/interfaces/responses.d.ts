interface BaseResponse {
  message: string;
  success: boolean;
}

interface PaginatedResponse<T> extends BaseResponse {
  data: {
    docs: T[];
    page: number;
    limit: number;
    totalDocs: number;
    totalPages: number;
    hasPrevPage: boolean;
    hasNextPage: boolean;
    pagingCounter: number;
    prevPage: number | null;
    nextPage: number | null;
  };
}

interface NullResponse extends BaseResponse {
  data: null;
}

interface BaseErrorResponse extends BaseResponse {
  errors?: object | null;
  errorCode?: ErrorCode | null;
}

interface LoginResponse extends BaseResponse {
  data: {
    tokens: Tokens;
    user: CurrentUser;
  };
}

interface TokensResponse extends BaseResponse {
  data: Tokens;
}

interface ForgotVerifyOtpResponse extends BaseResponse {
  data: {
    email: string;
    resetToken: string;
  };
}

interface ResultResponse extends BaseResponse {
  data: {
    createdAt: string;
    updatedAt: string;
    results: Result[];
    election: MinifiedElection;
  };
}

interface FaceIdResponse extends BaseResponse {
  data: { signedUrl: string };
}

interface VoteResponse extends BaseResponse {
  data: { voteID: string };
}

interface VerifyVoteResponse extends BaseResponse {
  data: {
    message: string;
    voteTimestamp: number;
    election: MinifiedElection;
    status: 'success' | 'failed';
  };
}

interface AddVoteTokenResponse extends BaseResponse {
  data: { token: string };
}

interface GetPartiesResponse extends BaseResponse {
  data: MinifiedParty[] | PaginatedResponse<Party>;
}

interface GetElectionContestantsResponse extends BaseResponse {
  data: Contestant[];
}
