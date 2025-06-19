import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from './posts.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

describe('PostsService', () => {
  let service: PostsService;
  let mockPrismaService: any;

  const mockPost = {
    id: 1,
    title: 'Test Post',
    body: 'Test Content',
    userId: 1,
    user: { id: 1, name: 'Test User' },
    comments: [],
  };

  const createPostDto: CreatePostDto = {
    title: 'Test Post',
    body: 'Test Content',
    userId: 1,
  };

  const updatePostDto: UpdatePostDto = {
    title: 'Updated Title',
  };

  const expectedPost = {
    ...mockPost,
    user: { id: 1, name: 'Test User' },
    comments: [],
  };

  const expectedPosts = [expectedPost];

  beforeEach(async () => {
    mockPrismaService = {
      post: {
        create: jest.fn().mockResolvedValue(mockPost),
        findMany: jest.fn().mockResolvedValue([mockPost]),
        findUnique: jest.fn().mockResolvedValue(mockPost),
        update: jest.fn().mockResolvedValue(mockPost),
        delete: jest.fn().mockResolvedValue(mockPost),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a post', async () => {
      const result = await service.create(createPostDto);
      expect(result).toEqual(expectedPost);
      expect(mockPrismaService.post.create).toHaveBeenCalledWith({
        data: createPostDto,
        include: {
          user: true,
          comments: true,
        },
      });
    });
  });

  describe('findAll', () => {
    it('should return all posts', async () => {
      const result = await service.findAll();
      expect(result).toEqual(expectedPosts);
      expect(mockPrismaService.post.findMany).toHaveBeenCalledWith({
        include: {
          user: true,
          comments: true,
        },
      });
    });
  });

  describe('findOne', () => {
    it('should return a post by id', async () => {
      const result = await service.findOne(1);
      expect(result).toEqual(expectedPost);
      expect(mockPrismaService.post.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: {
          user: true,
          comments: true,
        },
      });
    });
  });

  describe('findByUser', () => {
    it('should return posts by user id', async () => {
      const result = await service.findByUser(1);
      expect(result).toEqual(expectedPosts);
      expect(mockPrismaService.post.findMany).toHaveBeenCalledWith({
        where: { userId: 1 },
        include: {
          user: true,
          comments: true,
        },
      });
    });
  });

  describe('update', () => {
    it('should update a post', async () => {
      const result = await service.update(1, updatePostDto);
      expect(result).toEqual(expectedPost);
      expect(mockPrismaService.post.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: updatePostDto,
        include: {
          user: true,
          comments: true,
        },
      });
    });
  });

  describe('remove', () => {
    it('should remove a post', async () => {
      const result = await service.remove(1);
      expect(result).toEqual(expectedPost);
      expect(mockPrismaService.post.delete).toHaveBeenCalledWith({
        where: { id: 1 },
        include: {
          user: true,
          comments: true,
        },
      });
    });
  });
});
