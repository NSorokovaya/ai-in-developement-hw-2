import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async create(createPostDto: CreatePostDto) {
    if (!createPostDto.title) {
      throw new BadRequestException('Post title is required');
    }

    if (!createPostDto.body) {
      throw new BadRequestException('Post body is required');
    }

    if (!createPostDto.userId) {
      throw new BadRequestException('User ID is required');
    }

    return this.prisma.post.create({
      data: createPostDto,
      include: {
        user: true,
        comments: true,
      },
    });
  }

  async findAll() {
    return this.prisma.post.findMany({
      include: {
        user: true,
        comments: true,
      },
    });
  }

  async findOne(id: number) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: {
        user: true,
        comments: true,
      },
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    return post;
  }

  async findByUser(userId: number) {
    return this.prisma.post.findMany({
      where: { userId },
      include: {
        user: true,
        comments: true,
      },
    });
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    try {
      return await this.prisma.post.update({
        where: { id },
        data: updatePostDto,
        include: {
          user: true,
          comments: true,
        },
      });
    } catch {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.post.delete({
        where: { id },
        include: {
          user: true,
          comments: true,
        },
      });
    } catch {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
  }
}
