export const VALIDATION = {
  PASSWORD: {
    MIN_LENGTH: 6,
    PATTERN: /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
    MESSAGE:
      'Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number or special character',
  },
  USERNAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 50,
    PATTERN: /^[a-zA-Z0-9_-]+$/,
    MESSAGE:
      'Username can only contain letters, numbers, underscores and dashes',
  },
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 100,
  },
} as const;
