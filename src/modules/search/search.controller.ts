import { Controller, Get, Query } from '@nestjs/common';
import { Type } from 'class-transformer';
import { IsInt, IsString, Max, MaxLength, Min } from 'class-validator';
import { SearchService } from './search.service';

class SearchQueryDto {
  @IsString()
  @MaxLength(100)
  q: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  per: number = 20;
}

@Controller('search')
export class SearchController {
  constructor(private readonly search: SearchService) {}

  @Get()
  run(@Query() query: SearchQueryDto) {
    return this.search.search(query.q, query.page, query.per);
  }
}
