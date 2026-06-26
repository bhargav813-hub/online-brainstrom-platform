import type { UserRole } from '@/constants/roles';

export interface WorkspaceMember {
  user: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  } | string;
  role: UserRole;
  joinedAt: string;
}

export interface Workspace {
  _id: string;
  name: string;
  description?: string;
  owner: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  } | string;
  members: WorkspaceMember[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateWorkspacePayload {
  name: string;
  description?: string;
}

export interface UpdateWorkspacePayload {
  name?: string;
  description?: string;
}

export interface InviteMemberPayload {
  email: string;
  role?: UserRole;
}

export interface AssignRolePayload {
  userId: string;
  role: UserRole;
}
