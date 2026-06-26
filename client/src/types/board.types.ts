export interface Board {
  _id: string;
  name: string;
  description?: string;
  workspace: string;
  createdBy: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  } | string;
  isArchived: boolean;
  isPublic: boolean;
  shareToken?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBoardPayload {
  name: string;
  description?: string;
  workspaceId: string;
}

export interface UpdateBoardPayload {
  name?: string;
  description?: string;
}

export type ExportFormat = 'pdf' | 'json';
