/*
  Warnings:

  - You are about to drop the column `fromTime` on the `Actions` table. All the data in the column will be lost.
  - You are about to drop the column `toTime` on the `Actions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Actions" DROP COLUMN "fromTime",
DROP COLUMN "toTime";
