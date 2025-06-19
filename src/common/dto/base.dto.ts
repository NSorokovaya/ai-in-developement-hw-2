import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNumber } from 'class-validator';

export class BaseDto {
  @ApiProperty({
    description: 'The unique identifier',
    example: 1,
  })
  @IsNumber()
  id: number;

  @ApiProperty({
    description: 'The creation timestamp',
    example: '2024-03-20T12:00:00Z',
  })
  @IsDate()
  createdAt: Date;

  @ApiProperty({
    description: 'The last update timestamp',
    example: '2024-03-20T12:00:00Z',
  })
  @IsDate()
  updatedAt: Date;
}
