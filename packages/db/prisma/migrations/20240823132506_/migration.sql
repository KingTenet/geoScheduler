/*
  Warnings:

  - You are about to drop the column `userId` on the `App` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `AppsToBlock` table. All the data in the column will be lost.
  - You are about to drop the column `appsToBlockId` on the `GeoScheduleConfig` table. All the data in the column will be lost.
  - The `fromTime` column on the `GeoScheduleConfig` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `toTime` column on the `GeoScheduleConfig` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `userId` on the `GeometryCriterium` table. All the data in the column will be lost.
  - You are about to drop the column `idpId` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[geoScheduleConfigId]` on the table `AppsToBlock` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[placeId,geometryBlockType]` on the table `GeometryCriterium` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `geoScheduleConfigId` to the `AppsToBlock` table without a default value. This is not possible if the table is not empty.
  - Added the required column `latitude` to the `Place` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longitude` to the `Place` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "App" DROP CONSTRAINT "App_appsToBlockId_fkey";

-- DropForeignKey
ALTER TABLE "App" DROP CONSTRAINT "App_userId_fkey";

-- DropForeignKey
ALTER TABLE "AppsToBlock" DROP CONSTRAINT "AppsToBlock_userId_fkey";

-- DropForeignKey
ALTER TABLE "GeoScheduleConfig" DROP CONSTRAINT "GeoScheduleConfig_appsToBlockId_fkey";

-- DropForeignKey
ALTER TABLE "GeoScheduleConfig" DROP CONSTRAINT "GeoScheduleConfig_userId_fkey";

-- DropForeignKey
ALTER TABLE "GeometryCriterium" DROP CONSTRAINT "GeometryCriterium_geoScheduleConfigId_fkey";

-- DropForeignKey
ALTER TABLE "GeometryCriterium" DROP CONSTRAINT "GeometryCriterium_userId_fkey";

-- DropForeignKey
ALTER TABLE "Place" DROP CONSTRAINT "Place_userId_fkey";

-- DropIndex
DROP INDEX "GeoScheduleConfig_appsToBlockId_key";

-- DropIndex
DROP INDEX "GeometryCriterium_userId_placeId_geometryBlockType_key";

-- DropIndex
DROP INDEX "User_idpId_key";

-- AlterTable
ALTER TABLE "App" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "AppsToBlock" DROP COLUMN "userId",
ADD COLUMN     "geoScheduleConfigId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "GeoScheduleConfig" DROP COLUMN "appsToBlockId",
DROP COLUMN "fromTime",
ADD COLUMN     "fromTime" INTEGER,
DROP COLUMN "toTime",
ADD COLUMN     "toTime" INTEGER;

-- AlterTable
ALTER TABLE "GeometryCriterium" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "Place" ADD COLUMN     "latitude" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "longitude" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "idpId";

-- CreateTable
CREATE TABLE "ConfigurationOptions" (
    "id" TEXT NOT NULL,
    "option" TEXT NOT NULL,
    "actionTemplateId" TEXT,

    CONSTRAINT "ConfigurationOptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActionTemplate" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "ActionTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ActionTemplate_userId_name_key" ON "ActionTemplate"("userId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "AppsToBlock_geoScheduleConfigId_key" ON "AppsToBlock"("geoScheduleConfigId");

-- CreateIndex
CREATE UNIQUE INDEX "GeometryCriterium_placeId_geometryBlockType_key" ON "GeometryCriterium"("placeId", "geometryBlockType");

-- AddForeignKey
ALTER TABLE "AppsToBlock" ADD CONSTRAINT "AppsToBlock_geoScheduleConfigId_fkey" FOREIGN KEY ("geoScheduleConfigId") REFERENCES "GeoScheduleConfig"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "App" ADD CONSTRAINT "App_appsToBlockId_fkey" FOREIGN KEY ("appsToBlockId") REFERENCES "AppsToBlock"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GeoScheduleConfig" ADD CONSTRAINT "GeoScheduleConfig_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConfigurationOptions" ADD CONSTRAINT "ConfigurationOptions_actionTemplateId_fkey" FOREIGN KEY ("actionTemplateId") REFERENCES "ActionTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActionTemplate" ADD CONSTRAINT "ActionTemplate_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GeometryCriterium" ADD CONSTRAINT "GeometryCriterium_geoScheduleConfigId_fkey" FOREIGN KEY ("geoScheduleConfigId") REFERENCES "GeoScheduleConfig"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Place" ADD CONSTRAINT "Place_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
