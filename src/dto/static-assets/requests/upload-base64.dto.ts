import { IsString, IsOptional } from 'class-validator';

export class UploadBase64Dto {
  @IsString()
  name: string;

  @IsString()
  base64Image: string;

  @IsOptional()
  @IsString()
  description?: string;
}
