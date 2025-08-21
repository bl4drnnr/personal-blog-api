import { IsArray, IsString, IsUUID, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateProjectDto {
  @IsString()
  @IsUUID()
  projectId: string;

  @IsString()
  projectTitle: string;

  @IsString()
  projectDescription: string;

  @IsString()
  projectContent: string;

  @IsString()
  @IsUUID()
  projectFeaturedImageId: string;

  @IsArray()
  projectTags: Array<string>;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  projectMetaKeywords: string;
}
