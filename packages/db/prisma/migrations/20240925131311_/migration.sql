/*
  Warnings:

  - You are about to drop the column `deletionStatus` on the `Actions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Actions" DROP COLUMN "deletionStatus";

-- DropEnum
DROP TYPE "ActionDeletionStatus";
