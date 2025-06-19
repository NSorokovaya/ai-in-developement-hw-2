import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class GeoDto {
  @ApiProperty({
    example: '-37.3159',
    description: 'Latitude',
  })
  @IsString()
  @IsNotEmpty()
  lat: string;

  @ApiProperty({
    example: '81.1496',
    description: 'Longitude',
  })
  @IsString()
  @IsNotEmpty()
  lng: string;
}
