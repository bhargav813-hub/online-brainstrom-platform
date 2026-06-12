import { UserRole } from '@/types/common';

export const ROLE_HIERARCHY: Record<UserRole, number> = {
  participant: 0,
  reviewer: 1,
  facilitator: 2,
  workspace_admin: 3,
};

export const ROLE_LABELS: Record<UserRole, string> = {
  participant: 'Participant',
  reviewer: 'Reviewer',
  facilitator: 'Facilitator',
  workspace_admin: 'Admin',
};

export const ROLE_COLORS: Record<UserRole, string> = {
  participant: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
  reviewer: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  facilitator: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
  workspace_admin: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
};

export const ALL_ROLES: UserRole[] = ['participant', 'reviewer', 'facilitator', 'workspace_admin'];
