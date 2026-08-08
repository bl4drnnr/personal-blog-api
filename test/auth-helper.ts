import { JwtService } from '@nestjs/jwt';
import { hashSync } from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { users } from '@db/schema';
import { TestApp } from './app.harness';

/** Creates (or resets) a dedicated test user and mints a real access token for it. */
export async function createAuthedUser(ctx: TestApp, email: string): Promise<string> {
  await ctx.db.delete(users).where(eq(users.email, email));
  const [user] = await ctx.db
    .insert(users)
    .values({ email, passwordHash: hashSync('irrelevant-for-these-tests', 10), mfaEnabled: true })
    .returning();

  const jwt = ctx.app.get(JwtService);
  return jwt.signAsync({ sub: user.id, type: 'access' }, { expiresIn: 600 });
}

export async function deleteUser(ctx: TestApp, email: string): Promise<void> {
  await ctx.db.delete(users).where(eq(users.email, email));
}
