import { IsString } from 'class-validator';

export class CreateNotFoundPageDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsString()
  heroImageMainId: string;

  @IsString()
  heroImageMainAlt: string;

  @IsString()
  heroTitle: string;
}
