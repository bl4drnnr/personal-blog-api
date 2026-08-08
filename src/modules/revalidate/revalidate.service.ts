import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * Notifies the Next.js frontend that cached content changed. Fire-and-forget:
 * content mutations must not fail because the frontend is unreachable — the
 * front's time-based revalidation fallback will catch up.
 */
@Injectable()
export class RevalidateService {
  private readonly logger = new Logger(RevalidateService.name);

  constructor(private readonly config: ConfigService) {}

  notify(tags: string[]): void {
    const frontUrl = this.config.getOrThrow<string>('FRONT_INTERNAL_URL');
    const secret = this.config.getOrThrow<string>('REVALIDATE_SECRET');

    fetch(`${frontUrl}/api/revalidate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret, tags }),
    })
      .then((res) => {
        if (!res.ok) {
          this.logger.warn(`Revalidation for [${tags.join(', ')}] returned ${res.status}`);
        }
      })
      .catch((err: Error) => {
        this.logger.warn(`Revalidation for [${tags.join(', ')}] failed: ${err.message}`);
      });
  }
}
