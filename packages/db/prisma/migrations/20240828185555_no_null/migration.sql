/*
  Warnings:

  - You are about to drop the column `date` on the `Actions` table. All the data in the column will be lost.
  - Added the required column `appsToBlockId` to the `Actions` table without a default value. This is not possible if the table is not empty.
  - Made the column `fromTime` on table `GeoScheduleConfig` required. This step will fail if there are existing NULL values in that column.
  - Made the column `toTime` on table `GeoScheduleConfig` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "AppsToBlock" DROP CONSTRAINT "AppsToBlock_actionsId_fkey";

-- AlterTable
ALTER TABLE "Actions" DROP COLUMN "date",
ADD COLUMN     "appsToBlockId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "GeoScheduleConfig" ALTER COLUMN "fromTime" SET NOT NULL,
ALTER COLUMN "toTime" SET NOT NULL;
