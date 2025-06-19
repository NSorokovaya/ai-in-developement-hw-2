import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CommentsService } from '../comments/comments.service';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly commentsService: CommentsService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new post' })
  @ApiBody({ type: CreatePostDto, description: 'Post data' })
  @ApiResponse({
    status: 201,
    description: 'Post successfully created.',
    type: CreatePostDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request. Invalid post data provided.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. JWT token is missing or invalid.',
  })
  create(@Body() createPostDto: CreatePostDto) {
    return this.postsService.create(createPostDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all posts' })
  @ApiResponse({
    status: 200,
    description: 'Return all posts.',
    type: [CreatePostDto],
  })
  findAll() {
    return this.postsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a post by id' })
  @ApiParam({ name: 'id', description: 'Post ID' })
  @ApiResponse({
    status: 200,
    description: 'Return the post.',
    type: CreatePostDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Post not found.',
  })
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(+id);
  }

  @Get(':id/comments')
  @ApiOperation({ summary: 'Get all comments for a post' })
  @ApiResponse({
    status: 200,
    description: 'Return all comments for the post.',
  })
  @ApiResponse({ status: 404, description: 'Post not found.' })
  findComments(@Param('id') id: string) {
    return this.commentsService.findByPost(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a post' })
  @ApiParam({ name: 'id', description: 'Post ID' })
  @ApiBody({ type: UpdatePostDto, description: 'Updated post data' })
  @ApiResponse({
    status: 200,
    description: 'Post successfully updated.',
    type: CreatePostDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Post not found.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. JWT token is missing or invalid.',
  })
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(+id, updatePostDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a post' })
  @ApiParam({ name: 'id', description: 'Post ID' })
  @ApiResponse({
    status: 200,
    description: 'Post successfully deleted.',
    type: CreatePostDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Post not found.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. JWT token is missing or invalid.',
  })
  remove(@Param('id') id: string) {
    return this.postsService.remove(+id);
  }
}
