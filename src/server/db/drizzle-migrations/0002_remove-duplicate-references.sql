ALTER TABLE "account" DROP CONSTRAINT "account_userId_users_id_fk";
--> statement-breakpoint
ALTER TABLE "notes" DROP CONSTRAINT "notes_userId_users_id_fk";
--> statement-breakpoint
ALTER TABLE "users_preferences" DROP CONSTRAINT "users_preferences_userId_users_id_fk";
