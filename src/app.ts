import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { env } from './config/env';
import { swaggerSpec } from './config/swagger';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';
import { generalLimiter } from './middleware/rateLimiter.middleware';

// Route imports
import authRoutes from './modules/auth/auth.routes';
import userRoutes from './modules/users/user.routes';
import workspaceRoutes from './modules/workspaces/workspace.routes';
import boardRoutes from './modules/boards/board.routes';
import sessionRoutes from './modules/sessions/session.routes';
import ideaRoutes from './modules/ideas/idea.routes';
import voteRoutes from './modules/votes/vote.routes';
import clusterRoutes from './modules/clusters/cluster.routes';
import activityRoutes from './modules/activity/activity.routes';

/**
 * Express Application Setup
 * Configures middleware stack and mounts all API routes.
 * Separated from server.ts for testability.
 */
const app = express();

// ==================== SECURITY MIDDLEWARE ====================
app.use(helmet());                              // Secure HTTP headers
app.use(cors({
  origin: env.CORS_ORIGIN,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(generalLimiter);                        // Rate limiting

// ==================== PARSING MIDDLEWARE ====================
app.use(express.json({ limit: '10mb' }));       // JSON body parser
app.use(express.urlencoded({ extended: true })); // URL-encoded form data

// ==================== ROOT & HEALTH CHECK ====================
app.get('/', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to the Brainstorm Platform API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      users: '/api/users',
      workspaces: '/api/workspaces',
      boards: '/api/boards',
      sessions: '/api/sessions',
      ideas: '/api/ideas',
      votes: '/api/votes',
      clusters: '/api/clusters',
      activity: '/api/activity',
    },
    docs: '/api-docs',
  });
});

app.get('/api/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Brainstorm Platform API is running',
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// ==================== SWAGGER API DOCS ====================
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Brainstorm Platform API Docs',
}));
app.get('/api-docs.json', (_req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// ==================== API ROUTES ====================
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/workspaces', workspaceRoutes);
app.use('/api/boards', boardRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/ideas', ideaRoutes);
app.use('/api/votes', voteRoutes);
app.use('/api/clusters', clusterRoutes);
app.use('/api/activity', activityRoutes);

// ==================== ERROR HANDLING ====================
app.use(notFoundHandler);                       // 404 catch-all
app.use(errorHandler);                          // Global error handler

export default app;
