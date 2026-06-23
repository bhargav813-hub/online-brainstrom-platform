export interface Idea {
  _id: string;
  title: string;
  content?: string;
  session: string;
  author: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  } | string;
  parentIdea?: string | null;
  path: string[];
  tags: string[];
  upvoteCount: number;
  downvoteCount: number;
  isDeleted: boolean;
  children?: Idea[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateIdeaPayload {
  title: string;
  sessionId: string;
  content?: string;
  parentIdeaId?: string;
  tags?: string[];
}

export interface UpdateIdeaPayload {
  title?: string;
  content?: string;
  tags?: string[];
  changeNote?: string;
}

export interface MoveIdeaPayload {
  newParentId: string | null;
}

export interface IdeaVersion {
  _id: string;
  idea: string;
  title: string;
  content?: string;
  tags: string[];
  version: number;
  changeNote?: string;
  editedBy: {
    _id: string;
    name: string;
  };
  createdAt: string;
}
