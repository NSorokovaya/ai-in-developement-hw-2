import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  MinLength,
  IsNumber,
  IsEmail,
} from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({
    example: 'This is a great post!',
    description: 'The content of the comment',
    minLength: 3,
    maxLength: 500,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  body: string;

  @ApiProperty({
    example: 1,
    description: 'The ID of the post this comment belongs to',
  })
  @IsNumber()
  @IsNotEmpty()
  postId: number;

  @ApiProperty({
    example: 1,
    description: 'The ID of the user who is creating the comment',
  })
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @ApiProperty({
    example: 'john@example.com',
    description: 'The email of the comment author',
    format: 'email',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'The name of the comment author',
    minLength: 2,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  name: string;
}
