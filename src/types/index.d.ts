type Checkpoint = {
  title: string;
  subtitle: string;
};

type AdminRole = 'ADMIN' | 'SUPER_ADMIN';

type Role = 'USER' | AdminRole;

type Gender = 'MALE' | 'FEMALE';

type AdminTokenStatus = 'REVOKED' | 'ACTIVE';

type MinifiedElection = Omit<Election, Exclude<keyof Election, 'name' | 'delimitationCode'>>;

type MinifiedParty = Omit<Party, Exclude<keyof Party, 'shortName' | 'longName' | 'logoUrl'>>;

type MinifiedContestant = Omit<
  Contestant,
  Exclude<keyof Contestant, 'lastName' | 'firstName' | 'profileImageUrl'>
>;

/**
 * Represents specific error codes used throughout the application.
 *
 * - `'E001'`: Indicates that user session has expired.
 * - `'E002'`: Indicates that refresh token has expired.
 * - `'E003'`: Indicates that Authorization was missing in latest request headers.
 * - `'E004'`: Indicates that `refreshToken` field was empty (or missing) in lastest logout request body.
 * - `'E005'`: Indicates that `refreshToken` was provided in lastest logout request body but is invalid (not found in database).
 * - `'E006'`: Indicates an attempt to register a duplicate user.
 * - `'E007'`: Indicates a failed super admin registration.
 * - `'E008'`: Indicates an invalid or expired Vote Token was used to cast a vote.
 *
 * @remarks
 * Use this type to strongly type error codes and provide context-specific error handling.
 */
type ErrorCode = 'E001' | 'E002' | 'E003' | 'E004' | 'E005' | 'E006' | 'E007' | 'E008';
