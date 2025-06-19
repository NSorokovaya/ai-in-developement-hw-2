import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PostsService } from '../posts/posts.service';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let mockUsersService: any;
  let mockPostsService: any;

  const mockUser = {
    id: 1,
    email: 'test@example.com',
    username: 'testuser',
    name: 'Test User',
    address: {
      street: 'Test Street',
      suite: 'Test Suite',
      city: 'Test City',
      zipcode: '12345',
      geo: {
        lat: '0',
        lng: '0',
      },
    },
    company: {
      name: 'Test Company',
      catchPhrase: 'Test Catch Phrase',
      bs: 'Test BS',
    },
  };

  const mockPost = {
    id: 1,
    title: 'Test Post',
    body: 'Test Body',
    userId: 1,
  };

  beforeEach(async () => {
    mockUsersService = {
      findAll: jest.fn().mockResolvedValue([mockUser]),
      findOne: jest.fn().mockResolvedValue(mockUser),
      update: jest.fn().mockResolvedValue(mockUser),
      remove: jest.fn().mockResolvedValue(mockUser),
    };

    mockPostsService = {
      findByUser: jest.fn().mockResolvedValue([mockPost]),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: PostsService,
          useValue: mockPostsService,
        },
        {
          provide: PrismaService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const result = await controller.findAll();
      expect(result).toEqual([mockUser]);
      expect(mockUsersService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single user', async () => {
      const result = await controller.findOne('1');
      expect(result).toEqual(mockUser);
      expect(mockUsersService.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateUserDto: UpdateUserDto = {
        name: 'Updated Name',
      };

      const result = await controller.update('1', updateUserDto);
      expect(result).toEqual(mockUser);
      expect(mockUsersService.update).toHaveBeenCalledWith(1, updateUserDto);
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      const result = await controller.remove('1');
      expect(result).toEqual(mockUser);
      expect(mockUsersService.remove).toHaveBeenCalledWith(1);
    });
  });

  describe('findPosts', () => {
    it('should return user posts', async () => {
      const result = await controller.findPosts('1');
      expect(result).toEqual([mockPost]);
      expect(mockPostsService.findByUser).toHaveBeenCalledWith(1);
    });
  });
});
