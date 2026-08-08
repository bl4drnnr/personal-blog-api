import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SearchQueryDto } from './dto/search.dto';
import { SearchService } from './search.service';

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
