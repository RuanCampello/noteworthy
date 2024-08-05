ALTER TABLE "password_reset_tokens" DROP CONSTRAINT IF EXISTS "password_reset_tokens_id_unique";--> statement-breakpoint
ALTER TABLE "password_reset_tokens" DROP CONSTRAINT IF EXISTS "password_reset_tokens_token_unique";--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT IF EXISTS "users_email_unique";--> statement-breakpoint
ALTER TABLE "users_preferences" DROP CONSTRAINT IF EXISTS "users_preferences_id_unique";--> statement-breakpoint

-- ALTER TABLE "account" DROP CONSTRAINT "<constraint_name>";--> statement-breakpoint
ALTER TABLE "account" ALTER COLUMN "id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "account" ALTER COLUMN "userId" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "account" ALTER COLUMN "type" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "account" ALTER COLUMN "provider" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "account" ALTER COLUMN "providerAccountId" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "notes" ALTER COLUMN "created_at" SET DATA TYPE timestamp (3);--> statement-breakpoint
ALTER TABLE "notes" ALTER COLUMN "is_favourite" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "notes" ALTER COLUMN "is_archived" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "notes" ALTER COLUMN "userId" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "notes" ALTER COLUMN "last_update" SET DATA TYPE timestamp (3);--> statement-breakpoint
ALTER TABLE "password_reset_tokens" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "password_reset_tokens" ALTER COLUMN "email" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "password_reset_tokens" ALTER COLUMN "token" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "password_reset_tokens" ALTER COLUMN "expires" SET DATA TYPE timestamp (3);--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "emailVerified" SET DATA TYPE timestamp (3);--> statement-breakpoint
ALTER TABLE "users_preferences" ALTER COLUMN "userId" SET DATA TYPE text;--> statement-breakpoint

CREATE INDEX IF NOT EXISTS "notes_content_idx"
ON "notes" USING gin (to_tsvector('english', "content"));--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "notes_content_title_idx"
ON "notes" USING gin (to_tsvector('english', "title"));--> statement-breakpoint

CREATE UNIQUE INDEX IF NOT EXISTS "password_reset_tokens_token_email_key" ON "password_reset_tokens" USING btree ("token","email");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "password_reset_tokens_token_key" ON "password_reset_tokens" USING btree ("token");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "users_email_key" ON "users" USING btree ("email");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "users_preferences_userId_key" ON "users_preferences" USING btree ("userId");
