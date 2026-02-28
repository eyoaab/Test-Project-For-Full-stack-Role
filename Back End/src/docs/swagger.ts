export const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CRM API Documentation',
      version: '1.0.0',
      description:
        'Production-ready CRM backend API with authentication and role-based access control',
      contact: {
        name: 'API Support',
        email: 'support@example.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000/api/v1',
        description: 'Development HTTP server',
      },
      {
        url: 'https://test-project-for-full-stack-role.onrender.com/api/v1',
        description: 'Production HTTPS server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'User ID',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
            },
            role: {
              type: 'string',
              enum: ['user', 'manager'],
              description: 'User role',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Entry: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Entry ID',
            },
            title: {
              type: 'string',
              maxLength: 200,
              description: 'Entry title',
            },
            description: {
              type: 'string',
              maxLength: 2000,
              description: 'Entry description',
            },
            amount: {
              type: 'number',
              minimum: 0,
              description: 'Entry amount',
            },
            status: {
              type: 'string',
              enum: ['pending', 'approved', 'rejected'],
              description: 'Entry status',
            },
            createdBy: {
              type: 'string',
              description: 'User ID who created the entry',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            message: {
              type: 'string',
              description: 'Error message',
            },
          },
        },
      },
    },
    tags: [
      {
        name: 'Authentication',
        description: 'Authentication endpoints',
      },
      {
        name: 'Entries',
        description: 'Entry management endpoints',
      },
    ],
  },
  apis: ['./src/routes/*.ts'],
};
