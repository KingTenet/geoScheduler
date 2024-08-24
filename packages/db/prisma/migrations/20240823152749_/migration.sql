/*
  Warnings:

  - The values [MONDAY,TUESDAY,WEDNESDAY,THURSDAY,FRIDAY,SATURDAY,SUNDAY] on the enum `DayOfWeek` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "DayOfWeek_new" AS ENUM ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday');
ALTER TABLE "WeeklyRecurrence" ALTER COLUMN "fromDay" TYPE "DayOfWeek_new" USING ("fromDay"::text::"DayOfWeek_new");
ALTER TABLE "WeeklyRecurrence" ALTER COLUMN "toDay" TYPE "DayOfWeek_new" USING ("toDay"::text::"DayOfWeek_new");
ALTER TABLE "DailyRecurrence" ALTER COLUMN "repeatDays" TYPE "DayOfWeek_new"[] USING ("repeatDays"::text::"DayOfWeek_new"[]);
ALTER TYPE "DayOfWeek" RENAME TO "DayOfWeek_old";
ALTER TYPE "DayOfWeek_new" RENAME TO "DayOfWeek";
DROP TYPE "DayOfWeek_old";
COMMIT;
