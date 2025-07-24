import { IsString } from 'class-validator';

export class UpdatePageContentDto {
  @IsString()
  content: string;
}
