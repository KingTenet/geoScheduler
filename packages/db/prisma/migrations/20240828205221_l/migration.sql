/*
  Warnings:

  - You are about to drop the column `actionType` on the `Actions` table. All the data in the column will be lost.
  - You are about to drop the column `appsToBlockId` on the `Actions` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `Actions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Actions" DROP COLUMN "actionType",
DROP COLUMN "appsToBlockId",
DROP COLUMN "password",
ALTER COLUMN "executionStatus" DROP NOT NULL;

-- DropEnum
DROP TYPE "ActionType";
