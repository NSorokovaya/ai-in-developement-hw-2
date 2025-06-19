import { AuthService } from '../../src/auth/auth.service';
import { UsersService } from '../../src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../src/prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';

// Load test environment variables to be available for the adapter
dotenv.config({ path: '.env.test' });

// Create a simple adapter for PrismaClient
class PrismaAdapter extends PrismaService {
  constructor() {
    // Manually create a ConfigService instance for the test helper
    const configService = new ConfigService({
      DATABASE_URL: process.env.DATABASE_URL,
    });
    super(configService);
    this.$connect();
  }
}

// Keep track of created test data IDs
const testData = {
  userIds: new Set<number>(),
  postIds: new Set<number>(),
  commentIds: new Set<number>(),
};

// Create services for user creation
const prismaAdapter = new PrismaAdapter();
const usersService = new UsersService(prismaAdapter);
const jwtService = new JwtService({
  secret: process.env.JWT_SECRET,
});
const authService = new AuthService(usersService, jwtService);

export const createTestUser = async (data: {
  email: string;
  password: string;
  name: string;
  username: string;
}) => {
  try {
    // Generate unique email and username
    const uniqueId = uuidv4();
    const uniqueEmail = `${data.email.split('@')[0]}+${uniqueId}@${data.email.split('@')[1]}`;
    const uniqueUsername = `${data.username}-${uniqueId}`;

    const userData = {
      ...data,
      email: uniqueEmail,
      username: uniqueUsername,
    };

    // Use auth service to create user with hashed password
    const { user } = await authService.register(userData);

    // Add address and company data
    const updatedUser = await prismaAdapter.user.update({
      where: { id: user.id },
      data: {
        address: {
          create: {
            street: 'Test Street',
            suite: 'Test Suite',
            city: 'Test City',
            zipcode: '12345',
            geo: {
              create: {
                lat: '0',
                lng: '0',
              },
            },
          },
        },
        company: {
          create: {
            name: 'Test Company',
            catchPhrase: 'Test Catch Phrase',
            bs: 'Test BS',
          },
        },
      },
    });

    testData.userIds.add(updatedUser.id);
    return updatedUser;
  } catch (error) {
    throw error;
  }
};

export const createTestPost = async (data: {
  title: string;
  body: string;
  userId: number;
}) => {
  try {
    const post = await prismaAdapter.post.create({
      data,
    });
    testData.postIds.add(post.id);
    return post;
  } catch (error) {
    throw error;
  }
};

export const createTestComment = async (data: {
  name: string;
  email: string;
  body: string;
  postId: number;
  userId: number;
}) => {
  try {
    const comment = await prismaAdapter.comment.create({
      data,
    });
    testData.commentIds.add(comment.id);
    return comment;
  } catch (error) {
    throw error;
  }
};

export const cleanupTestData = async () => {
  try {
    // Delete all data in correct order
    // First delete all comments
    await prismaAdapter.comment.deleteMany({});
    testData.commentIds.clear();

    // Then delete all posts
    await prismaAdapter.post.deleteMany({});
    testData.postIds.clear();

    // Then delete all addresses and their geo data
    const addresses = await prismaAdapter.address.findMany({});
    if (addresses.length > 0) {
      // Delete Geo records first
      await prismaAdapter.geo.deleteMany({
        where: {
          addressId: {
            in: addresses.map((addr) => addr.id),
          },
        },
      });

      // Then delete addresses
      await prismaAdapter.address.deleteMany({});
    }

    // Delete all companies
    await prismaAdapter.company.deleteMany({});

    // Finally delete all users
    await prismaAdapter.user.deleteMany({});
    testData.userIds.clear();
  } catch (error) {
    throw error;
  }
};
