import http from 'http';
import app from './app';
import { env } from './config/env';
import { connectDatabase } from './config/database';

const startServer = async (): Promise<void> => {
  try {
    await connectDatabase();

    const server = http.createServer(app);

    server.listen(env.PORT, () => {
      console.log(`🚀 HTTP Server running on http://localhost:${env.PORT}`);
      console.log(`📚 API Documentation available at http://localhost:${env.PORT}/api-docs`);
      console.log(`🏥 Health check available at http://localhost:${env.PORT}/health`);
      console.log(`🌍 Environment: ${env.NODE_ENV}`);
    });

    const shutdown = async (signal: string) => {
      console.log(`\n${signal} received. Shutting down gracefully...`);

      server.close(() => {
        console.log('✅ HTTP server closed');
        process.exit(0);
      });

      setTimeout(() => {
        console.error('⚠️  Forced shutdown after timeout');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

    process.on('unhandledRejection', (reason, promise) => {
      console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    });

    process.on('uncaughtException', (error) => {
      console.error('Uncaught Exception:', error);
      process.exit(1);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
