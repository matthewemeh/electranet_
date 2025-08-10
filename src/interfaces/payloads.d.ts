interface ParameterizedPayload<Keys> {
  params?: Partial<Record<Keys, any>>;
}

interface AddContestantPayload {
  party?: string;
  gender: Gender;
  lastName: string;
  firstName: string;
  middleName?: string;
  stateOfOrigin: string;
  contestantImage: File;
}

interface UpdateContestantPayload extends Partial<AddContestantPayload> {
  id: string;
  isDeleted?: boolean;
}

type GetContestantsPayload = ParameterizedPayload<GetContestantsParameters>;

interface AddElectionPayload {
  name: string;
  endTime: string;
  startTime: string;
  delimitationCode?: string;
}

interface UpdateElectionPayload extends Partial<AddElectionPayload> {
  id: string;
}

type GetElectionsPayload = ParameterizedPayload<GetElectionsParameters>;

type GetUserElectionsPayload = ParameterizedPayload<GetUserElectionsParameters>;

interface ElectionContestantPayload {
  electionID: string;
  contestantID: string;
}

interface AddPartyPayload {
  motto?: string;
  longName: string;
  shortName: string;
  partyImage: File;
}

interface UpdatePartyPayload extends Partial<AddPartyPayload> {
  id: string;
}

type GetPartiesPayload = ParameterizedPayload<GetPartiesParameters>;

interface RegisterFacePayload {
  image: File;
}

interface RegisterAdminPayload {
  email: string;
  role: AdminRole;
  password: string;
  lastName: string;
  firstName: string;
  middleName?: string;
}

interface RegisterUserPayload {
  vin: string;
  email: string;
  gender?: Gender;
  address: string;
  password: string;
  lastName: string;
  firstName: string;
  occupation: string;
  middleName?: string;
  dateOfBirth: string;
  delimitationCode: string;
}

interface SendOtpPayload {
  email: string;
  subject: string;
  duration?: number;
}

interface VerifyOtpPayload {
  otp: string;
  email: string;
}

interface LoginPayload {
  email: string;
  password: string;
}

interface ForgotPasswordPayload {
  email: string;
}

interface ResetPasswordPayload {
  email: string;
  password: string;
  resetToken: string;
}

interface RefreshTokenPayload {
  refreshToken: string;
}

interface AdminInvitePayload {
  userID: string;
  expiresAt?: string;
}

interface ModifyTokenPayload {
  tokenID: string;
  expiresAt?: number;
  statusCode?: AdminTokenStatus;
}

interface VotePayload {
  partyID: string;
  voteToken: string;
  electionID: string;
}

interface VerifyVotePayload {
  voteID: string;
}

interface GetResultsPayload {
  id: string;
}

interface GetVotesPayload extends ParameterizedPayload<GetVotesParameters> {
  id: string;
}

type GetLogsPayload = ParameterizedPayload<GetLogsParameters>;

type GetUsersPayload = ParameterizedPayload<GetUsersParameters>;

type GetTokensPayload = ParameterizedPayload<GetTokensParameters>;

type GetNotificationsPayload = ParameterizedPayload<GetNotificationsParameters>;
