-- DropForeignKey
ALTER TABLE "Actions" DROP CONSTRAINT "Actions_geoScheduleConfigId_fkey";

-- DropForeignKey
ALTER TABLE "GeometryCriterium" DROP CONSTRAINT "GeometryCriterium_placeId_fkey";

-- AddForeignKey
ALTER TABLE "Actions" ADD CONSTRAINT "Actions_geoScheduleConfigId_fkey" FOREIGN KEY ("geoScheduleConfigId") REFERENCES "GeoScheduleConfig"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GeometryCriterium" ADD CONSTRAINT "GeometryCriterium_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "Place"("id") ON DELETE CASCADE ON UPDATE CASCADE;
