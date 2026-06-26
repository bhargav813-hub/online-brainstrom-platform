export interface Cluster {
  _id: string;
  name: string;
  description?: string;
  session: string;
  tags: string[];
  color?: string;
  ideas: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateClusterPayload {
  name: string;
  sessionId: string;
  description?: string;
  tags?: string[];
  color?: string;
  ideaIds?: string[];
}

export interface UpdateClusterPayload {
  name?: string;
  description?: string;
  tags?: string[];
  color?: string;
}

export interface ClusterIdeasPayload {
  ideaIds: string[];
}
