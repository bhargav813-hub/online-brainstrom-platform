# Structured Online Brainstorming Platform — Backend

A production-ready backend system for collaborative brainstorming with hierarchical idea trees, real-time collaboration, structured voting, and session management.

## Tech Stack

| Technology | Purpose |
|-----------|---------|
| **Node.js + TypeScript** | Runtime & language |
| **Express.js** | REST API framework |
| **MongoDB + Mongoose** | Database & ODM |
| **Socket.IO** | Real-time WebSocket communication |
| **JWT** | Authentication (access + refresh tokens) |
| **Zod** | Request validation |
| **Winston** | Structured logging |
| **Helmet + CORS** | Security |

## Getting Started

### Prerequisites
- Node.js >= 18
- MongoDB (local or Atlas)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Copy environment config
cp .env.example .env

# Edit .env with  MongoDB URI and JWT secrets

# Start development server
npm run dev

# Build for production
npm run build
npm start
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/brainstorm_platform` |
| `JWT_ACCESS_SECRET` | Access token signing secret | — |
| `JWT_REFRESH_SECRET` | Refresh token signing secret | — |
| `JWT_ACCESS_EXPIRY` | Access token TTL | `15m` |
| `JWT_REFRESH_EXPIRY` | Refresh token TTL | `7d` |
| `CORS_ORIGIN` | Allowed CORS origin | `http://localhost:3000` |

## Project Structure

```
src/
├── config/           # DB, env, logger configuration
├── middleware/        # Auth, RBAC, error handling, validation, rate limiting
├── modules/          # Feature-based modules
│   ├── auth/         # Register, login, token refresh, logout
│   ├── users/        # Profile management, user search
│   ├── workspaces/   # Workspace CRUD, member management, role assignment
│   ├── boards/       # Board CRUD, archiving
│   ├── sessions/     # Session lifecycle, join/leave, analytics
│   ├── ideas/        # Hierarchical ideas, version history, tree operations
│   ├── votes/        # Voting with weights, analytics
│   ├── clusters/     # Idea grouping with tags
│   ├── activity/     # Session timelines, audit logs
│   └── notifications/# User notification model
├── socket/           # Socket.IO server, auth, session & idea handlers
├── types/            # Global type definitions & enums
├── utils/            # ApiError, ApiResponse, asyncHandler, pagination
├── app.ts            # Express app configuration
└── server.ts         # Entry point
```

## API Endpoints

### Auth (`/api/auth`)
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/register` | Register new user (sends verification OTP) |
| POST | `/verify-otp` | Verify email using registration OTP |
| POST | `/login` | Login with email/password (requires verified email) |
| POST | `/forgot-password` | Request password reset OTP |
| POST | `/reset-password` | Reset password using OTP |
| POST | `/refresh-token` | Refresh access token |
| POST | `/logout` | Logout (invalidate refresh token) |

### Users (`/api/users`)
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/me` | Get current user profile |
| PUT | `/me` | Update profile |
| GET | `/search?q=` | Search users by name/email |

### Workspaces (`/api/workspaces`)
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/` | Create workspace |
| GET | `/` | Get user's workspaces |
| GET | `/:workspaceId` | Get workspace details |
| PUT | `/:workspaceId` | Update workspace |
| DELETE | `/:workspaceId` | Delete workspace |
| POST | `/:workspaceId/invite` | Invite user by email |
| PUT | `/:workspaceId/assign-role` | Assign role to member |
| DELETE | `/:workspaceId/members/:userId` | Remove member |

### Boards (`/api/boards`)
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/` | Create board |
| GET | `/workspace/:workspaceId` | Get boards for workspace |
| GET | `/:boardId` | Get board details |
| PUT | `/:boardId` | Update board |
| PATCH | `/:boardId/archive` | Archive board |
| PATCH | `/:boardId/unarchive` | Unarchive board |
| DELETE | `/:boardId` | Delete board |

### Sessions (`/api/sessions`)
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/` | Create session |
| GET | `/board/:boardId` | Get sessions for board |
| GET | `/:sessionId` | Get session with participants |
| PUT | `/:sessionId` | Update session (status, title) |
| POST | `/:sessionId/join` | Join session |
| POST | `/:sessionId/leave` | Leave session |
| GET | `/:sessionId/analytics` | Session analytics |

### Ideas (`/api/ideas`)
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/` | Create idea (root or child) |
| PUT | `/:ideaId` | Update idea (creates version) |
| DELETE | `/:ideaId` | Soft-delete idea + descendants |
| PATCH | `/:ideaId/move` | Move idea in tree |
| GET | `/session/:sessionId/hierarchy` | Get full idea tree |
| GET | `/:ideaId/children` | Get children of idea |
| GET | `/session/:sessionId/search?q=` | Search ideas |
| GET | `/:ideaId/versions` | Get version history |
| POST | `/:ideaId/restore/:version` | Restore to previous version |

### Votes (`/api/votes`)
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/` | Cast vote (up/down + weight) |
| DELETE | `/idea/:ideaId` | Remove vote |
| GET | `/session/:sessionId/analytics` | Vote analytics |
| GET | `/idea/:ideaId` | Get votes for idea |

### Clusters (`/api/clusters`)
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/` | Create cluster |
| GET | `/session/:sessionId` | Get clusters for session |
| PUT | `/:clusterId` | Update cluster |
| POST | `/:clusterId/ideas` | Assign ideas to cluster |
| DELETE | `/:clusterId/ideas` | Remove ideas from cluster |
| DELETE | `/:clusterId` | Delete cluster |

### Activity (`/api/activity`)
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/session/:sessionId` | Session timeline |
| GET | `/session/:sessionId/filter?action=` | Filter by action type |
| GET | `/session/:sessionId/user/:userId` | User activity in session |

## Socket.IO Events

### Client → Server
| Event | Payload | Description |
|-------|---------|-------------|
| `session:join` | `{ sessionId }` | Join a session room |
| `session:leave` | `{ sessionId }` | Leave a session room |
| `idea:create` | `{ title, content, sessionId, parentIdea? }` | Create idea in real-time |
| `idea:update` | `{ ideaId, title?, content? }` | Update idea in real-time |
| `idea:delete` | `{ ideaId }` | Delete idea in real-time |
| `idea:move` | `{ ideaId, newParentId }` | Move idea in tree |
| `vote:cast` | `{ ideaId, type, weight? }` | Cast a vote |

### Server → Client
| Event | Description |
|-------|-------------|
| `session:participants` | Updated participant list |
| `idea:created` | New idea broadcast |
| `idea:updated` | Idea edit broadcast |
| `idea:deleted` | Idea deletion broadcast |
| `idea:moved` | Idea tree move broadcast |
| `vote:cast` | Vote update with counts |
| `error` | Error message |

## Roles & Permissions

| Role | Permissions |
|------|------------|
| **Participant** | Create/edit own ideas, vote, join sessions |
| **Facilitator** | Manage sessions, invite users, manage clusters |
| **Reviewer** | All participant permissions + approve ideas |
| **Workspace Admin** | Full workspace control, role assignment, member management |

## Security Features

- JWT with short-lived access tokens (15min) + rotating refresh tokens (7d)
- bcrypt password hashing (12 rounds)
- Helmet HTTP security headers
- CORS with explicit origin
- Rate limiting (100 req/15min general, 10 req/15min for auth)
- Zod input validation on all endpoints
- Socket.IO JWT authentication middleware
- Centralized error handling

## Database Schema

11 MongoDB collections with proper indexing:
- **Users** — email (unique), bcrypt passwords
- **Workspaces** — owner, members with roles
- **Boards** — workspace reference, archive support
- **Sessions** — status tracking, facilitator, settings
- **SessionParticipants** — presence tracking with join/leave times
- **Ideas** — hierarchical tree (parent refs + materialized paths)
- **IdeaVersions** — full version history for evolution tracking
- **Votes** — unique per user+idea, weighted voting
- **Clusters** — idea grouping with tags and colors
- **ActivityLogs** — comprehensive audit trail
- **Notifications** — user-targeted notifications
