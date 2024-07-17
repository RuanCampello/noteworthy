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
