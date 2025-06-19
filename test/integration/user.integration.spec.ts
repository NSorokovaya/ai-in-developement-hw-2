import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { teardownTestDatabase } from './test.config';
import { cleanupTestData, createTestUser } from './test.helpers';
import { v4 as uuidv4 } from 'uuid';

describe('User Integration Tests', () => {
  let app: INestApplication;
  let testUser;
  let authToken;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await cleanupTestData();
    await teardownTestDatabase();
    await app.close();
  });

  beforeEach(async () => {
    await cleanupTestData();
    testUser = await createTestUser({
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User',
      username: 'testuser',
    });

    // Get auth token
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: testUser.email,
        password: 'password123',
      });

    authToken = loginResponse.body.access_token;
  });

  describe('POST /auth/register', () => {
    it('should create a new user', async () => {
      const uniqueId = uuidv4();
      const userData = {
        email: `newuser+${uniqueId}@example.com`,
        password: 'password123',
        name: 'New User',
        username: `newuser-${uniqueId}`,
      };

      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty('access_token');
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user.email).toBe(userData.email);
      expect(response.body.user.name).toBe(userData.name);
      expect(response.body.user.username).toBe(userData.username);
    });

    it('should not create a user with duplicate email', async () => {
      const userData = {
        email: testUser.email,
        password: 'password123',
        name: 'Duplicate User',
        username: 'duplicateuser',
      };

      await request(app.getHttpServer())
        .post('/auth/register')
        .send(userData)
        .expect(409);
    });
  });

  describe('GET /users', () => {
    it('should return all users', async () => {
      const response = await request(app.getHttpServer())
        .get('/users')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].email).toBe(testUser.email);
      expect(response.body[0].name).toBe(testUser.name);
      expect(response.body[0].username).toBe(testUser.username);
    });
  });

  describe('GET /users/:id', () => {
    it('should return a specific user', async () => {
      const response = await request(app.getHttpServer())
        .get(`/users/${testUser.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.id).toBe(testUser.id);
      expect(response.body.email).toBe(testUser.email);
      expect(response.body.name).toBe(testUser.name);
      expect(response.body.username).toBe(testUser.username);
    });

    it('should return 404 for non-existent user', async () => {
      await request(app.getHttpServer())
        .get('/users/99999')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });
});
