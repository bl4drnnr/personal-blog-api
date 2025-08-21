import { IsString, IsArray, IsBoolean, IsNotEmpty } from 'class-validator';

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

  @IsString()
  @IsNotEmpty()
  projectMetaKeywords: string;

  @IsBoolean()
  projectPublished: boolean;
}
