import { Controller, Get, Query } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiProperty,
  ApiPropertyOptional,
  ApiTags,
} from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsString, Max, MaxLength, Min } from 'class-validator';
import { SearchService } from './search.service';

class SearchQueryDto {
  @ApiProperty({ description: 'Search query (min 2 chars to match)', example: 'oidc detection' })
  @IsString()
  @MaxLength(100)
  q: string;

  @ApiPropertyOptional({ default: 1, minimum: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiPropertyOptional({ default: 20, minimum: 1, maximum: 50 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  per: number = 20;
}

@ApiTags('Search')
@Controller('search')
export class SearchController {
  constructor(private readonly search: SearchService) {}

  @Get()
  @ApiOperation({ summary: 'Full-text search over published posts' })
  @ApiOkResponse({
    description: 'Ranked results; titleHtml/snippetHtml contain <mark> around matches.',
  })
  run(@Query() query: SearchQueryDto) {
    return this.search.search(query.q, query.page, query.per);
  }
}
