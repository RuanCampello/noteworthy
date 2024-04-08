/*
  Warnings:

  - Made the column `lastUpdate` on table `notes` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "notes" ALTER COLUMN "lastUpdate" SET NOT NULL,
ALTER COLUMN "lastUpdate" SET DEFAULT CURRENT_TIMESTAMP;
