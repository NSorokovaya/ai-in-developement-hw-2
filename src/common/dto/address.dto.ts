import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { GeoDto } from './geo.dto';

export class AddressDto {
  @ApiProperty({
    example: 'Kulas Light',
    description: 'Street address',
  })
  @IsString()
  @IsNotEmpty()
  street: string;

  @ApiProperty({
    example: 'Apt. 556',
    description: 'Suite or apartment number',
  })
  @IsString()
  @IsNotEmpty()
  suite: string;

  @ApiProperty({
    example: 'Gwenborough',
    description: 'City name',
  })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({
    example: '92998-3874',
    description: 'Zip code',
  })
  @IsString()
  @IsNotEmpty()
  zipcode: string;

  @ApiProperty({
    type: GeoDto,
    description: 'Geographic coordinates',
  })
  @ValidateNested()
  @Type(() => GeoDto)
  geo: GeoDto;
}
