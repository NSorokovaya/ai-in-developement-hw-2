import { Test, TestingModule } from '@nestjs/testing';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { CommentsService } from '../comments/comments.service';

describe('PostsController', () => {
  let controller: PostsController;
  let mockPostsService: any;
  let mockCommentsService: any;

  const mockPost = {
    id: 1,
    title: 'Test Post',
    body: 'Test Body',
    userId: 1,
    user: {
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
    },
    comments: [],
  };

  const mockPosts = [mockPost];

  beforeEach(async () => {
    mockPostsService = {
      findAll: jest.fn().mockResolvedValue(mockPosts),
      findOne: jest.fn().mockResolvedValue(mockPost),
      create: jest.fn().mockResolvedValue(mockPost),
      update: jest.fn().mockResolvedValue(mockPost),
      remove: jest.fn().mockResolvedValue(mockPost),
    };

    mockCommentsService = {
      findByPost: jest.fn().mockResolvedValue([]),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostsController],
      providers: [
        {
          provide: PostsService,
          useValue: mockPostsService,
        },
        {
          provide: CommentsService,
          useValue: mockCommentsService,
        },
        {
          provide: PrismaService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<PostsController>(PostsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of posts', async () => {
      const result = await controller.findAll();
      expect(result).toEqual(mockPosts);
      expect(mockPostsService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single post', async () => {
      const result = await controller.findOne('1');
      expect(result).toEqual(mockPost);
      expect(mockPostsService.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('create', () => {
    it('should create a new post', async () => {
      const createPostDto: CreatePostDto = {
        title: 'Test Post',
        body: 'Test Body',
        userId: 1,
      };

      const result = await controller.create(createPostDto);
      expect(result).toEqual(mockPost);
      expect(mockPostsService.create).toHaveBeenCalledWith(createPostDto);
    });
  });

  describe('update', () => {
    it('should update a post', async () => {
      const updatePostDto: UpdatePostDto = {
        title: 'Updated Post',
      };

      const result = await controller.update('1', updatePostDto);
      expect(result).toEqual(mockPost);
      expect(mockPostsService.update).toHaveBeenCalledWith(1, updatePostDto);
    });
  });

  describe('remove', () => {
    it('should remove a post', async () => {
      const result = await controller.remove('1');
      expect(result).toEqual(mockPost);
      expect(mockPostsService.remove).toHaveBeenCalledWith(1);
    });
  });

  describe('findComments', () => {
    it('should return comments for a post', async () => {
      const result = await controller.findComments('1');
      expect(result).toEqual([]);
      expect(mockCommentsService.findByPost).toHaveBeenCalledWith(1);
    });
  });
});
