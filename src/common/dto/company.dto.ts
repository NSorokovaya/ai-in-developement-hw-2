import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CompanyDto {
  @ApiProperty({
    example: 'Romaguera-Crona',
    description: 'Company name',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'Multi-layered client-server neural-net',
    description: 'Company catch phrase',
  })
  @IsString()
  @IsNotEmpty()
  catchPhrase: string;

  @ApiProperty({
    example: 'harness real-time e-markets',
    description: 'Company business statement',
  })
  @IsString()
  @IsNotEmpty()
  bs: string;
}
