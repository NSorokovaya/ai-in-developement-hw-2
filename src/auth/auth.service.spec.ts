import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let mockPrismaService: any;
  let mockJwtService: any;
  let mockUsersService: any;

  const mockUser = {
    id: 1,
    email: 'test@example.com',
    password: 'password123',
    username: 'testuser',
    name: 'Test User',
  };

  const mockToken = 'mock.jwt.token';

  beforeEach(async () => {
    mockPrismaService = {
      user: {
        findUnique: jest.fn(),
        create: jest.fn(),
      },
    };

    mockJwtService = {
      sign: jest.fn().mockReturnValue(mockToken),
    };

    mockUsersService = {
      findByEmail: jest.fn(),
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should return a JWT token', async () => {
      const hashedPassword = await bcrypt.hash(mockUser.password, 10);
      mockUsersService.findByEmail.mockResolvedValue({
        ...mockUser,
        password: hashedPassword,
      });

      const result = await service.login({
        email: mockUser.email,
        password: mockUser.password,
      });

      expect(result).toEqual({
        access_token: mockToken,
        user: {
          id: mockUser.id,
          email: mockUser.email,
          username: mockUser.username,
          name: mockUser.name,
        },
      });
      expect(mockUsersService.findByEmail).toHaveBeenCalledWith(mockUser.email);
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        sub: mockUser.id,
        email: mockUser.email,
      });
    });

    it('should throw UnauthorizedException for invalid credentials', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);

      await expect(
        service.login({
          email: mockUser.email,
          password: 'wrongpassword',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('register', () => {
    it('should create a new user and return a JWT token', async () => {
      const hashedPassword = await bcrypt.hash(mockUser.password, 10);
      mockUsersService.create.mockResolvedValue({
        ...mockUser,
        password: hashedPassword,
      });

      const createUserDto: CreateUserDto = {
        email: mockUser.email,
        password: mockUser.password,
        username: mockUser.username,
        name: mockUser.name,
      };

      const result = await service.register(createUserDto);

      expect(result).toEqual({
        access_token: mockToken,
        user: {
          id: mockUser.id,
          email: mockUser.email,
          username: mockUser.username,
          name: mockUser.name,
        },
      });
      expect(mockUsersService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          email: mockUser.email,
          username: mockUser.username,
          name: mockUser.name,
        }),
      );
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        sub: mockUser.id,
        email: mockUser.email,
      });
    });
  });
});
