/*
  Warnings:

  - You are about to drop the column `blockScheduleConfigId` on the `Actions` table. All the data in the column will be lost.
  - You are about to drop the column `blockScheduleConfigId` on the `DailyRecurrence` table. All the data in the column will be lost.
  - You are about to drop the column `blockScheduleConfigId` on the `GeometryCriterium` table. All the data in the column will be lost.
  - You are about to drop the column `blockScheduleConfigId` on the `WeeklyRecurrence` table. All the data in the column will be lost.
  - You are about to drop the `Apps` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BlockScheduleConfig` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ExternalBlock` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[geoScheduleConfigId]` on the table `DailyRecurrence` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[geoScheduleConfigId]` on the table `WeeklyRecurrence` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `geoScheduleConfigId` to the `Actions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `App` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `AppsToBlock` table without a default value. This is not possible if the table is not empty.
  - Added the required column `geoScheduleConfigId` to the `DailyRecurrence` table without a default value. This is not possible if the table is not empty.
  - Added the required column `geoScheduleConfigId` to the `GeometryCriterium` table without a default value. This is not possible if the table is not empty.
  - Added the required column `geoScheduleConfigId` to the `WeeklyRecurrence` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Actions" DROP CONSTRAINT "Actions_blockScheduleConfigId_fkey";

-- DropForeignKey
ALTER TABLE "Apps" DROP CONSTRAINT "Apps_actionsId_fkey";

-- DropForeignKey
ALTER TABLE "BlockScheduleConfig" DROP CONSTRAINT "BlockScheduleConfig_appsToBlockId_fkey";

-- DropForeignKey
ALTER TABLE "BlockScheduleConfig" DROP CONSTRAINT "BlockScheduleConfig_userId_fkey";

-- DropForeignKey
ALTER TABLE "DailyRecurrence" DROP CONSTRAINT "DailyRecurrence_blockScheduleConfigId_fkey";

-- DropForeignKey
ALTER TABLE "ExternalBlock" DROP CONSTRAINT "ExternalBlock_blockScheduleConfigId_fkey";

-- DropForeignKey
ALTER TABLE "ExternalBlock" DROP CONSTRAINT "ExternalBlock_userId_fkey";

-- DropForeignKey
ALTER TABLE "GeometryCriterium" DROP CONSTRAINT "GeometryCriterium_blockScheduleConfigId_fkey";

-- DropForeignKey
ALTER TABLE "WeeklyRecurrence" DROP CONSTRAINT "WeeklyRecurrence_blockScheduleConfigId_fkey";

-- DropIndex
DROP INDEX "DailyRecurrence_blockScheduleConfigId_key";

-- DropIndex
DROP INDEX "WeeklyRecurrence_blockScheduleConfigId_key";

-- AlterTable
ALTER TABLE "Actions" DROP COLUMN "blockScheduleConfigId",
ADD COLUMN     "geoScheduleConfigId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "App" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "AppsToBlock" ADD COLUMN     "actionsId" TEXT,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "DailyRecurrence" DROP COLUMN "blockScheduleConfigId",
ADD COLUMN     "geoScheduleConfigId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "GeometryCriterium" DROP COLUMN "blockScheduleConfigId",
ADD COLUMN     "geoScheduleConfigId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "WeeklyRecurrence" DROP COLUMN "blockScheduleConfigId",
ADD COLUMN     "geoScheduleConfigId" TEXT NOT NULL;

-- DropTable
DROP TABLE "Apps";

-- DropTable
DROP TABLE "BlockScheduleConfig";

-- DropTable
DROP TABLE "ExternalBlock";

-- CreateTable
CREATE TABLE "GeoScheduleConfig" (
    "id" TEXT NOT NULL,
    "fromTime" TIMESTAMP(3),
    "toTime" TIMESTAMP(3),
    "paused" BOOLEAN NOT NULL,
    "updateDelayType" "UpdateDelayType",
    "updateDelaySeconds" INTEGER,
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedDate" TIMESTAMP(3) NOT NULL,
    "deleteStartedDate" TIMESTAMP(3),
    "deletionStatus" "ScheduleDeletedStatus",
    "userId" TEXT NOT NULL,
    "appsToBlockId" TEXT NOT NULL,

    CONSTRAINT "GeoScheduleConfig_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GeoScheduleConfig_appsToBlockId_key" ON "GeoScheduleConfig"("appsToBlockId");

-- CreateIndex
CREATE UNIQUE INDEX "DailyRecurrence_geoScheduleConfigId_key" ON "DailyRecurrence"("geoScheduleConfigId");

-- CreateIndex
CREATE UNIQUE INDEX "WeeklyRecurrence_geoScheduleConfigId_key" ON "WeeklyRecurrence"("geoScheduleConfigId");

-- AddForeignKey
ALTER TABLE "AppsToBlock" ADD CONSTRAINT "AppsToBlock_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppsToBlock" ADD CONSTRAINT "AppsToBlock_actionsId_fkey" FOREIGN KEY ("actionsId") REFERENCES "Actions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "App" ADD CONSTRAINT "App_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GeoScheduleConfig" ADD CONSTRAINT "GeoScheduleConfig_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GeoScheduleConfig" ADD CONSTRAINT "GeoScheduleConfig_appsToBlockId_fkey" FOREIGN KEY ("appsToBlockId") REFERENCES "AppsToBlock"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Actions" ADD CONSTRAINT "Actions_geoScheduleConfigId_fkey" FOREIGN KEY ("geoScheduleConfigId") REFERENCES "GeoScheduleConfig"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeeklyRecurrence" ADD CONSTRAINT "WeeklyRecurrence_geoScheduleConfigId_fkey" FOREIGN KEY ("geoScheduleConfigId") REFERENCES "GeoScheduleConfig"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyRecurrence" ADD CONSTRAINT "DailyRecurrence_geoScheduleConfigId_fkey" FOREIGN KEY ("geoScheduleConfigId") REFERENCES "GeoScheduleConfig"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GeometryCriterium" ADD CONSTRAINT "GeometryCriterium_geoScheduleConfigId_fkey" FOREIGN KEY ("geoScheduleConfigId") REFERENCES "GeoScheduleConfig"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
