export const UserRole = {
  USER: "USER",
  ADMIN: "ADMIN",
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const userRoles = [UserRole.USER, UserRole.ADMIN] as const;
