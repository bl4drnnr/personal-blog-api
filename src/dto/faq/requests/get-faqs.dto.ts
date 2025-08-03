import { IsOptional, IsString, IsIn } from 'class-validator';

export class GetFaqsDto {
  @IsOptional()
  @IsString()
  page?: string;

  @IsOptional()
  @IsString()
  pageSize?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  isActive?: string;

  @IsOptional()
  @IsString()
  featured?: string;

  @IsOptional()
  @IsIn(['createdAt', 'question', 'sortOrder', 'isActive', 'featured'])
  orderBy?: 'createdAt' | 'question' | 'sortOrder' | 'isActive' | 'featured';

  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  order?: 'ASC' | 'DESC';
}
