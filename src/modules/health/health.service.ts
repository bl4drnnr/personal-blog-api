import { Inject, Injectable } from '@nestjs/common';
import { sql } from 'drizzle-orm';
import { Database, DRIZZLE } from '@db/db.module';

@Injectable()
export class HealthService {
  constructor(@Inject(DRIZZLE) private readonly db: Database) {}

  async check(): Promise<{ status: 'ok' }> {
    await this.db.execute(sql`select 1`);
    return { status: 'ok' };
  }
}
