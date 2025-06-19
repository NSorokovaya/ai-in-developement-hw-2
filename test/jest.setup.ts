import {
  setupTestDatabase,
  teardownTestDatabase,
} from './integration/test.config';
import * as dotenv from 'dotenv';

// Load test environment variables
dotenv.config({ path: '.env.test' });

// Increase timeout for integration tests
jest.setTimeout(30000);

// Run migrations once before all tests
beforeAll(async () => {
  await setupTestDatabase();
});

// Global teardown
afterAll(async () => {
  await teardownTestDatabase();
});
