import { IsString, IsInt, IsOptional } from 'class-validator';

export class CreateMenuTileDto {
  @IsString()
  title: string;

  @IsString()
  link: string;

  @IsString()
  iconId: string;

  @IsString()
  iconAlt: string;

  @IsString()
  imageId: string;

  @IsString()
  imageAlt: string;

  @IsOptional()
  @IsInt()
  sortOrder?: number;
}
