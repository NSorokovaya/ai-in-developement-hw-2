import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  async create(createCommentDto: CreateCommentDto) {
    if (!createCommentDto.body) {
      throw new BadRequestException('Comment body is required');
    }

    if (!createCommentDto.postId) {
      throw new BadRequestException('Post ID is required');
    }

    if (!createCommentDto.userId) {
      throw new BadRequestException('User ID is required');
    }

    const post = await this.prisma.post.findUnique({
      where: { id: createCommentDto.postId },
    });

    if (!post) {
      throw new NotFoundException(
        `Post with ID ${createCommentDto.postId} not found`,
      );
    }

    return this.prisma.comment.create({
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
  }

  async findAll() {
    return this.prisma.comment.findMany({
      include: {
        post: true,
      },
    });
  }

  async findOne(id: number) {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
      include: {
        post: true,
      },
    });

    if (!comment) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }

    return comment;
  }

  async findByPost(postId: number) {
    return this.prisma.comment.findMany({
      where: { postId },
      include: {
        post: true,
      },
    });
  }

  async findByUser(userId: number) {
    return this.prisma.comment.findMany({
      where: { userId },
      include: {
        post: true,
        user: true,
      },
    });
  }

  async update(id: number, updateCommentDto: UpdateCommentDto) {
    try {
      return await this.prisma.comment.update({
        where: { id },
        data: updateCommentDto,
        include: {
          post: true,
        },
      });
    } catch {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.comment.delete({
        where: { id },
        include: {
          post: true,
        },
      });
    } catch {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }
  }
}
