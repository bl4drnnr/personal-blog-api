import { IsString, IsArray, IsBoolean } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  projectTitle: string;

  @IsString()
  projectDescription: string;

  @IsString()
  projectContent: string;

  @IsString()
  projectFeaturedImageId: string;

  @IsArray()
  projectTags: Array<string>;

  @IsBoolean()
  projectPublished: boolean;
}
