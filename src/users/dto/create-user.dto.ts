import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsOptional,
  MinLength,
  MaxLength,
  IsPhoneNumber,
  IsUrl,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { AddressDto } from '../../common/dto/address.dto';
import { CompanyDto } from '../../common/dto/company.dto';
import { VALIDATION } from '../../common/constants/validation.constants';
import { IsStrongPassword } from '../../common/decorators/password.decorator';
import { IsValidUsername } from '../../common/decorators/username.decorator';

export class CreateUserDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'The full name of the user',
    minLength: VALIDATION.NAME.MIN_LENGTH,
    maxLength: VALIDATION.NAME.MAX_LENGTH,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(VALIDATION.NAME.MIN_LENGTH)
  @MaxLength(VALIDATION.NAME.MAX_LENGTH)
  name: string;

  @ApiProperty({
    example: 'john@example.com',
    description: 'The email address of the user',
    format: 'email',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'Password123!',
    description: 'The password of the user',
    minLength: VALIDATION.PASSWORD.MIN_LENGTH,
  })
  @IsString()
  @IsNotEmpty()
  @IsStrongPassword()
  password: string;

  @ApiProperty({
    example: 'johndoe',
    description: 'The username of the user',
    minLength: VALIDATION.USERNAME.MIN_LENGTH,
    maxLength: VALIDATION.USERNAME.MAX_LENGTH,
  })
  @IsString()
  @IsNotEmpty()
  @IsValidUsername()
  username: string;

  @ApiProperty({
    type: AddressDto,
    description: 'The address of the user',
    required: false,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => AddressDto)
  address?: AddressDto;

  @ApiProperty({
    example: '+1-234-567-8900',
    description: 'The phone number of the user',
    required: false,
  })
  @IsOptional()
  @IsPhoneNumber()
  phone?: string;

  @ApiProperty({
    example: 'https://johndoe.com',
    description: 'The website of the user',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  website?: string;

  @ApiProperty({
    type: CompanyDto,
    description: 'The company information of the user',
    required: false,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => CompanyDto)
  company?: CompanyDto;
}
