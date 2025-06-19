import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { teardownTestDatabase } from './test.config';
import {
  createTestUser,
  createTestPost,
  cleanupTestData,
} from './test.helpers';

describe('Post Integration Tests', () => {
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

  describe('POST /posts', () => {
    it('should create a new post', async () => {
      const postData = {
        title: 'Test Post',
        body: 'Test Body',
        userId: testUser.id,
      };

      const response = await request(app.getHttpServer())
        .post('/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send(postData)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe(postData.title);
      expect(response.body.body).toBe(postData.body);
      expect(response.body.userId).toBe(testUser.id);
    });
  });

  describe('GET /posts', () => {
    it('should return all posts', async () => {
      const post1 = await createTestPost({
        title: 'Post 1',
        body: 'Body 1',
        userId: testUser.id,
      });

      const post2 = await createTestPost({
        title: 'Post 2',
        body: 'Body 2',
        userId: testUser.id,
      });

      const response = await request(app.getHttpServer())
        .get('/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body[0].title).toBe(post1.title);
      expect(response.body[1].title).toBe(post2.title);
    });
  });

  describe('GET /posts/:id', () => {
    it('should return a specific post', async () => {
      const post = await createTestPost({
        title: 'Test Post',
        body: 'Test Body',
        userId: testUser.id,
      });

      const response = await request(app.getHttpServer())
        .get(`/posts/${post.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.id).toBe(post.id);
      expect(response.body.title).toBe(post.title);
      expect(response.body.body).toBe(post.body);
      expect(response.body.userId).toBe(testUser.id);
    });

    it('should return 404 for non-existent post', async () => {
      await request(app.getHttpServer())
        .get('/posts/99999')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });

  describe('GET /users/:userId/posts', () => {
    it('should return all posts for a specific user', async () => {
      const post1 = await createTestPost({
        title: 'Post 1',
        body: 'Body 1',
        userId: testUser.id,
      });

      const post2 = await createTestPost({
        title: 'Post 2',
        body: 'Body 2',
        userId: testUser.id,
      });

      const response = await request(app.getHttpServer())
        .get(`/users/${testUser.id}/posts`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body[0].title).toBe(post1.title);
      expect(response.body[1].title).toBe(post2.title);
    });
  });
});
