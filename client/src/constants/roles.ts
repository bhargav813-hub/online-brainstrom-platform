export const UserRole = {
  PARTICIPANT: 'participant',
  FACILITATOR: 'facilitator',
  REVIEWER: 'reviewer',
  WORKSPACE_ADMIN: 'workspace_admin',
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const ROLE_DISPLAY_NAMES: Record<UserRole, string> = {
  participant: 'Participant',
  facilitator: 'Facilitator',
  reviewer: 'Reviewer',
  workspace_admin: 'Admin',
};

export const ROLE_COLORS: Record<UserRole, string> = {
  participant: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  facilitator: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  reviewer: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  workspace_admin: 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400',
};

export const ALL_ROLES: UserRole[] = [
  UserRole.PARTICIPANT,
  UserRole.FACILITATOR,
  UserRole.REVIEWER,
  UserRole.WORKSPACE_ADMIN,
];
