/*
  Warnings:

  - Added the required column `paused` to the `BlockScheduleConfig` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BlockScheduleConfig" ADD COLUMN     "paused" BOOLEAN NOT NULL;
