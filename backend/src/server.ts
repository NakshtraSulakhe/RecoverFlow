import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import rateLimit from 'express-rate-limit';

import { config } from './config';
import { logger } from './utils/logger';
import { errorHandler } from './middleware/errorHandler';
import { notFoundHandler } from './middleware/notFoundHandler';
import { requestLogger } from './middleware/requestLogger';

import { authRoutes } from './routes/auth.routes';
import { tenantRoutes } from './routes/tenant.routes';
import { subscriptionRoutes } from './routes/subscription.routes';
import { moduleRoutes } from './routes/module.routes';
import { tenantModuleRoutes } from './routes/tenant-module.routes';
import { userRoutes } from './routes/user.routes';
import { customerRoutes } from './routes/customer.routes';
import { loanRoutes } from './routes/loan.routes';
import { recoveryRoutes } from './routes/recovery.routes';
import { aiRoutes } from './routes/ai.routes';
import { departmentRoutes } from './routes/department.routes';
import { teamRoutes } from './routes/team.routes';
import { roleRoutes } from './routes/role.routes';
import { permissionRoutes } from './routes/permission.routes';
import { userProvisioningRoutes } from './routes/userProvisioning.routes';
import domainPackRoutes from './routes/domain-pack.routes';
import businessUnitRoutes from './routes/business-unit.routes';
import organizationConfigRoutes from './routes/organization-configuration.routes';
import workflowTemplateRoutes from './routes/workflow-template.routes';
import businessRuleRoutes from './routes/business-rule.routes';
import industryTemplateRoutes from './routes/industry-template.routes';
import dashboardWidgetRoutes from './routes/dashboard-widget.routes';
import caseStatusRoutes from './routes/case-status.routes';
import activityTypeRoutes from './routes/activity-type.routes';
import caseTypeRoutes from './routes/case-type.routes';
import customFieldRoutes from './routes/custom-field.routes';
import communicationTemplateRoutes from './routes/communication-template.routes';

const app: Application = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: config.env === 'production' ? undefined : false,
  crossOriginEmbedderPolicy: false
}));

// CORS configuration
app.use(cors({
  origin: config.env === 'development' ? '*' : config.cors.origin,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Tenant-ID']
}));

// Compression
app.use(compression());

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
if (config.env !== 'test') {
  app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }));
}

// Custom request logger
app.use(requestLogger);

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.env,
    version: '1.0.0'
  });
});

// API Documentation
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'RecoverFlow API',
      version: '1.0.0',
      description: 'Enterprise Multi-Tenant AI-Powered Debt Recovery & Collection Platform API',
      contact: {
        name: 'RecoverFlow Support',
        email: 'support@recoverflow.com'
      }
    },
    servers: [
      {
        url: `http://localhost:${config.port}`,
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string' },
            errors: { type: 'array', items: { type: 'object' } }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.ts']
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// API Routes
app.use(`${config.apiPrefix}/auth`, authRoutes);
app.use(`${config.apiPrefix}/tenants`, tenantRoutes);
app.use(`${config.apiPrefix}/subscriptions`, subscriptionRoutes);
app.use(`${config.apiPrefix}/modules`, moduleRoutes);
app.use(`${config.apiPrefix}/tenant-modules`, tenantModuleRoutes);
app.use(`${config.apiPrefix}/users`, userRoutes);
app.use(`${config.apiPrefix}/customers`, customerRoutes);
app.use(`${config.apiPrefix}/loans`, loanRoutes);
app.use(`${config.apiPrefix}/recovery`, recoveryRoutes);
app.use(`${config.apiPrefix}/ai`, aiRoutes);
app.use(`${config.apiPrefix}/departments`, departmentRoutes);
app.use(`${config.apiPrefix}/teams`, teamRoutes);
app.use(`${config.apiPrefix}/roles`, roleRoutes);
app.use(`${config.apiPrefix}/permissions`, permissionRoutes);
app.use(`${config.apiPrefix}/user-provisioning`, userProvisioningRoutes);
app.use(`${config.apiPrefix}/domain-packs`, domainPackRoutes);
app.use(`${config.apiPrefix}/business-units`, businessUnitRoutes);
app.use(`${config.apiPrefix}/organization-config`, organizationConfigRoutes);
app.use(`${config.apiPrefix}/workflow-templates`, workflowTemplateRoutes);
app.use(`${config.apiPrefix}/business-rules`, businessRuleRoutes);
app.use(`${config.apiPrefix}/industry-templates`, industryTemplateRoutes);
app.use(`${config.apiPrefix}/dashboard-widgets`, dashboardWidgetRoutes);
app.use(`${config.apiPrefix}/case-statuses`, caseStatusRoutes);
app.use(`${config.apiPrefix}/activity-types`, activityTypeRoutes);
app.use(`${config.apiPrefix}/case-types`, caseTypeRoutes);
app.use(`${config.apiPrefix}/custom-fields`, customFieldRoutes);
app.use(`${config.apiPrefix}/communication-templates`, communicationTemplateRoutes);

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

// Start server
const PORT = config.port;
app.listen(PORT, () => {
  logger.info(`ðŸš€ Server running on port ${PORT} in ${config.env} mode`);
  logger.info(`ðŸ“š API Documentation available at http://localhost:${PORT}/api-docs`);
  logger.info(`ðŸ¥ Health check available at http://localhost:${PORT}/health`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT signal received: closing HTTP server');
  process.exit(0);
});

export default app;




