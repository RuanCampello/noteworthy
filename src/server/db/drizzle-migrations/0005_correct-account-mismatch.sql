ALTER TABLE "account" ALTER COLUMN "userId" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "account" ALTER COLUMN "type" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "account" ALTER COLUMN "provider" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "account" ALTER COLUMN "providerAccountId" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_provider_providerAccountId_pk" PRIMARY KEY("provider","providerAccountId");--> statement-breakpoint
ALTER TABLE "account" DROP COLUMN IF EXISTS "id";