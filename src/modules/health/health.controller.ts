import { Controller, Get, Inject } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { sql } from 'drizzle-orm';
import { Database, DRIZZLE } from '@db/db.module';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(@Inject(DRIZZLE) private readonly db: Database) {}

  @Get()
  @ApiOperation({ summary: 'Liveness probe (also pings the database)' })
  @ApiOkResponse({ schema: { example: { status: 'ok' } } })
  async check() {
    await this.db.execute(sql`select 1`);
    return { status: 'ok' };
  }
}
