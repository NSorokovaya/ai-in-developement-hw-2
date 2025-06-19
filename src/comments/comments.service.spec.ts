import { Test, TestingModule } from '@nestjs/testing';
import { CommentsService } from './comments.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('CommentsService', () => {
  let service: CommentsService;

  const mockPrismaService = {
    comment: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    post: {
      findUnique: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<CommentsService>(CommentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a comment', async () => {
      const createCommentDto: CreateCommentDto = {
        name: 'Test Comment',
        email: 'test@example.com',
        body: 'Test body',
        postId: 1,
        userId: 1,
      };

      const mockPost = { id: 1, title: 'Test Post' };
      const mockUser = { id: 1, name: 'Test User' };
      const mockComment = {
        id: 1,
        ...createCommentDto,
        createdAt: new Date(),
        updatedAt: new Date(),
        post: mockPost,
        user: mockUser,
      };

      mockPrismaService.post.findUnique.mockResolvedValue(mockPost);
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      mockPrismaService.comment.create.mockResolvedValue(mockComment);

      const result = await service.create(createCommentDto);

      expect(result).toEqual(mockComment);
      expect(mockPrismaService.post.findUnique).toHaveBeenCalledWith({
        where: { id: createCommentDto.postId },
      });
      expect(mockPrismaService.comment.create).toHaveBeenCalledWith({
        data: {
          body: createCommentDto.body,
          name: createCommentDto.name,
          email: createCommentDto.email,
          post: {
            connect: {
              id: createCommentDto.postId,
            },
          },
          user: {
            connect: {
              id: createCommentDto.userId,
            },
          },
        },
        include: {
          post: true,
          user: true,
        },
      });
    });

    it('should throw BadRequestException if body is missing', async () => {
      const createCommentDto: CreateCommentDto = {
        name: 'Test Comment',
        email: 'test@example.com',
        body: '',
        postId: 1,
        userId: 1,
      };

      await expect(service.create(createCommentDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if postId is missing', async () => {
      const createCommentDto: CreateCommentDto = {
        name: 'Test Comment',
        email: 'test@example.com',
        body: 'Test body',
        postId: null,
        userId: 1,
      };

      await expect(service.create(createCommentDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if userId is missing', async () => {
      const createCommentDto: CreateCommentDto = {
        name: 'Test Comment',
        email: 'test@example.com',
        body: 'Test body',
        postId: 1,
        userId: null,
      };

      await expect(service.create(createCommentDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw NotFoundException if post does not exist', async () => {
      const createCommentDto: CreateCommentDto = {
        name: 'Test Comment',
        email: 'test@example.com',
        body: 'Test body',
        postId: 999,
        userId: 1,
      };

      mockPrismaService.post.findUnique.mockResolvedValue(null);

      await expect(service.create(createCommentDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of comments', async () => {
      const mockComments = [
        {
          id: 1,
          name: 'Test Comment 1',
          email: 'test1@example.com',
          body: 'Test body 1',
          postId: 1,
          userId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          post: { id: 1, title: 'Test Post 1' },
        },
        {
          id: 2,
          name: 'Test Comment 2',
          email: 'test2@example.com',
          body: 'Test body 2',
          postId: 1,
          userId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          post: { id: 1, title: 'Test Post 1' },
        },
      ];

      mockPrismaService.comment.findMany.mockResolvedValue(mockComments);

      const result = await service.findAll();

      expect(result).toEqual(mockComments);
      expect(mockPrismaService.comment.findMany).toHaveBeenCalledWith({
        include: {
          post: true,
        },
      });
    });
  });

  describe('findOne', () => {
    it('should return a comment by id', async () => {
      const mockComment = {
        id: 1,
        name: 'Test Comment',
        email: 'test@example.com',
        body: 'Test body',
        postId: 1,
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        post: { id: 1, title: 'Test Post' },
      };

      mockPrismaService.comment.findUnique.mockResolvedValue(mockComment);

      const result = await service.findOne(1);

      expect(result).toEqual(mockComment);
      expect(mockPrismaService.comment.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: {
          post: true,
        },
      });
    });

    it('should throw NotFoundException if comment does not exist', async () => {
      mockPrismaService.comment.findUnique.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByPost', () => {
    it('should return comments by post id', async () => {
      const mockComments = [
        {
          id: 1,
          name: 'Test Comment 1',
          email: 'test1@example.com',
          body: 'Test body 1',
          postId: 1,
          userId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          post: { id: 1, title: 'Test Post 1' },
        },
        {
          id: 2,
          name: 'Test Comment 2',
          email: 'test2@example.com',
          body: 'Test body 2',
          postId: 1,
          userId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          post: { id: 1, title: 'Test Post 1' },
        },
      ];

      mockPrismaService.comment.findMany.mockResolvedValue(mockComments);

      const result = await service.findByPost(1);

      expect(result).toEqual(mockComments);
      expect(mockPrismaService.comment.findMany).toHaveBeenCalledWith({
        where: { postId: 1 },
        include: {
          post: true,
        },
      });
    });
  });

  describe('findByUser', () => {
    it('should return comments by user id', async () => {
      const mockComments = [
        {
          id: 1,
          name: 'Test Comment 1',
          email: 'test1@example.com',
          body: 'Test body 1',
          postId: 1,
          userId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          post: { id: 1, title: 'Test Post 1' },
          user: { id: 1, name: 'Test User 1' },
        },
        {
          id: 2,
          name: 'Test Comment 2',
          email: 'test2@example.com',
          body: 'Test body 2',
          postId: 1,
          userId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          post: { id: 1, title: 'Test Post 1' },
          user: { id: 1, name: 'Test User 1' },
        },
      ];

      mockPrismaService.comment.findMany.mockResolvedValue(mockComments);

      const result = await service.findByUser(1);

      expect(result).toEqual(mockComments);
      expect(mockPrismaService.comment.findMany).toHaveBeenCalledWith({
        where: { userId: 1 },
        include: {
          post: true,
          user: true,
        },
      });
    });
  });

  describe('update', () => {
    it('should update a comment', async () => {
      const updateCommentDto: UpdateCommentDto = {
        name: 'Updated Comment',
        body: 'Updated body',
      };

      const mockComment = {
        id: 1,
        name: 'Updated Comment',
        email: 'test@example.com',
        body: 'Updated body',
        postId: 1,
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        post: { id: 1, title: 'Test Post' },
      };

      mockPrismaService.comment.update.mockResolvedValue(mockComment);

      const result = await service.update(1, updateCommentDto);

      expect(result).toEqual(mockComment);
      expect(mockPrismaService.comment.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: updateCommentDto,
        include: {
          post: true,
        },
      });
    });

    it('should throw NotFoundException if comment does not exist', async () => {
      const updateCommentDto: UpdateCommentDto = {
        name: 'Updated Comment',
        body: 'Updated body',
      };

      mockPrismaService.comment.update.mockRejectedValue(new Error());

      await expect(service.update(999, updateCommentDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove a comment', async () => {
      const mockComment = {
        id: 1,
        name: 'Test Comment',
        email: 'test@example.com',
        body: 'Test body',
        postId: 1,
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        post: { id: 1, title: 'Test Post' },
      };

      mockPrismaService.comment.delete.mockResolvedValue(mockComment);

      const result = await service.remove(1);

      expect(result).toEqual(mockComment);
      expect(mockPrismaService.comment.delete).toHaveBeenCalledWith({
        where: { id: 1 },
        include: {
          post: true,
        },
      });
    });

    it('should throw NotFoundException if comment does not exist', async () => {
      mockPrismaService.comment.delete.mockRejectedValue(new Error());

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
