/*
  Warnings:

  - A unique constraint covering the columns `[geoScheduleConfigId,fromDate]` on the table `Actions` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `Place` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Place" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Actions_geoScheduleConfigId_fromDate_key" ON "Actions"("geoScheduleConfigId", "fromDate");
