import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Brainstorm Platform API',
      version: '1.0.0',
      description: 'Production-ready API for the Structured Online Brainstorming Platform',
      contact: { name: 'API Support' },
    },
    servers: [
      { url: 'http://localhost:5000', description: 'Development' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string' },
          },
        },
        // ── Auth ──
        RegisterInput: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            name: { type: 'string', minLength: 2, maxLength: 100 },
            email: { type: 'string', format: 'email' },
            password: { type: 'string', minLength: 6, maxLength: 128 },
          },
        },
        LoginInput: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string' },
          },
        },
        RefreshTokenInput: {
          type: 'object',
          required: ['refreshToken'],
          properties: { refreshToken: { type: 'string' } },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              properties: {
                accessToken: { type: 'string' },
                refreshToken: { type: 'string' },
                user: { type: 'object' },
              },
            },
          },
        },
        // ── Workspace ──
        CreateWorkspaceInput: {
          type: 'object',
          required: ['name'],
          properties: {
            name: { type: 'string', minLength: 2, maxLength: 200 },
            description: { type: 'string', maxLength: 1000 },
          },
        },
        InviteUserInput: {
          type: 'object',
          required: ['email'],
          properties: {
            email: { type: 'string', format: 'email' },
            role: { type: 'string', enum: ['participant', 'facilitator', 'reviewer', 'workspace_admin'] },
          },
        },
        AssignRoleInput: {
          type: 'object',
          required: ['userId', 'role'],
          properties: {
            userId: { type: 'string' },
            role: { type: 'string', enum: ['participant', 'facilitator', 'reviewer', 'workspace_admin'] },
          },
        },
        // ── Board ──
        CreateBoardInput: {
          type: 'object',
          required: ['title', 'workspaceId'],
          properties: {
            title: { type: 'string', minLength: 1, maxLength: 200 },
            description: { type: 'string', maxLength: 2000 },
            workspaceId: { type: 'string' },
          },
        },
        UpdateBoardInput: {
          type: 'object',
          properties: {
            title: { type: 'string', minLength: 1, maxLength: 200 },
            description: { type: 'string', maxLength: 2000 },
          },
        },
        // ── Session ──
        CreateSessionInput: {
          type: 'object',
          required: ['title', 'boardId', 'workspaceId'],
          properties: {
            title: { type: 'string', minLength: 1, maxLength: 200 },
            description: { type: 'string', maxLength: 2000 },
            boardId: { type: 'string' },
            workspaceId: { type: 'string' },
            maxParticipants: { type: 'number', minimum: 2, maximum: 100 },
            settings: {
              type: 'object',
              properties: {
                allowAnonymousIdeas: { type: 'boolean' },
                votingEnabled: { type: 'boolean' },
                maxIdeasPerUser: { type: 'number', minimum: 1 },
              },
            },
          },
        },
        UpdateSessionInput: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            description: { type: 'string' },
            status: { type: 'string', enum: ['active', 'paused', 'ended'] },
          },
        },
        // ── Idea ──
        CreateIdeaInput: {
          type: 'object',
          required: ['title', 'sessionId'],
          properties: {
            title: { type: 'string', minLength: 1, maxLength: 300 },
            content: { type: 'string', maxLength: 10000 },
            sessionId: { type: 'string' },
            parentIdeaId: { type: 'string' },
            tags: { type: 'array', items: { type: 'string' } },
          },
        },
        UpdateIdeaInput: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            content: { type: 'string' },
            tags: { type: 'array', items: { type: 'string' } },
            changeNote: { type: 'string', maxLength: 500 },
          },
        },
        MoveIdeaInput: {
          type: 'object',
          required: ['newParentId'],
          properties: { newParentId: { type: 'string', nullable: true } },
        },
        // ── Vote ──
        CastVoteInput: {
          type: 'object',
          required: ['ideaId', 'sessionId', 'type'],
          properties: {
            ideaId: { type: 'string' },
            sessionId: { type: 'string' },
            type: { type: 'string', enum: ['upvote', 'downvote'] },
            weight: { type: 'number', minimum: 1, maximum: 10 },
          },
        },
        // ── Cluster ──
        CreateClusterInput: {
          type: 'object',
          required: ['name', 'sessionId'],
          properties: {
            name: { type: 'string', minLength: 1, maxLength: 200 },
            description: { type: 'string', maxLength: 1000 },
            sessionId: { type: 'string' },
            tags: { type: 'array', items: { type: 'string' } },
            color: { type: 'string' },
            ideaIds: { type: 'array', items: { type: 'string' } },
          },
        },
        UpdateClusterInput: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            description: { type: 'string' },
            tags: { type: 'array', items: { type: 'string' } },
            color: { type: 'string' },
          },
        },
        AssignIdeasInput: {
          type: 'object',
          required: ['ideaIds'],
          properties: { ideaIds: { type: 'array', items: { type: 'string' }, minItems: 1 } },
        },
      },
    },
    security: [{ bearerAuth: [] }],
    paths: {
      // ════════════ AUTH ════════════
      '/api/auth/register': {
        post: {
          tags: ['Auth'], summary: 'Register a new user', security: [],
          requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/RegisterInput' } } } },
          responses: { '201': { description: 'User registered', content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } } } }, '400': { description: 'Validation error' }, '409': { description: 'Email already exists' } },
        },
      },
      '/api/auth/login': {
        post: {
          tags: ['Auth'], summary: 'Login', security: [],
          requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginInput' } } } },
          responses: { '200': { description: 'Login successful', content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } } } }, '401': { description: 'Invalid credentials' } },
        },
      },
      '/api/auth/refresh-token': {
        post: {
          tags: ['Auth'], summary: 'Refresh access token', security: [],
          requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/RefreshTokenInput' } } } },
          responses: { '200': { description: 'Token refreshed' }, '401': { description: 'Invalid refresh token' } },
        },
      },
      '/api/auth/logout': {
        post: { tags: ['Auth'], summary: 'Logout (requires auth)', responses: { '200': { description: 'Logged out' } } },
      },
      // ════════════ USERS ════════════
      '/api/users/me': {
        get: { tags: ['Users'], summary: 'Get current user profile', responses: { '200': { description: 'User profile' } } },
        put: { tags: ['Users'], summary: 'Update current user profile', requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { name: { type: 'string' } } } } } }, responses: { '200': { description: 'Profile updated' } } },
      },
      '/api/users/search': {
        get: { tags: ['Users'], summary: 'Search users', parameters: [{ in: 'query', name: 'q', schema: { type: 'string' }, description: 'Search query' }], responses: { '200': { description: 'Search results' } } },
      },
      // ════════════ WORKSPACES ════════════
      '/api/workspaces': {
        post: { tags: ['Workspaces'], summary: 'Create workspace', requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateWorkspaceInput' } } } }, responses: { '201': { description: 'Workspace created' } } },
        get: { tags: ['Workspaces'], summary: 'Get all user workspaces', responses: { '200': { description: 'List of workspaces' } } },
      },
      '/api/workspaces/{workspaceId}': {
        get: { tags: ['Workspaces'], summary: 'Get workspace by ID', parameters: [{ in: 'path', name: 'workspaceId', required: true, schema: { type: 'string' } }], responses: { '200': { description: 'Workspace details' } } },
        put: { tags: ['Workspaces'], summary: 'Update workspace (admin)', parameters: [{ in: 'path', name: 'workspaceId', required: true, schema: { type: 'string' } }], requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateWorkspaceInput' } } } }, responses: { '200': { description: 'Workspace updated' } } },
        delete: { tags: ['Workspaces'], summary: 'Delete workspace (admin)', parameters: [{ in: 'path', name: 'workspaceId', required: true, schema: { type: 'string' } }], responses: { '200': { description: 'Workspace deleted' } } },
      },
      '/api/workspaces/{workspaceId}/invite': {
        post: { tags: ['Workspaces'], summary: 'Invite user to workspace', parameters: [{ in: 'path', name: 'workspaceId', required: true, schema: { type: 'string' } }], requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/InviteUserInput' } } } }, responses: { '200': { description: 'User invited' } } },
      },
      '/api/workspaces/{workspaceId}/assign-role': {
        put: { tags: ['Workspaces'], summary: 'Assign role to member', parameters: [{ in: 'path', name: 'workspaceId', required: true, schema: { type: 'string' } }], requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/AssignRoleInput' } } } }, responses: { '200': { description: 'Role assigned' } } },
      },
      '/api/workspaces/{workspaceId}/members/{userId}': {
        delete: { tags: ['Workspaces'], summary: 'Remove member from workspace', parameters: [{ in: 'path', name: 'workspaceId', required: true, schema: { type: 'string' } }, { in: 'path', name: 'userId', required: true, schema: { type: 'string' } }], responses: { '200': { description: 'Member removed' } } },
      },
      // ════════════ BOARDS ════════════
      '/api/boards': {
        post: { tags: ['Boards'], summary: 'Create board', requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateBoardInput' } } } }, responses: { '201': { description: 'Board created' } } },
      },
      '/api/boards/workspace/{workspaceId}': {
        get: { tags: ['Boards'], summary: 'Get boards by workspace', parameters: [{ in: 'path', name: 'workspaceId', required: true, schema: { type: 'string' } }], responses: { '200': { description: 'List of boards' } } },
      },
      '/api/boards/{boardId}': {
        get: { tags: ['Boards'], summary: 'Get board by ID', parameters: [{ in: 'path', name: 'boardId', required: true, schema: { type: 'string' } }], responses: { '200': { description: 'Board details' } } },
        put: { tags: ['Boards'], summary: 'Update board', parameters: [{ in: 'path', name: 'boardId', required: true, schema: { type: 'string' } }], requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/UpdateBoardInput' } } } }, responses: { '200': { description: 'Board updated' } } },
        delete: { tags: ['Boards'], summary: 'Delete board', parameters: [{ in: 'path', name: 'boardId', required: true, schema: { type: 'string' } }], responses: { '200': { description: 'Board deleted' } } },
      },
      '/api/boards/{boardId}/archive': {
        patch: { tags: ['Boards'], summary: 'Archive board', parameters: [{ in: 'path', name: 'boardId', required: true, schema: { type: 'string' } }], responses: { '200': { description: 'Board archived' } } },
      },
      '/api/boards/{boardId}/unarchive': {
        patch: { tags: ['Boards'], summary: 'Unarchive board', parameters: [{ in: 'path', name: 'boardId', required: true, schema: { type: 'string' } }], responses: { '200': { description: 'Board unarchived' } } },
      },
      // ════════════ SESSIONS ════════════
      '/api/sessions': {
        post: { tags: ['Sessions'], summary: 'Create session', requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateSessionInput' } } } }, responses: { '201': { description: 'Session created' } } },
      },
      '/api/sessions/board/{boardId}': {
        get: { tags: ['Sessions'], summary: 'Get sessions by board', parameters: [{ in: 'path', name: 'boardId', required: true, schema: { type: 'string' } }], responses: { '200': { description: 'List of sessions' } } },
      },
      '/api/sessions/{sessionId}': {
        get: { tags: ['Sessions'], summary: 'Get session by ID', parameters: [{ in: 'path', name: 'sessionId', required: true, schema: { type: 'string' } }], responses: { '200': { description: 'Session details' } } },
        put: { tags: ['Sessions'], summary: 'Update session', parameters: [{ in: 'path', name: 'sessionId', required: true, schema: { type: 'string' } }], requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/UpdateSessionInput' } } } }, responses: { '200': { description: 'Session updated' } } },
      },
      '/api/sessions/{sessionId}/join': {
        post: { tags: ['Sessions'], summary: 'Join session', parameters: [{ in: 'path', name: 'sessionId', required: true, schema: { type: 'string' } }], responses: { '200': { description: 'Joined session' } } },
      },
      '/api/sessions/{sessionId}/leave': {
        post: { tags: ['Sessions'], summary: 'Leave session', parameters: [{ in: 'path', name: 'sessionId', required: true, schema: { type: 'string' } }], responses: { '200': { description: 'Left session' } } },
      },
      '/api/sessions/{sessionId}/analytics': {
        get: { tags: ['Sessions'], summary: 'Get session analytics', parameters: [{ in: 'path', name: 'sessionId', required: true, schema: { type: 'string' } }], responses: { '200': { description: 'Session analytics' } } },
      },
      // ════════════ IDEAS ════════════
      '/api/ideas': {
        post: { tags: ['Ideas'], summary: 'Create idea', requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateIdeaInput' } } } }, responses: { '201': { description: 'Idea created' } } },
      },
      '/api/ideas/{ideaId}': {
        put: { tags: ['Ideas'], summary: 'Update idea', parameters: [{ in: 'path', name: 'ideaId', required: true, schema: { type: 'string' } }], requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/UpdateIdeaInput' } } } }, responses: { '200': { description: 'Idea updated' } } },
        delete: { tags: ['Ideas'], summary: 'Delete idea', parameters: [{ in: 'path', name: 'ideaId', required: true, schema: { type: 'string' } }], responses: { '200': { description: 'Idea deleted' } } },
      },
      '/api/ideas/{ideaId}/move': {
        patch: { tags: ['Ideas'], summary: 'Move idea in tree', parameters: [{ in: 'path', name: 'ideaId', required: true, schema: { type: 'string' } }], requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/MoveIdeaInput' } } } }, responses: { '200': { description: 'Idea moved' } } },
      },
      '/api/ideas/session/{sessionId}/hierarchy': {
        get: { tags: ['Ideas'], summary: 'Get idea hierarchy for session', parameters: [{ in: 'path', name: 'sessionId', required: true, schema: { type: 'string' } }], responses: { '200': { description: 'Idea tree hierarchy' } } },
      },
      '/api/ideas/{ideaId}/children': {
        get: { tags: ['Ideas'], summary: 'Get child ideas', parameters: [{ in: 'path', name: 'ideaId', required: true, schema: { type: 'string' } }], responses: { '200': { description: 'Child ideas' } } },
      },
      '/api/ideas/session/{sessionId}/search': {
        get: { tags: ['Ideas'], summary: 'Search ideas in session', parameters: [{ in: 'path', name: 'sessionId', required: true, schema: { type: 'string' } }, { in: 'query', name: 'q', schema: { type: 'string' } }], responses: { '200': { description: 'Search results' } } },
      },
      '/api/ideas/{ideaId}/versions': {
        get: { tags: ['Ideas'], summary: 'Get idea version history', parameters: [{ in: 'path', name: 'ideaId', required: true, schema: { type: 'string' } }], responses: { '200': { description: 'Version history' } } },
      },
      '/api/ideas/{ideaId}/restore/{version}': {
        post: { tags: ['Ideas'], summary: 'Restore idea to version', parameters: [{ in: 'path', name: 'ideaId', required: true, schema: { type: 'string' } }, { in: 'path', name: 'version', required: true, schema: { type: 'integer' } }], responses: { '200': { description: 'Version restored' } } },
      },
      // ════════════ VOTES ════════════
      '/api/votes': {
        post: { tags: ['Votes'], summary: 'Cast a vote', requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CastVoteInput' } } } }, responses: { '201': { description: 'Vote cast' } } },
      },
      '/api/votes/idea/{ideaId}': {
        delete: { tags: ['Votes'], summary: 'Remove vote from idea', parameters: [{ in: 'path', name: 'ideaId', required: true, schema: { type: 'string' } }], responses: { '200': { description: 'Vote removed' } } },
        get: { tags: ['Votes'], summary: 'Get votes for idea', parameters: [{ in: 'path', name: 'ideaId', required: true, schema: { type: 'string' } }], responses: { '200': { description: 'Votes list' } } },
      },
      '/api/votes/session/{sessionId}/analytics': {
        get: { tags: ['Votes'], summary: 'Get vote analytics for session', parameters: [{ in: 'path', name: 'sessionId', required: true, schema: { type: 'string' } }], responses: { '200': { description: 'Vote analytics' } } },
      },
      // ════════════ CLUSTERS ════════════
      '/api/clusters': {
        post: { tags: ['Clusters'], summary: 'Create cluster', requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateClusterInput' } } } }, responses: { '201': { description: 'Cluster created' } } },
      },
      '/api/clusters/session/{sessionId}': {
        get: { tags: ['Clusters'], summary: 'Get clusters by session', parameters: [{ in: 'path', name: 'sessionId', required: true, schema: { type: 'string' } }], responses: { '200': { description: 'List of clusters' } } },
      },
      '/api/clusters/{clusterId}': {
        put: { tags: ['Clusters'], summary: 'Update cluster', parameters: [{ in: 'path', name: 'clusterId', required: true, schema: { type: 'string' } }], requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/UpdateClusterInput' } } } }, responses: { '200': { description: 'Cluster updated' } } },
        delete: { tags: ['Clusters'], summary: 'Delete cluster', parameters: [{ in: 'path', name: 'clusterId', required: true, schema: { type: 'string' } }], responses: { '200': { description: 'Cluster deleted' } } },
      },
      '/api/clusters/{clusterId}/ideas': {
        post: { tags: ['Clusters'], summary: 'Assign ideas to cluster', parameters: [{ in: 'path', name: 'clusterId', required: true, schema: { type: 'string' } }], requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/AssignIdeasInput' } } } }, responses: { '200': { description: 'Ideas assigned' } } },
        delete: { tags: ['Clusters'], summary: 'Remove ideas from cluster', parameters: [{ in: 'path', name: 'clusterId', required: true, schema: { type: 'string' } }], responses: { '200': { description: 'Ideas removed' } } },
      },
      // ════════════ ACTIVITY ════════════
      '/api/activity/session/{sessionId}': {
        get: { tags: ['Activity'], summary: 'Get activity timeline', parameters: [{ in: 'path', name: 'sessionId', required: true, schema: { type: 'string' } }, { in: 'query', name: 'page', schema: { type: 'integer' } }, { in: 'query', name: 'limit', schema: { type: 'integer' } }], responses: { '200': { description: 'Activity timeline' } } },
      },
      '/api/activity/session/{sessionId}/filter': {
        get: { tags: ['Activity'], summary: 'Filter activities by action', parameters: [{ in: 'path', name: 'sessionId', required: true, schema: { type: 'string' } }, { in: 'query', name: 'action', schema: { type: 'string' } }], responses: { '200': { description: 'Filtered activities' } } },
      },
      '/api/activity/session/{sessionId}/user/{userId}': {
        get: { tags: ['Activity'], summary: 'Get user activity in session', parameters: [{ in: 'path', name: 'sessionId', required: true, schema: { type: 'string' } }, { in: 'path', name: 'userId', required: true, schema: { type: 'string' } }], responses: { '200': { description: 'User activities' } } },
      },
    },
    tags: [
      { name: 'Auth', description: 'Authentication & registration' },
      { name: 'Users', description: 'User profile management' },
      { name: 'Workspaces', description: 'Workspace CRUD & member management' },
      { name: 'Boards', description: 'Board management within workspaces' },
      { name: 'Sessions', description: 'Brainstorming session management' },
      { name: 'Ideas', description: 'Idea CRUD, tree operations & versioning' },
      { name: 'Votes', description: 'Voting on ideas' },
      { name: 'Clusters', description: 'Idea clustering & grouping' },
      { name: 'Activity', description: 'Activity timeline & audit logs' },
    ],
  },
  apis: [], // We defined paths inline, no need for JSDoc scanning
};

export const swaggerSpec = swaggerJsdoc(options);
