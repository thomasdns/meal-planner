export const authTokenPolicy = {
  passwordReset: {
    ttlMs: 30 * 60 * 1000,
    validityLabel: "30 minutes",
  },
  emailVerification: {
    ttlMs: 24 * 60 * 60 * 1000,
    validityLabel: "24 heures",
  },
} as const;
