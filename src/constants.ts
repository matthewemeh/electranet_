export default {
  USER_IMAGE_KEY: 'image',
  PARTY_IMAGE_KEY: 'partyImage',
  CONTESTANT_IMAGE_KEY: 'contestantImage',
  GENDERS: { MALE: 'MALE', FEMALE: 'FEMALE' },
  ADMIN_TOKEN_STATUSES: { REVOKED: 'REVOKED', ACTIVE: 'ACTIVE' },
  ROLES: { USER: 'USER', ADMIN: 'ADMIN', SUPER_ADMIN: 'SUPER_ADMIN' },
  FILE_SIZE: {
    IMAGE: 512_000, // 500 KB
  },
  SUPPORTED_FORMATS: '.png, .jpeg, .jpg',
  REGEX_RULES: {
    ID: /^[a-f0-9]{24}$/,
    PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,20}$/,
  },
};
