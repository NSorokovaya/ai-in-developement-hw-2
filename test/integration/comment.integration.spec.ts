import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { teardownTestDatabase } from './test.config';
import {
  createTestUser,
  createTestPost,
  createTestComment,
  cleanupTestData,
} from './test.helpers';

describe('Comment Integration Tests', () => {
  let app: INestApplication;
  let testUser;
  let testPost;
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

    testPost = await createTestPost({
      title: 'Test Post',
      body: 'Test Body',
      userId: testUser.id,
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

  describe('POST /comments', () => {
    it('should create a new comment', async () => {
      const commentData = {
        name: 'Test Comment',
        email: 'comment@example.com',
        body: 'This is a test comment',
        postId: testPost.id,
        userId: testUser.id,
      };

      const response = await request(app.getHttpServer())
        .post('/comments')
        .set('Authorization', `Bearer ${authToken}`)
        .send(commentData)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(commentData.name);
      expect(response.body.email).toBe(commentData.email);
      expect(response.body.body).toBe(commentData.body);
      expect(response.body.postId).toBe(testPost.id);
      expect(response.body.userId).toBe(testUser.id);
    });
  });

  describe('GET /comments', () => {
    it('should return all comments', async () => {
      const comment1 = await createTestComment({
        name: 'Comment 1',
        email: 'comment1@example.com',
        body: 'Body 1',
        postId: testPost.id,
        userId: testUser.id,
      });

      const comment2 = await createTestComment({
        name: 'Comment 2',
        email: 'comment2@example.com',
        body: 'Body 2',
        postId: testPost.id,
        userId: testUser.id,
      });

      const response = await request(app.getHttpServer())
        .get('/comments')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body[0].name).toBe(comment1.name);
      expect(response.body[1].name).toBe(comment2.name);
    });
  });

  describe('GET /comments/:id', () => {
    it('should return a specific comment', async () => {
      const comment = await createTestComment({
        name: 'Test Comment',
        email: 'comment@example.com',
        body: 'Test Body',
        postId: testPost.id,
        userId: testUser.id,
      });

      const response = await request(app.getHttpServer())
        .get(`/comments/${comment.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.id).toBe(comment.id);
      expect(response.body.name).toBe(comment.name);
      expect(response.body.email).toBe(comment.email);
      expect(response.body.body).toBe(comment.body);
      expect(response.body.postId).toBe(testPost.id);
      expect(response.body.userId).toBe(testUser.id);
    });

    it('should return 404 for non-existent comment', async () => {
      await request(app.getHttpServer())
        .get('/comments/99999')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });

  describe('GET /posts/:postId/comments', () => {
    it('should return all comments for a specific post', async () => {
      const comment1 = await createTestComment({
        name: 'Comment 1',
        email: 'comment1@example.com',
        body: 'Body 1',
        postId: testPost.id,
        userId: testUser.id,
      });

      const comment2 = await createTestComment({
        name: 'Comment 2',
        email: 'comment2@example.com',
        body: 'Body 2',
        postId: testPost.id,
        userId: testUser.id,
      });

      const response = await request(app.getHttpServer())
        .get(`/posts/${testPost.id}/comments`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body[0].name).toBe(comment1.name);
      expect(response.body[1].name).toBe(comment2.name);
    });
  });
});
