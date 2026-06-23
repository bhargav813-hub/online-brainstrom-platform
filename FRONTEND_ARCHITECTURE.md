# Production-Grade Frontend Architecture
## Structured Online Brainstorming Platform — `client/`

> **Based on a complete analysis of the backend at `server/`.**
> This document is the architecture plan. Code generation begins only after approval.

---

## Table of Contents

1. [Backend Analysis](#1-backend-analysis)
2. [Domain Analysis](#2-domain-analysis)
3. [API Analysis](#3-api-analysis)
4. [Authentication Analysis](#4-authentication-analysis)
5. [Authorization Analysis](#5-authorization-analysis)
6. [Recommended Frontend Architecture](#6-recommended-frontend-architecture)
7. [Complete Folder Structure](#7-complete-folder-structure)
8. [Folder-by-Folder Explanation](#8-folder-by-folder-explanation)
9. [File-by-File Explanation](#9-file-by-file-explanation)
10. [Route Structure](#10-route-structure)
11. [Feature Structure](#11-feature-structure)
12. [State Management Design](#12-state-management-design)
13. [API Layer Design](#13-api-layer-design)
14. [Socket.IO Real-Time Design](#14-socketio-real-time-design)
15. [Security Design](#15-security-design)
16. [SEO Design](#16-seo-design)
17. [Accessibility Design](#17-accessibility-design)
18. [Performance Design](#18-performance-design)
19. [Testing Strategy](#19-testing-strategy)
20. [CI/CD Design](#20-cicd-design)
21. [Step-by-Step Implementation Plan](#21-step-by-step-implementation-plan)
22. [Exact Files to Create](#22-exact-files-to-create)
23. [Code Generation Order](#23-code-generation-order)
24. [Potential Risks](#24-potential-risks)
25. [Architectural Decisions](#25-architectural-decisions)
26. [Environment Configuration](#26-environment-configuration)

---

## 1. Backend Analysis

### Stack
| Technology | Version | Purpose |
|---|---|---|
| Node.js + TypeScript | Latest | Runtime + Language |
| Express.js | 4.21 | REST API |
| MongoDB + Mongoose | 8.7 | Database + ODM |
| Socket.IO | 4.8 | Real-time WebSocket |
| JWT | 9.x | Auth (access 15m + refresh 7d) |
| Zod | 3.x | Request validation |
| Helmet + CORS | Latest | Security headers |

### API Base URL
```
http://localhost:5000/api
ws://localhost:5000   (Socket.IO)
```

### Key Constraints Confirmed from Source Code
- `avatar` on `IUser` is a `String` field — **URL only, no file upload endpoint exists**. Frontend must use URL input only.
- `notifications` module has a `Notification` model but **no controller, service, or routes**. Notification UI must be deferred.
- Token storage in user document: `refreshToken` is stored server-side; rotation happens on every refresh call.
- OTP flow: 6-digit numeric, expires in 10 minutes. Required for both registration verification and password reset.
- Session status enum: `active | paused | ended`.
- UserRole enum (workspace-scoped): `participant | facilitator | reviewer | workspace_admin`.
- `isVerified` flag on User — login is blocked until email OTP is verified.
- Board export supports `pdf` (returns binary stream) and `json` formats.
- Shared boards are public and accessible without auth via `GET /api/boards/shared/:shareToken`.

---

## 2. Domain Analysis

The platform has five core domains and three supporting domains.

### Core Domains

| Domain | Description |
|---|---|
| **Auth** | Registration (OTP), login, token lifecycle, password reset |
| **Workspace** | Top-level container; members have workspace-scoped roles |
| **Board** | Lives inside a Workspace; can be archived or shared publicly |
| **Session** | Lives inside a Board; is the active brainstorming context |
| **Idea** | Lives inside a Session; hierarchical tree (parent refs + materialized paths); full version history |

### Supporting Domains

| Domain | Description |
|---|---|
| **Vote** | Upvote/downvote with optional weight (1–10) per user per idea |
| **Cluster** | Groups ideas within a session with name, color, and tags |
| **Activity** | Immutable audit log of all session events; paginated timeline |

### Domain Relationships
```
User
 └── Workspace (owner + members[]{user, role, joinedAt})
      └── Board (workspace ref, isArchived, isPublic, shareToken)
           └── Session (board ref, workspace ref, status, settings, facilitator)
                ├── SessionParticipant (presence tracking)
                ├── Idea (tree: parentIdeaId, path[], tags, isDeleted soft)
                │    ├── IdeaVersion (full history per edit)
                │    └── Vote (unique per user+idea, type, weight)
                ├── Cluster (groups ideas, tags, color)
                └── ActivityLog (audit trail)
```

---

## 3. API Analysis

### Auth Endpoints (`/api/auth`)
| Method | Path | Auth | Body |
|---|---|---|---|
| POST | `/register` | ❌ | `{ name, email, password }` |
| POST | `/verify-otp` | ❌ | `{ email, otp }` → returns `{ accessToken, refreshToken, user }` |
| POST | `/login` | ❌ | `{ email, password }` → returns `{ accessToken, refreshToken, user }` |
| POST | `/forgot-password` | ❌ | `{ email }` |
| POST | `/reset-password` | ❌ | `{ email, otp, password }` |
| POST | `/refresh-token` | ❌ | `{ refreshToken }` → returns new token pair |
| POST | `/logout` | ✅ | — |

### Users (`/api/users`)
| Method | Path | Auth | Notes |
|---|---|---|---|
| GET | `/me` | ✅ | Returns `{ name, email, avatar, isActive, isVerified, createdAt }` |
| PUT | `/me` | ✅ | `{ name?, avatar? }` — avatar is URL string only |
| PUT | `/change-password` | ✅ | `{ currentPassword, newPassword }` |
| GET | `/search?q=` | ✅ | Returns `[{ name, email, avatar }]` — used for invite autocomplete |

### Workspaces (`/api/workspaces`)
| Method | Path | Auth | RBAC |
|---|---|---|---|
| POST | `/` | ✅ | any member |
| GET | `/` | ✅ | returns user's workspaces |
| GET | `/:workspaceId` | ✅ | member |
| PUT | `/:workspaceId` | ✅ | workspace_admin |
| DELETE | `/:workspaceId` | ✅ | workspace_admin |
| POST | `/:workspaceId/invite` | ✅ | workspace_admin |
| PUT | `/:workspaceId/assign-role` | ✅ | workspace_admin |
| DELETE | `/:workspaceId/members/:userId` | ✅ | workspace_admin |

### Boards (`/api/boards`)
| Method | Path | Auth | RBAC |
|---|---|---|---|
| POST | `/` | ✅ | member |
| GET | `/workspace/:workspaceId` | ✅ | member |
| GET | `/:boardId` | ✅ | board member |
| PUT | `/:boardId` | ✅ | admin / facilitator |
| PATCH | `/:boardId/archive` | ✅ | admin / facilitator |
| PATCH | `/:boardId/unarchive` | ✅ | admin / facilitator |
| DELETE | `/:boardId` | ✅ | admin only |
| POST | `/:boardId/share` | ✅ | admin / facilitator |
| POST | `/:boardId/unshare` | ✅ | admin / facilitator |
| GET | `/shared/:shareToken` | ❌ | public |
| GET | `/:boardId/export?format=` | ✅ | board member |

### Sessions (`/api/sessions`)
| Method | Path | Notes |
|---|---|---|
| POST | `/` | `{ title, boardId, workspaceId, maxParticipants?, settings? }` |
| GET | `/board/:boardId` | paginated |
| GET | `/:sessionId` | includes participants |
| PUT | `/:sessionId` | `{ title?, description?, status? }` — status: `active|paused|ended` |
| POST | `/:sessionId/join` | records presence |
| POST | `/:sessionId/leave` | |
| GET | `/:sessionId/analytics` | |

### Ideas (`/api/ideas`)
| Method | Path | Notes |
|---|---|---|
| POST | `/` | `{ title, sessionId, content?, parentIdeaId?, tags? }` |
| PUT | `/:ideaId` | `{ title?, content?, tags?, changeNote? }` — creates version |
| DELETE | `/:ideaId` | soft-delete + descendants |
| PATCH | `/:ideaId/move` | `{ newParentId }` — null to root |
| GET | `/session/:sessionId/hierarchy` | full tree |
| GET | `/:ideaId/children` | direct children |
| GET | `/session/:sessionId/search?q=` | full-text |
| GET | `/:ideaId/versions` | version history |
| POST | `/:ideaId/restore/:version` | restore |

### Votes (`/api/votes`)
| Method | Path | Body |
|---|---|---|
| POST | `/` | `{ ideaId, sessionId, type: 'upvote'|'downvote', weight?: 1–10 }` |
| DELETE | `/idea/:ideaId` | remove own vote |
| GET | `/session/:sessionId/analytics` | |
| GET | `/idea/:ideaId` | all votes for idea |

### Clusters (`/api/clusters`)
| Method | Path | Body |
|---|---|---|
| POST | `/` | `{ name, sessionId, description?, tags?, color?, ideaIds? }` |
| GET | `/session/:sessionId` | |
| PUT | `/:clusterId` | `{ name?, description?, tags?, color? }` |
| POST | `/:clusterId/ideas` | `{ ideaIds: string[] }` |
| DELETE | `/:clusterId/ideas` | `{ ideaIds: string[] }` |
| DELETE | `/:clusterId` | |

### Activity (`/api/activity`)
| Method | Path |
|---|---|
| GET | `/session/:sessionId?page=&limit=` |
| GET | `/session/:sessionId/filter?action=` |
| GET | `/session/:sessionId/user/:userId` |

### Standard API Response Shape
```typescript
// Success
{ success: true, data: T, message?: string }

// Paginated
{ success: true, data: T[], pagination: { page, limit, total, totalPages } }

// Error
{ success: false, message: string, errors: { field: string, message: string }[] }
```

---

## 4. Authentication Analysis

### Mechanism
- **JWT Bearer tokens** sent in `Authorization: Bearer <token>` header
- Access token: 15-minute TTL, signed with `JWT_ACCESS_SECRET`
- Refresh token: 7-day TTL, signed with `JWT_REFRESH_SECRET`, stored in DB per user
- Token rotation: every `POST /api/auth/refresh-token` call issues a new pair and updates DB

### Token Payload
```typescript
interface TokenPayload {
  id: string;       // user._id
  email: string;
  role: UserRole;   // Global role — NOTE: workspace roles are in Workspace.members[]
}
```

> ⚠️ The `role` in the JWT is a global fallback (`participant` for all users at login). **Actual permissions are workspace-scoped** and resolved server-side from `Workspace.members[].role`. The frontend must fetch workspace membership separately for role-based UI decisions.

### Frontend Token Strategy

| Concern | Decision | Reason |
|---|---|---|
| **Access token storage** | In-memory (React/Zustand state) | XSS-safe; never hits localStorage |
| **Refresh token storage** | `HttpOnly` cookie (preferred) OR `sessionStorage` with rotation | httpOnly cookie if backend adds cookie support; otherwise sessionStorage is acceptable for SPA flows |
| **Silent refresh** | Axios response interceptor: on 401, call `/api/auth/refresh-token`, then retry original request | Transparent to all API calls |
| **Tab persistence** | On mount, call `/api/auth/refresh-token` from `sessionStorage` token | Survives page reload within session |
| **Logout** | Clear Zustand auth store + sessionStorage + call `POST /api/auth/logout` | Server invalidates refresh token |
| **Route protection** | Next.js middleware (`middleware.ts`) + client-side auth guard in layout | Defense in depth |

### OTP Flows
- **Registration**: `POST /register` → email OTP → `POST /verify-otp` → tokens issued
- **Password Reset**: `POST /forgot-password` → email OTP → `POST /reset-password`
- OTP: 6 digits, 10-minute expiry

---

## 5. Authorization Analysis

### Roles (workspace-scoped)
| Role | Key Permissions |
|---|---|
| `participant` | Create/edit **own** ideas, vote, join sessions |
| `facilitator` | All above + manage sessions, invite users, manage clusters, archive boards |
| `reviewer` | All participant permissions + approve ideas |
| `workspace_admin` | Full control: CRUD workspace, assign roles, remove members, delete boards |

### Frontend RBAC Rules

The frontend must fetch workspace membership and derive UI permissions:

```typescript
// Example permission matrix (computed from workspace member role)
const canManageSession   = ['facilitator', 'workspace_admin'].includes(role);
const canDeleteBoard     = role === 'workspace_admin';
const canInviteMembers   = role === 'workspace_admin';
const canManageClusters  = ['facilitator', 'workspace_admin'].includes(role);
const canEditOthersIdeas = ['facilitator', 'workspace_admin'].includes(role);
const canArchiveBoard    = ['facilitator', 'workspace_admin'].includes(role);
const canAssignRoles     = role === 'workspace_admin';
```

> Never invent roles. The exact set is: `participant | facilitator | reviewer | workspace_admin`.

---

## 6. Recommended Frontend Architecture

### Tech Stack
```
Next.js 15 (App Router) + TypeScript
TailwindCSS + shadcn/ui + Lucide Icons
TanStack Query v5 (server state)
Zustand v4 (client/auth state)
Axios (HTTP client with interceptors)
Socket.IO Client 4.x (real-time)
React Hook Form + Zod (forms + validation)
Framer Motion (animations)
Sonner (toast notifications)
date-fns (date formatting)
clsx + tailwind-merge + class-variance-authority
```

### Architecture Principles
- **Feature-first** folder structure — each domain has its own `features/<domain>/` folder
- **Separation of concerns** — services (API calls) are never inside components
- **Server vs Client Components** — Server Components for data fetching wherever possible; `"use client"` only for interactivity
- **No prop drilling** — Zustand for global client state, TanStack Query for server state, URL state for filters/tabs
- **Single source of truth** — Socket.IO events update the TanStack Query cache directly, not a separate local state
- **Type safety end-to-end** — all API responses typed from backend contracts

---

## 7. Complete Folder Structure

```
client/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── register/
│   │   │   └── page.tsx
│   │   ├── verify-otp/
│   │   │   └── page.tsx
│   │   ├── forgot-password/
│   │   │   └── page.tsx
│   │   ├── reset-password/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── (dashboard)/
│   │   ├── workspaces/
│   │   │   ├── page.tsx
│   │   │   ├── [workspaceId]/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── settings/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── boards/
│   │   │   │       ├── page.tsx
│   │   │   │       └── [boardId]/
│   │   │   │           ├── page.tsx
│   │   │   │           └── sessions/
│   │   │   │               └── [sessionId]/
│   │   │   │                   └── page.tsx
│   │   ├── profile/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── (marketing)/
│   │   ├── page.tsx
│   │   └── layout.tsx
│   ├── shared/
│   │   └── [shareToken]/
│   │       └── page.tsx
│   ├── api/
│   │   └── health/
│   │       └── route.ts
│   ├── error.tsx
│   ├── not-found.tsx
│   ├── global-error.tsx
│   ├── layout.tsx
│   ├── sitemap.ts
│   └── robots.ts
│
├── components/
│   ├── ui/                          # shadcn/ui base components (generated)
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── badge.tsx
│   │   ├── avatar.tsx
│   │   ├── card.tsx
│   │   ├── tooltip.tsx
│   │   ├── separator.tsx
│   │   ├── scroll-area.tsx
│   │   ├── tabs.tsx
│   │   ├── select.tsx
│   │   ├── textarea.tsx
│   │   ├── label.tsx
│   │   └── ...
│   ├── forms/
│   │   ├── FormField.tsx
│   │   └── OtpInput.tsx
│   ├── tables/
│   │   ├── DataTable.tsx
│   │   └── MemberTable.tsx
│   ├── charts/
│   │   ├── VoteChart.tsx
│   │   └── ActivityChart.tsx
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   └── PageContainer.tsx
│   ├── navigation/
│   │   ├── Breadcrumbs.tsx
│   │   └── WorkspaceNav.tsx
│   ├── feedback/
│   │   ├── LoadingSpinner.tsx
│   │   ├── ErrorMessage.tsx
│   │   ├── EmptyState.tsx
│   │   └── ConfirmDialog.tsx
│   └── shared/
│       ├── UserAvatar.tsx
│       ├── RoleBadge.tsx
│       ├── StatusBadge.tsx
│       └── CopyButton.tsx
│
├── features/
│   ├── auth/
│   │   ├── components/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   ├── VerifyOtpForm.tsx
│   │   │   ├── ForgotPasswordForm.tsx
│   │   │   └── ResetPasswordForm.tsx
│   │   ├── hooks/
│   │   │   └── useAuth.ts
│   │   └── schemas/
│   │       └── auth.schemas.ts
│   ├── workspaces/
│   │   ├── components/
│   │   │   ├── WorkspaceCard.tsx
│   │   │   ├── WorkspaceList.tsx
│   │   │   ├── CreateWorkspaceModal.tsx
│   │   │   ├── InviteMemberForm.tsx
│   │   │   ├── MemberList.tsx
│   │   │   └── RoleAssignMenu.tsx
│   │   ├── hooks/
│   │   │   └── useWorkspace.ts
│   │   └── schemas/
│   │       └── workspace.schemas.ts
│   ├── boards/
│   │   ├── components/
│   │   │   ├── BoardCard.tsx
│   │   │   ├── BoardList.tsx
│   │   │   ├── CreateBoardModal.tsx
│   │   │   ├── BoardSharePanel.tsx
│   │   │   └── BoardExportButton.tsx
│   │   ├── hooks/
│   │   │   └── useBoard.ts
│   │   └── schemas/
│   │       └── board.schemas.ts
│   ├── sessions/
│   │   ├── components/
│   │   │   ├── SessionCard.tsx
│   │   │   ├── SessionList.tsx
│   │   │   ├── CreateSessionModal.tsx
│   │   │   ├── SessionStatusBadge.tsx
│   │   │   ├── ParticipantList.tsx
│   │   │   └── SessionAnalytics.tsx
│   │   ├── hooks/
│   │   │   └── useSession.ts
│   │   └── schemas/
│   │       └── session.schemas.ts
│   ├── ideas/
│   │   ├── components/
│   │   │   ├── IdeaTree.tsx
│   │   │   ├── IdeaNode.tsx
│   │   │   ├── IdeaCard.tsx
│   │   │   ├── CreateIdeaForm.tsx
│   │   │   ├── EditIdeaForm.tsx
│   │   │   ├── IdeaVersionHistory.tsx
│   │   │   └── IdeaSearchBar.tsx
│   │   ├── hooks/
│   │   │   ├── useIdeas.ts
│   │   │   └── useIdeaTree.ts
│   │   └── schemas/
│   │       └── idea.schemas.ts
│   ├── votes/
│   │   ├── components/
│   │   │   ├── VoteButtons.tsx
│   │   │   ├── VoteWeightSlider.tsx
│   │   │   └── VoteAnalyticsDashboard.tsx
│   │   ├── hooks/
│   │   │   └── useVote.ts
│   │   └── schemas/
│   │       └── vote.schemas.ts
│   ├── clusters/
│   │   ├── components/
│   │   │   ├── ClusterCard.tsx
│   │   │   ├── ClusterList.tsx
│   │   │   ├── CreateClusterModal.tsx
│   │   │   └── ClusterIdeaAssigner.tsx
│   │   ├── hooks/
│   │   │   └── useCluster.ts
│   │   └── schemas/
│   │       └── cluster.schemas.ts
│   └── activity/
│       ├── components/
│       │   ├── ActivityFeed.tsx
│       │   ├── ActivityItem.tsx
│       │   └── ActivityFilter.tsx
│       └── hooks/
│           └── useActivity.ts
│
├── hooks/
│   ├── useSocket.ts
│   ├── usePermissions.ts
│   ├── useDebounce.ts
│   ├── useIntersectionObserver.ts
│   └── useCopyToClipboard.ts
│
├── services/
│   ├── api-client.ts
│   ├── auth.service.ts
│   ├── user.service.ts
│   ├── workspace.service.ts
│   ├── board.service.ts
│   ├── session.service.ts
│   ├── idea.service.ts
│   ├── vote.service.ts
│   ├── cluster.service.ts
│   └── activity.service.ts
│
├── lib/
│   ├── utils.ts
│   ├── query-client.ts
│   ├── socket.ts
│   └── formatters.ts
│
├── store/
│   ├── auth.store.ts
│   └── socket.store.ts
│
├── types/
│   ├── auth.types.ts
│   ├── user.types.ts
│   ├── workspace.types.ts
│   ├── board.types.ts
│   ├── session.types.ts
│   ├── idea.types.ts
│   ├── vote.types.ts
│   ├── cluster.types.ts
│   ├── activity.types.ts
│   └── api.types.ts
│
├── constants/
│   ├── roles.ts
│   ├── routes.ts
│   └── query-keys.ts
│
├── config/
│   └── site.ts
│
├── providers/
│   ├── QueryProvider.tsx
│   ├── AuthProvider.tsx
│   └── SocketProvider.tsx
│
├── middleware.ts
│
├── styles/
│   └── globals.css
│
├── public/
│   ├── logo.svg
│   └── og-image.png
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── __mocks__/
│
├── e2e/
│   └── auth.spec.ts
│
├── docs/
│   └── architecture.md
│
├── .env.example
├── .env.local
├── .eslintrc.json
├── .prettierrc
├── .husky/
│   ├── pre-commit
│   └── pre-push
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── vitest.config.ts
└── playwright.config.ts
```

---

## 8. Folder-by-Folder Explanation

### `app/`
Next.js 15 App Router pages and layouts. Uses route groups for segment isolation.

- `(auth)/` — unauthenticated pages (login, register, OTP). Separate layout with centered card design. Must **never** be accessible if already logged in.
- `(dashboard)/` — all protected pages. The layout mounts the auth guard, sidebar, and socket connection. Any page here requires a valid access token.
- `(marketing)/` — public landing page. Static, no auth required.
- `shared/[shareToken]/` — public board viewer. No auth; uses `GET /api/boards/shared/:shareToken`.
- `api/` — Next.js Route Handlers (not backend proxies). Used only for internal BFF needs (e.g., health check).
- `error.tsx` / `not-found.tsx` / `global-error.tsx` — Next.js error boundary pages.
- `sitemap.ts` / `robots.ts` — SEO metadata generation.

**Must never contain**: business logic, API calls, or component state.

### `components/`
Purely presentational, domain-agnostic UI components.

- `ui/` — shadcn/ui generated primitives. Never modify directly; compose them in `features/`.
- `forms/` — generic form primitives (OTP input, labeled field wrapper).
- `tables/` — generic data table and member table, not domain-specific.
- `charts/` — generic chart wrappers over recharts/d3.
- `layout/` — app shell (sidebar, header, page container).
- `navigation/` — breadcrumbs and nav components.
- `feedback/` — loading states, error messages, empty states, confirmation dialogs.
- `shared/` — micro-components used across domains (UserAvatar, RoleBadge).

**Must never contain**: API calls, TanStack Query hooks, or feature-specific business logic.

### `features/`
Domain-specific UI, hooks, and validation schemas. Each feature maps 1:1 to a backend module.

- Each sub-folder has `components/`, `hooks/`, and `schemas/`.
- Feature components **can** import from `components/` (shared UI) but **must not** import from other `features/` (prevents circular dependencies).
- Feature `hooks/` wrap TanStack Query mutations and queries for that domain.
- Feature `schemas/` mirror backend Zod validators for form validation.

**Must never contain**: raw `fetch`/`axios` calls — those go in `services/`.

### `hooks/`
Global custom hooks not tied to any domain.

- `useSocket.ts` — returns the typed Socket.IO client instance from `SocketProvider`.
- `usePermissions.ts` — derives permission flags from current user's workspace role.
- `useDebounce.ts` — debounces a value by N ms (for search inputs).
- `useIntersectionObserver.ts` — for infinite scroll / lazy loading.
- `useCopyToClipboard.ts` — clipboard utility.

### `services/`
HTTP communication layer. All API calls live here.

- `api-client.ts` — configured Axios instance with base URL, interceptors (auth header injection, silent token refresh on 401, error normalization).
- One service file per backend module. Services are plain functions or class methods that return typed data.

**Must never contain**: React code, hooks, or component state.

### `lib/`
Pure utility code with no side effects.

- `utils.ts` — `cn()` (clsx + tailwind-merge), misc helpers.
- `query-client.ts` — TanStack QueryClient singleton with default options.
- `socket.ts` — Socket.IO client factory (creates typed socket, not a singleton — singleton is in `SocketProvider`).
- `formatters.ts` — date-fns wrappers, number formatters.

### `store/`
Zustand global stores. Kept minimal.

- `auth.store.ts` — `{ user, accessToken, isAuthenticated, setAuth, clearAuth }`. Access token lives here in memory.
- `socket.store.ts` — tracks socket connection status (`connected | disconnected | reconnecting`).

**Must never contain**: server state (that belongs in TanStack Query).

### `types/`
TypeScript interfaces derived from backend models. No runtime code.

- One file per backend module. Types are manually kept in sync with `IUser`, `IBoard`, `ISession`, etc.
- `api.types.ts` — generic `ApiResponse<T>`, `PaginatedResponse<T>`, `ApiError`.

### `constants/`
Static values used across the app.

- `roles.ts` — role strings, permission matrices, role display names.
- `routes.ts` — all app route paths as typed constants (no magic strings).
- `query-keys.ts` — TanStack Query key factories.

### `config/`
- `site.ts` — site name, description, base URL, OG image paths (feeds SEO metadata).

### `providers/`
React context providers that wrap the app.

- `QueryProvider.tsx` — wraps app with `QueryClientProvider`.
- `AuthProvider.tsx` — on mount, attempts silent token refresh; sets auth state.
- `SocketProvider.tsx` — creates and manages the Socket.IO connection lifecycle.

### `middleware.ts`
Next.js edge middleware. Checks for presence of refresh token in `sessionStorage` (via cookie-based pattern or token cookie) and redirects unauthenticated users to `/login`. Runs before page render.

---

## 9. File-by-File Explanation

### Services Layer

#### `services/api-client.ts`
**Purpose**: Single Axios instance shared by all services.
```typescript
// Responsibilities:
// 1. Set baseURL from NEXT_PUBLIC_API_URL env var
// 2. Request interceptor: attach "Authorization: Bearer <accessToken>" from auth store
// 3. Response interceptor: on 401 → call refresh-token endpoint → retry original request
//    (queue concurrent 401s, resolve all after refresh)
// 4. Normalize error shape to ApiError type
// 5. Attach request cancellation via AbortController
```

#### `services/auth.service.ts`
Wraps all `POST /api/auth/*` calls. Returns typed `AuthResponse`.

#### `services/workspace.service.ts`
Wraps all `/api/workspaces/*` calls. Includes `inviteUser`, `assignRole`, `removeMember`.

#### `services/board.service.ts`
Includes `exportBoard` which handles binary PDF response (returns `Blob`).

#### `services/idea.service.ts`
Includes `getHierarchy`, `move`, `getVersions`, `restoreVersion`.

### Store Layer

#### `store/auth.store.ts`
```typescript
interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (user: User, accessToken: string) => void;
  clearAuth: () => void;
  setLoading: (loading: boolean) => void;
}
```

### Hooks

#### `hooks/usePermissions.ts`
```typescript
// Accepts workspaceMember role and returns permission flags:
interface Permissions {
  canManageSession: boolean;
  canDeleteBoard: boolean;
  canInviteMembers: boolean;
  canManageClusters: boolean;
  canEditOthersIdeas: boolean;
  canArchiveBoard: boolean;
  canAssignRoles: boolean;
}
```

#### `hooks/useSocket.ts`
Returns the socket instance from `SocketProvider` context. Components use this instead of importing socket directly.

### Feature Hooks

#### `features/ideas/hooks/useIdeas.ts`
```typescript
// Queries:
// useIdeaHierarchy(sessionId) → TanStack Query, refetched on socket events
// useIdeaSearch(sessionId, query) → debounced search
// useIdeaVersions(ideaId)

// Mutations:
// useCreateIdea → on success: invalidate hierarchy, emit socket idea:create
// useUpdateIdea → on success: update cache, emit socket idea:update
// useDeleteIdea → optimistic update
// useMoveIdea
// useRestoreVersion
```

---

## 10. Route Structure

```
/                                       → Landing page (marketing)
/login                                  → Login form
/register                               → Register form (step 1)
/verify-otp                             → OTP verification (step 2)
/forgot-password                        → Request reset OTP
/reset-password                         → Enter OTP + new password

/workspaces                             → Dashboard: list of user's workspaces
/workspaces/[workspaceId]               → Workspace detail: boards list
/workspaces/[workspaceId]/settings      → Workspace settings + members management
/workspaces/[workspaceId]/boards/[boardId]          → Board detail: sessions list
/workspaces/[workspaceId]/boards/[boardId]/sessions/[sessionId]  → Active session: idea tree + votes + clusters

/profile                                → User profile + change password

/shared/[shareToken]                    → Public shared board view (no auth)
```

### Route Protection Matrix
| Route Pattern | Protection |
|---|---|
| `/(dashboard)/*` | Redirect to `/login` if `!isAuthenticated` |
| `/(auth)/*` | Redirect to `/workspaces` if `isAuthenticated` |
| `/shared/*` | Public, no protection |

---

## 11. Feature Structure

### Session Page (`/workspaces/[workspaceId]/boards/[boardId]/sessions/[sessionId]`)
This is the most complex page. It has:
- **Left panel**: `IdeaTree` component — hierarchical tree with drag-to-rearrange and nested create forms
- **Right panel**: `ClusterList` + `ActivityFeed` (tabbed)
- **Top bar**: `ParticipantList` (live presence) + session status controls (facilitator only)
- **Floating**: `VoteButtons` on each `IdeaNode`

Real-time updates flow:
```
Socket event received
  → Update TanStack Query cache directly (queryClient.setQueryData)
  → Component re-renders automatically
```

---

## 12. State Management Design

### What goes where

| State | Location | Reason |
|---|---|---|
| Current user + access token | Zustand `auth.store` | Needs to survive navigation, feed into Axios interceptors |
| Socket connection status | Zustand `socket.store` | Cross-component read access |
| Workspace list | TanStack Query | Server state; needs cache invalidation on mutations |
| Idea hierarchy | TanStack Query | Server state; updated by Socket.IO events |
| Active session participants | TanStack Query | Real-time via socket; component-level |
| Form state | React Hook Form local state | Form-specific, no global relevance |
| URL filters (e.g., archived boards toggle) | URL search params | Shareable, bookmarkable |
| Modal open/close | Local `useState` | Component-scoped |

### TanStack Query Config
```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,      // 5 min
      gcTime: 1000 * 60 * 10,        // 10 min
      retry: 1,
      refetchOnWindowFocus: false,    // socket keeps data fresh
    },
    mutations: {
      onError: (error) => toast.error(getErrorMessage(error)),
    },
  },
});
```

### Socket → Cache Integration
```typescript
// In SocketProvider or feature hook:
socket.on('idea:created', (data) => {
  queryClient.setQueryData(
    queryKeys.ideas.hierarchy(data.sessionId),
    (old) => appendIdeaToTree(old, data)
  );
});

socket.on('idea:deleted', ({ ideaId }) => {
  queryClient.setQueryData(
    queryKeys.ideas.hierarchy(sessionId),
    (old) => removeIdeaFromTree(old, ideaId)
  );
});
```

---

## 13. API Layer Design

### `services/api-client.ts` — Full Specification

```typescript
import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import { useAuthStore } from '@/store/auth.store';

// Silent refresh queue: prevents multiple simultaneous refresh calls
let isRefreshing = false;
let failedQueue: Array<{ resolve: (token: string) => void; reject: (err: unknown) => void }> = [];

const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // http://localhost:5000/api
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor — attach access token
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor — silent token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers!.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        });
      }
      originalRequest._retry = true;
      isRefreshing = true;
      try {
        const refreshToken = sessionStorage.getItem('refreshToken');
        const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`, { refreshToken });
        const newAccessToken = data.data.accessToken;
        useAuthStore.getState().setAccessToken(newAccessToken);
        sessionStorage.setItem('refreshToken', data.data.refreshToken);
        failedQueue.forEach(({ resolve }) => resolve(newAccessToken));
        failedQueue = [];
        originalRequest.headers!.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch {
        failedQueue.forEach(({ reject }) => reject(error));
        failedQueue = [];
        useAuthStore.getState().clearAuth();
        window.location.href = '/login';
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(normalizeError(error));
  }
);
```

### Error Normalization
```typescript
interface ApiError {
  message: string;
  statusCode: number;
  errors: { field: string; message: string }[];
}

function normalizeError(error: AxiosError): ApiError {
  const data = error.response?.data as any;
  return {
    message: data?.message || 'An unexpected error occurred',
    statusCode: error.response?.status || 500,
    errors: data?.errors || [],
  };
}
```

---

## 14. Socket.IO Real-Time Design

### Typed Socket Client
```typescript
// lib/socket.ts
import { io, Socket } from 'socket.io-client';
import type { ServerToClientEvents, ClientToServerEvents } from '@/types/socket.types';

type AppSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

export function createSocket(token: string): AppSocket {
  return io(process.env.NEXT_PUBLIC_WS_URL!, {
    auth: { token },
    transports: ['websocket'],
    reconnectionAttempts: 5,
    reconnectionDelay: 2000,
    autoConnect: false,
  });
}
```

### SocketProvider Lifecycle
```
1. AuthProvider sets isAuthenticated=true
2. SocketProvider creates socket with access token
3. socket.connect()
4. On 'connect': set socket.store connected=true
5. On 'disconnect': set socket.store connected=false, attempt reconnect
6. On access token refresh: socket.auth.token = newToken; socket.disconnect().connect()
7. On logout: socket.disconnect()
```

### Events Matrix
| Direction | Event | Frontend Action |
|---|---|---|
| → Server | `session:join` | on session page mount |
| → Server | `session:leave` | on session page unmount |
| → Server | `idea:create` | after REST POST succeeds (optimistic) |
| → Server | `idea:update` | after REST PUT succeeds |
| → Server | `idea:delete` | after REST DELETE succeeds |
| → Server | `idea:move` | after REST PATCH succeeds |
| → Server | `vote:cast` | after REST POST succeeds |
| ← Server | `session:participants` | update TanStack Query participant cache |
| ← Server | `idea:created` | append to hierarchy cache |
| ← Server | `idea:updated` | update node in hierarchy cache |
| ← Server | `idea:deleted` | remove from hierarchy cache |
| ← Server | `idea:moved` | reconstruct tree branch in cache |
| ← Server | `vote:cast` | update vote counts on idea node |
| ← Server | `error` | show Sonner error toast |

---

## 15. Security Design

### Token Security
- **Access token**: memory only (Zustand), never `localStorage`, never cookies without `httpOnly`
- **Refresh token**: `sessionStorage` only — cleared on tab close; acceptable risk for SPA
- **Auth header**: `Authorization: Bearer <token>` — standard Bearer pattern

### Input Security
- All form data validated client-side via Zod before submission
- HTML encoding for all rendered user-generated content (React does this by default)
- No `dangerouslySetInnerHTML` without explicit sanitization

### HTTP Security Headers (`next.config.ts`)
```typescript
const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'X-XSS-Protection', value: '1; mode=block' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline'",  // unsafe-eval needed for Next.js dev
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "connect-src 'self' ws://localhost:5000 http://localhost:5000",
    ].join('; '),
  },
];
```

### CSRF
- JWT in `Authorization` header (not cookies) — immune to CSRF by design
- If refresh token moves to `httpOnly` cookie in future, add CSRF token header

### Avatar Security
> ⚠️ Avatar is a URL string field. The frontend must not allow arbitrary URL injection. Validate that avatar URLs point to trusted domains or are valid HTTPS URLs before saving.

### Rate Limiting Awareness
- Auth endpoints rate-limited to 10 req/15min — show backoff UI on 429 responses
- Axios interceptor: on 429, parse `Retry-After` header, show countdown in toast

---

## 16. SEO Design

### Metadata Strategy
```typescript
// app/layout.tsx
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL!),
  title: { template: '%s | Brainstorm Platform', default: 'Brainstorm Platform' },
  description: 'Collaborative real-time brainstorming with hierarchical ideas and structured voting.',
  openGraph: {
    type: 'website',
    images: ['/og-image.png'],
  },
  robots: { index: true, follow: true },
};
```

### Dynamic Metadata (session pages)
```typescript
// app/(dashboard)/workspaces/[workspaceId]/boards/[boardId]/sessions/[sessionId]/page.tsx
export async function generateMetadata({ params }): Promise<Metadata> {
  // Fetch session title for dynamic OG title
  return { title: session.title };
}
```

### Public Routes Only
- `/` (landing), `/shared/[shareToken]` — crawlable
- All `/workspaces/*` routes — `noindex` (private user content)

---

## 17. Accessibility Design

- All interactive elements have `aria-label` or visible text
- Focus trap in modals (shadcn/ui Dialog handles this)
- Keyboard navigation for `IdeaTree` (arrow keys for navigation, Enter to expand/collapse)
- `role="tree"` and `role="treeitem"` on idea hierarchy
- Status badges use `aria-label` not just color (for color-blind users)
- Loading states: `aria-live="polite"` regions for async updates
- Form errors linked to inputs via `aria-describedby`
- Color contrast: Tailwind default palette meets WCAG AA for text
- `useReducedMotion` hook to disable Framer Motion animations on preference

---

## 18. Performance Design

### Route-based Code Splitting
Next.js App Router does this automatically per route segment.

### Dynamic Imports
```typescript
// Heavy components loaded lazily
const IdeaTree = dynamic(() => import('@/features/ideas/components/IdeaTree'), {
  loading: () => <IdeaTreeSkeleton />,
});
const VoteAnalyticsDashboard = dynamic(() => import('@/features/votes/components/VoteAnalyticsDashboard'));
```

### Image Optimization
- Use `next/image` for all images
- Avatar URLs from external sources: add domains to `next.config.ts`

### Data Fetching Strategy
- Server Components fetch workspace/board metadata (no loading spinner)
- Client Components handle real-time session data (TanStack Query + socket)
- Prefetch workspace list on hover over workspace nav link

### Bundle Optimization
- `date-fns` — import only used functions (tree-shakeable)
- `lucide-react` — import individual icons, not the full package
- `shadcn/ui` — only install components that are used

### Caching
| Layer | Strategy |
|---|---|
| TanStack Query | `staleTime: 5min`, `gcTime: 10min` |
| Next.js fetch cache | `{ cache: 'no-store' }` for all API calls (real-time data) |
| Static assets | CDN cache via Vercel/Nginx headers |

---

## 19. Testing Strategy

### Unit Tests (Vitest + React Testing Library)
- Test all Zod schemas (valid + invalid inputs)
- Test utility functions (`formatters.ts`, `query-client.ts`)
- Test `usePermissions` hook with different roles
- Test auth store actions

```typescript
// tests/unit/schemas/auth.schemas.test.ts
describe('registerSchema', () => {
  it('rejects passwords under 6 chars', () => {
    expect(() => registerSchema.parse({ password: '123' })).toThrow();
  });
});
```

### Integration Tests (Vitest + MSW)
- Mock backend with Mock Service Worker (MSW)
- Test full login flow: form submit → API call → store update → redirect
- Test 401 refresh flow: mock 401 → mock refresh → verify retry

```typescript
// tests/integration/auth.test.tsx
it('silently refreshes on 401', async () => {
  server.use(
    http.get('/api/users/me', () => HttpResponse.json({}, { status: 401 }), { once: true }),
    http.post('/api/auth/refresh-token', () => HttpResponse.json({ data: { accessToken: 'new-token' } })),
  );
  // ...assert original request retried with new token
});
```

### E2E Tests (Playwright)
```typescript
// e2e/auth.spec.ts
test('registration → OTP verification → dashboard redirect', async ({ page }) => {
  await page.goto('/register');
  // fill form, submit, check OTP page appears, enter OTP, check redirect to /workspaces
});
```

---

## 20. CI/CD Design

### GitHub Actions (`.github/workflows/ci.yml`)
```yaml
name: CI

on: [push, pull_request]

jobs:
  lint-typecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20', cache: 'npm' }
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20', cache: 'npm' }
      - run: npm ci
      - run: npm run test:unit
      - run: npm run test:integration

  build:
    runs-on: ubuntu-latest
    needs: [lint-typecheck, test]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20', cache: 'npm' }
      - run: npm ci
      - run: npm run build
        env:
          NEXT_PUBLIC_API_URL: ${{ secrets.NEXT_PUBLIC_API_URL }}
```

### Husky Git Hooks
- `pre-commit`: `lint-staged` → ESLint + Prettier on staged files
- `pre-push`: `npm run typecheck` + `npm run test:unit`

---

## 21. Step-by-Step Implementation Plan

### Phase 1 — Foundation (Days 1–2)
1. `npx create-next-app@latest client --typescript --tailwind --eslint --app --src-dir=false`
2. Install all dependencies
3. Configure `tsconfig.json` path aliases (`@/` → root)
4. Set up shadcn/ui (`npx shadcn-ui@latest init`)
5. Install required shadcn components
6. Create `styles/globals.css` with Tailwind directives
7. Create `lib/utils.ts` (`cn` helper)
8. Set up Prettier + Husky + lint-staged
9. Create `.env.example`

### Phase 2 — Type Definitions & Constants (Day 2)
10. `types/` — create all type files from backend contracts
11. `constants/roles.ts` — role strings + permission matrix
12. `constants/routes.ts` — all route paths as constants
13. `constants/query-keys.ts` — TanStack Query key factory

### Phase 3 — API Layer (Day 3)
14. `services/api-client.ts` — Axios instance + interceptors (auth inject + silent refresh + error normalize)
15. `services/auth.service.ts`
16. `services/user.service.ts`
17. `services/workspace.service.ts`
18. `services/board.service.ts`
19. `services/session.service.ts`
20. `services/idea.service.ts`
21. `services/vote.service.ts`
22. `services/cluster.service.ts`
23. `services/activity.service.ts`

### Phase 4 — State + Providers (Day 3)
24. `store/auth.store.ts` — Zustand auth store
25. `store/socket.store.ts`
26. `lib/query-client.ts`
27. `lib/socket.ts`
28. `providers/QueryProvider.tsx`
29. `providers/AuthProvider.tsx` (silent refresh on mount)
30. `providers/SocketProvider.tsx`
31. `app/layout.tsx` — mount all providers

### Phase 5 — Auth Feature (Day 4)
32. Auth Zod schemas (`features/auth/schemas/`)
33. Auth form components (Login, Register, VerifyOtp, ForgotPassword, ResetPassword)
34. Auth pages (`app/(auth)/*/page.tsx`)
35. Auth layout
36. `middleware.ts` — route protection

### Phase 6 — Shared Components (Day 5)
37. `components/layout/` — Sidebar, Header, PageContainer
38. `components/feedback/` — LoadingSpinner, ErrorMessage, EmptyState, ConfirmDialog
39. `components/shared/` — UserAvatar, RoleBadge, StatusBadge
40. `components/navigation/` — Breadcrumbs

### Phase 7 — Workspace + Board Features (Days 5–6)
41. Workspace feature (list, create, settings, member management)
42. Board feature (list, create, archive, share, export)
43. Workspace + Board pages

### Phase 8 — Session + Real-Time (Days 7–8)
44. Session feature (list, create, join/leave, status controls)
45. Session page (the main brainstorming view)
46. Wire Socket.IO events to TanStack Query cache

### Phase 9 — Idea Tree + Votes + Clusters (Days 8–9)
47. Idea tree component (hierarchical rendering)
48. Idea CRUD with real-time sync
49. Vote buttons + weight slider
50. Cluster management UI

### Phase 10 — Activity + Analytics (Day 10)
51. Activity feed component
52. Vote analytics dashboard
53. Session analytics page

### Phase 11 — Public + Profile (Day 10)
54. Shared board public view
55. User profile page + change password form
56. Landing page

### Phase 12 — Polish + Testing (Days 11–12)
57. Error boundaries + error pages
58. SEO metadata
59. Performance audit (dynamic imports, Suspense)
60. Unit + integration tests
61. E2E tests
62. CI/CD workflow

---

## 22. Exact Files to Create

### Total: ~90 files

**Configuration (10)**
```
next.config.ts
tailwind.config.ts
tsconfig.json
.eslintrc.json
.prettierrc
vitest.config.ts
playwright.config.ts
.env.example
.husky/pre-commit
.husky/pre-push
```

**App Router (16)**
```
app/layout.tsx
app/error.tsx
app/not-found.tsx
app/global-error.tsx
app/sitemap.ts
app/robots.ts
app/(auth)/layout.tsx
app/(auth)/login/page.tsx
app/(auth)/register/page.tsx
app/(auth)/verify-otp/page.tsx
app/(auth)/forgot-password/page.tsx
app/(auth)/reset-password/page.tsx
app/(dashboard)/layout.tsx
app/(dashboard)/workspaces/page.tsx
app/(dashboard)/workspaces/[workspaceId]/page.tsx
app/(dashboard)/workspaces/[workspaceId]/settings/page.tsx
app/(dashboard)/workspaces/[workspaceId]/boards/[boardId]/page.tsx
app/(dashboard)/workspaces/[workspaceId]/boards/[boardId]/sessions/[sessionId]/page.tsx
app/(dashboard)/profile/page.tsx
app/(marketing)/page.tsx
app/(marketing)/layout.tsx
app/shared/[shareToken]/page.tsx
```

**Types (10)**
```
types/api.types.ts
types/auth.types.ts
types/user.types.ts
types/workspace.types.ts
types/board.types.ts
types/session.types.ts
types/idea.types.ts
types/vote.types.ts
types/cluster.types.ts
types/activity.types.ts
```

**Services (10)**
```
services/api-client.ts
services/auth.service.ts
services/user.service.ts
services/workspace.service.ts
services/board.service.ts
services/session.service.ts
services/idea.service.ts
services/vote.service.ts
services/cluster.service.ts
services/activity.service.ts
```

**Store + Lib (6)**
```
store/auth.store.ts
store/socket.store.ts
lib/utils.ts
lib/query-client.ts
lib/socket.ts
lib/formatters.ts
```

**Providers + Middleware (4)**
```
providers/QueryProvider.tsx
providers/AuthProvider.tsx
providers/SocketProvider.tsx
middleware.ts
```

**Constants (3)**
```
constants/roles.ts
constants/routes.ts
constants/query-keys.ts
```

**Feature Schemas (8)**
```
features/auth/schemas/auth.schemas.ts
features/workspaces/schemas/workspace.schemas.ts
features/boards/schemas/board.schemas.ts
features/sessions/schemas/session.schemas.ts
features/ideas/schemas/idea.schemas.ts
features/votes/schemas/vote.schemas.ts
features/clusters/schemas/cluster.schemas.ts
```

**Feature Hooks (8)**
```
features/auth/hooks/useAuth.ts
features/workspaces/hooks/useWorkspace.ts
features/boards/hooks/useBoard.ts
features/sessions/hooks/useSession.ts
features/ideas/hooks/useIdeas.ts
features/ideas/hooks/useIdeaTree.ts
features/votes/hooks/useVote.ts
features/clusters/hooks/useCluster.ts
features/activity/hooks/useActivity.ts
```

**Feature Components (30+)**
— one file per component listed in the folder structure above.

---

## 23. Code Generation Order

Generate in this exact order to avoid import errors:

```
1.  Configuration files (tsconfig, next.config, tailwind, eslint, prettier)
2.  styles/globals.css
3.  types/* (no imports from project)
4.  constants/* (imports from types only)
5.  lib/utils.ts
6.  lib/formatters.ts
7.  lib/query-client.ts
8.  store/auth.store.ts
9.  store/socket.store.ts
10. lib/socket.ts (imports from types)
11. services/api-client.ts (imports from store)
12. services/*.service.ts (imports from api-client + types)
13. providers/QueryProvider.tsx
14. providers/AuthProvider.tsx (imports from services/auth + store)
15. providers/SocketProvider.tsx (imports from lib/socket + store)
16. app/layout.tsx (mounts providers)
17. middleware.ts
18. components/ui/* (shadcn generated)
19. components/shared/*
20. components/feedback/*
21. components/layout/*
22. components/navigation/*
23. features/auth/schemas/
24. features/auth/hooks/
25. features/auth/components/
26. app/(auth)/* pages
27. features/workspaces/* (schemas → hooks → components)
28. app/(dashboard)/workspaces/* pages
29. features/boards/*
30. features/sessions/*
31. features/ideas/*
32. features/votes/*
33. features/clusters/*
34. features/activity/*
35. app/(dashboard)/sessions/[sessionId]/page.tsx (most complex — last)
36. app/(marketing)/page.tsx
37. app/shared/[shareToken]/page.tsx
38. app/error.tsx, not-found.tsx, global-error.tsx
39. app/sitemap.ts, robots.ts
40. tests/* and e2e/*
41. .github/workflows/ci.yml
```

---

## 24. Potential Risks

| Risk | Severity | Mitigation |
|---|---|---|
| Socket.IO access token expiry during long sessions | High | Reconnect socket on token refresh; pass new token via `socket.auth` |
| Idea tree re-render performance on large trees | High | `React.memo` on `IdeaNode`; use `useIdeaTree` hook for selective subscription |
| Race condition: REST mutation + Socket.IO broadcast conflict | Medium | Optimistic updates; socket event deduplicated by `ideaId` |
| Refresh token absent on page reload | Medium | `AuthProvider` redirects to `/login` if refresh fails |
| Board PDF export: binary response handling | Medium | `axios({ responseType: 'blob' })` + `URL.createObjectURL()` for download |
| Missing notification delivery mechanism | Low | Notification UI deferred; model exists but no routes |
| Avatar URL validation | Low | Zod `.url()` + domain allowlist |
| OTP 10-minute expiry: user confusion | Low | Show countdown timer on OTP page |

---

## 25. Architectural Decisions

| Decision | Choice | Reason |
|---|---|---|
| App Router vs Pages Router | App Router | Required for React Server Components, streaming, metadata API |
| Server State | TanStack Query v5 | Purpose-built for async server state; integrates perfectly with socket cache updates |
| Client State | Zustand | Minimal boilerplate; works outside React (Axios interceptors need store access) |
| Token storage | Memory (access) + sessionStorage (refresh) | XSS-safe for access token; sessionStorage scoped per tab |
| Real-time strategy | Socket events → TanStack Query cache mutation | Single source of truth; no duplicated state |
| Component library | shadcn/ui | Copy-paste primitives; full Tailwind control; accessible |
| Form library | React Hook Form + Zod | Controlled uncontrolled inputs; mirrors backend Zod schemas |
| No file upload | — | Backend `avatar` field is URL-only; no upload endpoint exists |
| Notifications UI deferred | — | `Notification` model exists but zero backend delivery infrastructure |

---

## 26. Environment Configuration

### `.env.example`
```bash
# API
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_WS_URL=http://localhost:5000

# App
NEXT_PUBLIC_APP_NAME="Brainstorm Platform"
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Analytics (optional)
# NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### Variable Categories
| Variable | Exposure | Purpose |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Public (browser) | Backend REST base URL |
| `NEXT_PUBLIC_WS_URL` | Public (browser) | Socket.IO server URL |
| `NEXT_PUBLIC_APP_NAME` | Public | Site name in metadata |
| `NEXT_PUBLIC_BASE_URL` | Public | Canonical URL for SEO |

> All secrets (DB URIs, JWT secrets) live in the backend `.env` only. The frontend has no server secrets.

---

*Architecture plan complete. Awaiting approval to begin code generation.*
