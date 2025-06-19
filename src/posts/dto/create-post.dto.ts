import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength, IsNumber } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({
    example: 'My First Post',
    description: 'The title of the post',
    minLength: 3,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  title: string;

  @ApiProperty({
    example: 'This is the content of my first post...',
    description: 'The content/body of the post',
    minLength: 10,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  body: string;

  @ApiProperty({
    example: 1,
    description: 'The ID of the user who created the post',
  })
  @IsNumber()
  @IsNotEmpty()
  userId: number;
}
