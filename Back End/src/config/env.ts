import dotenv from 'dotenv';

dotenv.config();

interface EnvConfig {
  PORT: number;
  MONGO_URI: string;
  JWT_SECRET: string;
  NODE_ENV: string;
}

const requiredEnvVars = [
  'MONGO_URI',
  'JWT_SECRET',
];

const validateEnv = (): void => {
  const missing = requiredEnvVars.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`
    );
  }
};

validateEnv();

export const env: EnvConfig = {
  PORT: parseInt(process.env.PORT || '3000', 10),
  MONGO_URI: process.env.MONGO_URI!,
  JWT_SECRET: process.env.JWT_SECRET!,
  NODE_ENV: process.env.NODE_ENV || 'development',
};
