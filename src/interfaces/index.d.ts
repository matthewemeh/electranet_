interface MongoProps {
  _id: string;
  __v: number;
  createdAt: string;
  updatedAt: string;
}

interface ListItem {
  data?: any;
  value: string;
  name: React.ReactNode;
}

interface Tokens {
  accessToken: string;
  refreshToken: string;
}

interface Email {
  value: string;
  verified: boolean;
}

interface User extends Omit<MongoProps, '__v' | 'updatedAt'> {
  role: Role;
  email: Email;
  lastName: string;
  firstName: string;
  middleName?: string;
  isInvited?: boolean;
}

interface MinifiedUser {
  lastName: string;
  firstName: string;
  middleName?: string;
  email: { value: string };
}

interface CurrentUser {
  role: Role;
  email: string;
  faceID?: boolean;
  lastName: string;
  firstName: string;
  middleName?: string;
  emailVerified: boolean;
}

interface AuthStore {
  resetToken: string;
  isAuthenticated: boolean;
  prefersDarkMode: boolean;
  currentUser: CurrentUser;
}

interface Election {
  _id: string;
  name: string;
  endTime: string;
  startTime: string;
  hasEnded: boolean;
  hasStarted: boolean;
  delimitationCode: string;
}

interface Notification_ {
  _id: string;
  message: string;
  createdAt: string;
}

interface Log {
  user: MinifiedUser;
  _id: string;
  action: string;
  message: string;
  createdAt: string;
}

interface Party {
  _id: string;
  motto?: string;
  logoUrl: string;
  longName: string;
  shortName: string;
  createdAt?: string;
  updatedAt?: string;
}

interface Contestant {
  _id: string;
  party?: Party;
  gender: string;
  lastName: string;
  firstName: string;
  updatedAt?: string;
  createdAt?: string;
  isDeleted?: boolean;
  middleName?: string;
  stateOfOrigin: string;
  profileImageUrl: string;
}

interface Result {
  party: Party;
  votes: number;
  contestants: MinifiedContestant[];
}

interface Vote {
  _id: string;
  hash: string;
  timestamp: string;
}

interface AdminToken extends Omit<MongoProps, '__v'> {
  user: MinifiedUser;
  isActive: boolean;
  expiresAt?: string;
  hasExpired: boolean;
  statusCode?: AdminTokenStatus;
}
