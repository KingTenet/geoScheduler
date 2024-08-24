/*
  Warnings:

  - A unique constraint covering the columns `[appsToBlockId]` on the table `BlockScheduleConfig` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `appsToBlockId` to the `BlockScheduleConfig` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BlockScheduleConfig" ADD COLUMN     "appsToBlockId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "AppsToBlock" (
    "id" TEXT NOT NULL,

    CONSTRAINT "AppsToBlock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "App" (
    "id" TEXT NOT NULL,
    "appName" TEXT NOT NULL,
    "appsToBlockId" TEXT NOT NULL,

    CONSTRAINT "App_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BlockScheduleConfig_appsToBlockId_key" ON "BlockScheduleConfig"("appsToBlockId");

-- AddForeignKey
ALTER TABLE "App" ADD CONSTRAINT "App_appsToBlockId_fkey" FOREIGN KEY ("appsToBlockId") REFERENCES "AppsToBlock"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlockScheduleConfig" ADD CONSTRAINT "BlockScheduleConfig_appsToBlockId_fkey" FOREIGN KEY ("appsToBlockId") REFERENCES "AppsToBlock"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
