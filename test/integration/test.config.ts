import { execSync } from 'child_process';
import { join } from 'path';
import * as dotenv from 'dotenv';

// Load test environment variables
dotenv.config({ path: '.env.test' });

// Override DATABASE_URL for local testing
// process.env.DATABASE_URL='postgresql://postgres:postgres@localhost:5432/postgres';

const prismaBinary = join(
  __dirname,
  '..',
  '..',
  'node_modules',
  '.bin',
  'prisma',
);

// export const prisma = new PrismaClient(); // This instance is created too early

export const setupTestDatabase = async () => {
  // Load variables from .env.test
  const testEnv = dotenv.config({ path: '.env.test' }).parsed;

  if (!testEnv || !testEnv.DATABASE_URL) {
    throw new Error('DATABASE_URL not found in .env.test');
  }

  // Run migrations in a clean environment, providing only the necessary variables.
  // This prevents Prisma from getting confused by other variables in process.env or the main .env file.
  execSync(`${prismaBinary} migrate deploy`, {
    env: {
      PATH: process.env.PATH,
      DATABASE_URL: testEnv.DATABASE_URL,
    },
  });
};

export const teardownTestDatabase = async () => {
  // await prisma.$disconnect(); // This will be handled by the adapter/service
};
