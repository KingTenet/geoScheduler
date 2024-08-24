-- DropForeignKey
ALTER TABLE "DailyRecurrence" DROP CONSTRAINT "DailyRecurrence_geoScheduleConfigId_fkey";

-- DropForeignKey
ALTER TABLE "WeeklyRecurrence" DROP CONSTRAINT "WeeklyRecurrence_geoScheduleConfigId_fkey";

-- AddForeignKey
ALTER TABLE "WeeklyRecurrence" ADD CONSTRAINT "WeeklyRecurrence_geoScheduleConfigId_fkey" FOREIGN KEY ("geoScheduleConfigId") REFERENCES "GeoScheduleConfig"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyRecurrence" ADD CONSTRAINT "DailyRecurrence_geoScheduleConfigId_fkey" FOREIGN KEY ("geoScheduleConfigId") REFERENCES "GeoScheduleConfig"("id") ON DELETE CASCADE ON UPDATE CASCADE;
