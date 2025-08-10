type PaginationParameters = 'page' | 'limit';

type SortParameters = 'sortBy';

type GetContestantsParameters =
  | PaginationParameters
  | SortParameters
  | 'party'
  | 'gender'
  | 'lastName'
  | 'firstName'
  | 'isDeleted';

type GetUserElectionsParameters = PaginationParameters | 'endTime' | 'startTime';

type GetElectionsParameters = GetUserElectionsParameters | SortParameters | 'delimitationCode';

type GetPartiesParameters = PaginationParameters | SortParameters;

type GetUsersParameters =
  | PaginationParameters
  | SortParameters
  | 'role'
  | 'email'
  | 'lastName'
  | 'firstName'
  | 'delimitationCode';

type GetVotesParameters = PaginationParameters | SortParameters;

type GetTokensParameters = PaginationParameters | SortParameters;

type GetLogsParameters = PaginationParameters | SortParameters | 'startTime' | 'endTime';

type GetNotificationsParameters = GetLogsParameters;
