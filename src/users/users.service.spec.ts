import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

describe('UsersService', () => {
  let service: UsersService;

  const mockPrismaService = {
    user: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      const uniqueId = uuidv4();
      const userData = {
        email: `test+${uniqueId}@example.com`,
        password: 'password123',
        name: 'Test User',
        username: `testuser-${uniqueId}`,
      };

      const mockUser = {
        id: 1,
        ...userData,
        createdAt: new Date(),
        updatedAt: new Date(),
        address: null,
        company: null,
        posts: [],
        comments: [],
      };

      mockPrismaService.user.findUnique.mockResolvedValue(null);
      mockPrismaService.user.create.mockResolvedValue(mockUser);

      const result = await service.create(userData);

      expect(result).toEqual(mockUser);
      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: {
          email: userData.email,
          password: userData.password,
          username: userData.username,
          name: userData.name,
          address: undefined,
          company: undefined,
        },
        include: {
          address: {
            include: {
              geo: true,
            },
          },
          company: true,
          posts: true,
          comments: true,
        },
      });
    });

    it('should throw ConflictException if email already exists', async () => {
      const userData = {
        email: 'existing@example.com',
        password: 'password123',
        name: 'Test User',
        username: 'testuser',
      };

      mockPrismaService.user.findUnique.mockResolvedValue({
        id: 1,
        ...userData,
      });

      await expect(service.create(userData)).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const mockUsers = [
        {
          id: 1,
          email: 'test1@example.com',
          name: 'Test User 1',
          username: 'testuser1',
          createdAt: new Date(),
          updatedAt: new Date(),
          address: null,
          company: null,
          posts: [],
          comments: [],
        },
        {
          id: 2,
          email: 'test2@example.com',
          name: 'Test User 2',
          username: 'testuser2',
          createdAt: new Date(),
          updatedAt: new Date(),
          address: null,
          company: null,
          posts: [],
          comments: [],
        },
      ];

      mockPrismaService.user.findMany.mockResolvedValue(mockUsers);

      const result = await service.findAll();

      expect(result).toEqual(mockUsers);
      expect(mockPrismaService.user.findMany).toHaveBeenCalledWith({
        include: {
          address: {
            include: {
              geo: true,
            },
          },
          company: true,
          posts: true,
          comments: true,
        },
      });
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        username: 'testuser',
        createdAt: new Date(),
        updatedAt: new Date(),
        address: null,
        company: null,
        posts: [],
        comments: [],
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.findOne(1);

      expect(result).toEqual(mockUser);
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: {
          address: {
            include: {
              geo: true,
            },
          },
          company: true,
          posts: true,
          comments: true,
        },
      });
    });

    it('should throw NotFoundException if user does not exist', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByEmail', () => {
    it('should return a user by email', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        username: 'testuser',
        createdAt: new Date(),
        updatedAt: new Date(),
        address: null,
        company: null,
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.findByEmail('test@example.com');

      expect(result).toEqual(mockUser);
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
        include: {
          address: {
            include: {
              geo: true,
            },
          },
          company: true,
        },
      });
    });

    it('should return null if user does not exist', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      const result = await service.findByEmail('nonexistent@example.com');

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateData = {
        name: 'Updated User',
        username: 'updateduser',
      };

      const mockUser = {
        id: 1,
        email: 'test@example.com',
        name: 'Updated User',
        username: 'updateduser',
        createdAt: new Date(),
        updatedAt: new Date(),
        address: null,
        company: null,
      };

      mockPrismaService.user.update.mockResolvedValue(mockUser);

      const result = await service.update(1, updateData);

      expect(result).toEqual(mockUser);
      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          ...updateData,
          address: undefined,
          company: undefined,
        },
        include: {
          address: {
            include: {
              geo: true,
            },
          },
          company: true,
        },
      });
    });

    it('should throw NotFoundException if user does not exist', async () => {
      const updateData = {
        name: 'Updated User',
        username: 'updateduser',
      };

      mockPrismaService.user.update.mockRejectedValue(new Error());

      await expect(service.update(999, updateData)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        username: 'testuser',
        createdAt: new Date(),
        updatedAt: new Date(),
        address: null,
        company: null,
      };

      mockPrismaService.user.delete.mockResolvedValue(mockUser);

      const result = await service.remove(1);

      expect(result).toEqual(mockUser);
      expect(mockPrismaService.user.delete).toHaveBeenCalledWith({
        where: { id: 1 },
        include: {
          address: {
            include: {
              geo: true,
            },
          },
          company: true,
        },
      });
    });

    it('should throw NotFoundException if user does not exist', async () => {
      mockPrismaService.user.delete.mockRejectedValue(new Error());

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
