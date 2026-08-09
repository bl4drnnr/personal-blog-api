ALTER TABLE "sessions" ADD COLUMN "previous_jti_hash" text;--> statement-breakpoint
ALTER TABLE "sessions" ADD COLUMN "previous_expires_at" timestamp with time zone;