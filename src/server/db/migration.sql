ALTER TABLE "notes"
    ADD COLUMN "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ADD COLUMN "is_archived" BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN "is_favourite" BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN "is_public" BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN "last_update" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

UPDATE "notes" SET
    "created_at" = "createdAt",
    "is_archived" = "isArchived",
    "is_favourite" = "isFavourite",
    "is_public" = "isPublic",
    "last_update" = "lastUpdate";

ALTER TABLE "notes"
    DROP COLUMN "createdAt",
    DROP COLUMN "isArchived",
    DROP COLUMN "isFavourite",
    DROP COLUMN "isPublic",
    DROP COLUMN "lastUpdate";

-------------------------- indexes for search --------------------------

CREATE INDEX notes_content_idx ON "notes" USING GIN (to_tsvector('english', "content"));
CREATE INDEX notes_content_title_idx ON "notes" USING GIN (
  to_tsvector('english', "title" || ' ' || "content")
);

-------------------------- correct note id type --------------------------

ALTER TABLE notes
ALTER COLUMN id TYPE UUID USING id::UUID,
ALTER COLUMN id SET DEFAULT gen_random_uuid();

-------------------------- remove prisma foreign keys --------------------------

ALTER TABLE "notes"
DROP CONSTRAINT "notes_userId_fkey";

ALTER TABLE "account"
DROP CONSTRAINT "accounts_userId_fkey";

ALTER TABLE "users_preferences"
DROP CONSTRAINT "users_preferences_userId_fkey";
