/*
  Warnings:

  - You are about to drop the column `deletionStatus` on the `DaemonAction` table. All the data in the column will be lost.
  - You are about to drop the column `shouldBeExecuted` on the `DaemonAction` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "DaemonAction" DROP COLUMN "deletionStatus",
DROP COLUMN "shouldBeExecuted";

-- DropEnum
DROP TYPE "ActionDeletionStatus";
