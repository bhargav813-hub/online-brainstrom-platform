export interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
}

export interface UpdateProfilePayload {
  name?: string;
  avatar?: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface UserSearchResult {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
}
