/*
  Warnings:

  - Made the column `fromDay` on table `WeeklyRecurrence` required. This step will fail if there are existing NULL values in that column.
  - Made the column `toDay` on table `WeeklyRecurrence` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "WeeklyRecurrence" ALTER COLUMN "fromDay" SET NOT NULL,
ALTER COLUMN "toDay" SET NOT NULL;
