-- CreateEnum
CREATE TYPE "ActionDeletionStatus" AS ENUM ('DELETED', 'FAILED');

-- CreateEnum
CREATE TYPE "ActionExecutionStatus" AS ENUM ('WONT_START', 'STARTED', 'WONT_FINISH', 'FINISHED', 'FAILED');

-- CreateEnum
CREATE TYPE "UpdateDelayType" AS ENUM ('SCHEDULED', 'TIMED_DELAY');

-- CreateEnum
CREATE TYPE "ScheduleDeletedStatus" AS ENUM ('WAITING_FOR_CLIENT', 'FAILED', 'DELETED');

-- CreateEnum
CREATE TYPE "DayOfWeek" AS ENUM ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday');

-- CreateEnum
CREATE TYPE "GeometryBlockType" AS ENUM ('WHEN_INSIDE', 'WHEN_OUTSIDE', 'UNTIL_ENTERING', 'UNTIL_LEAVING');

-- CreateTable
CREATE TABLE "Post" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Post2" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Post2_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AppsToBlock" (
    "id" TEXT NOT NULL,
    "actionsId" TEXT,
    "geoScheduleConfigId" TEXT NOT NULL,

    CONSTRAINT "AppsToBlock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "App" (
    "id" TEXT NOT NULL,
    "appName" TEXT NOT NULL,
    "appsToBlockId" TEXT NOT NULL,

    CONSTRAINT "App_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GeoScheduleConfig" (
    "id" TEXT NOT NULL,
    "fromTime" INTEGER NOT NULL,
    "toTime" INTEGER NOT NULL,
    "paused" BOOLEAN NOT NULL,
    "updateDelayType" "UpdateDelayType",
    "updateDelaySeconds" INTEGER,
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedDate" TIMESTAMP(3) NOT NULL,
    "deleteStartedDate" TIMESTAMP(3),
    "deletionStatus" "ScheduleDeletedStatus",
    "userId" TEXT NOT NULL,

    CONSTRAINT "GeoScheduleConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Actions" (
    "id" TEXT NOT NULL,
    "geoScheduleConfigId" TEXT NOT NULL,
    "deletionDateThreshold" TIMESTAMP(3) NOT NULL,
    "deletionStatus" "ActionDeletionStatus",
    "executionStatus" "ActionExecutionStatus",
    "fromDate" TIMESTAMP(3) NOT NULL,
    "toDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Actions_pkey" PRIMARY KEY ("id")
);

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

-- CreateTable
CREATE TABLE "WeeklyRecurrence" (
    "id" TEXT NOT NULL,
    "fromDay" "DayOfWeek" NOT NULL,
    "toDay" "DayOfWeek" NOT NULL,
    "geoScheduleConfigId" TEXT NOT NULL,

    CONSTRAINT "WeeklyRecurrence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyRecurrence" (
    "id" TEXT NOT NULL,
    "repeatDays" "DayOfWeek"[],
    "geoScheduleConfigId" TEXT NOT NULL,

    CONSTRAINT "DailyRecurrence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GeometryCriterium" (
    "id" TEXT NOT NULL,
    "geometryBlockType" "GeometryBlockType" NOT NULL,
    "placeId" TEXT NOT NULL,
    "geoScheduleConfigId" TEXT NOT NULL,

    CONSTRAINT "GeometryCriterium_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Place" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "radius" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Place_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Post_name_idx" ON "Post"("name");

-- CreateIndex
CREATE UNIQUE INDEX "AppsToBlock_geoScheduleConfigId_key" ON "AppsToBlock"("geoScheduleConfigId");

-- CreateIndex
CREATE UNIQUE INDEX "Actions_geoScheduleConfigId_fromDate_key" ON "Actions"("geoScheduleConfigId", "fromDate");

-- CreateIndex
CREATE UNIQUE INDEX "ActionTemplate_userId_name_key" ON "ActionTemplate"("userId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "WeeklyRecurrence_geoScheduleConfigId_key" ON "WeeklyRecurrence"("geoScheduleConfigId");

-- CreateIndex
CREATE UNIQUE INDEX "DailyRecurrence_geoScheduleConfigId_key" ON "DailyRecurrence"("geoScheduleConfigId");

-- CreateIndex
CREATE UNIQUE INDEX "Place_userId_name_key" ON "Place"("userId", "name");

-- AddForeignKey
ALTER TABLE "AppsToBlock" ADD CONSTRAINT "AppsToBlock_geoScheduleConfigId_fkey" FOREIGN KEY ("geoScheduleConfigId") REFERENCES "GeoScheduleConfig"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "App" ADD CONSTRAINT "App_appsToBlockId_fkey" FOREIGN KEY ("appsToBlockId") REFERENCES "AppsToBlock"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GeoScheduleConfig" ADD CONSTRAINT "GeoScheduleConfig_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Actions" ADD CONSTRAINT "Actions_geoScheduleConfigId_fkey" FOREIGN KEY ("geoScheduleConfigId") REFERENCES "GeoScheduleConfig"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConfigurationOptions" ADD CONSTRAINT "ConfigurationOptions_actionTemplateId_fkey" FOREIGN KEY ("actionTemplateId") REFERENCES "ActionTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActionTemplate" ADD CONSTRAINT "ActionTemplate_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeeklyRecurrence" ADD CONSTRAINT "WeeklyRecurrence_geoScheduleConfigId_fkey" FOREIGN KEY ("geoScheduleConfigId") REFERENCES "GeoScheduleConfig"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyRecurrence" ADD CONSTRAINT "DailyRecurrence_geoScheduleConfigId_fkey" FOREIGN KEY ("geoScheduleConfigId") REFERENCES "GeoScheduleConfig"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GeometryCriterium" ADD CONSTRAINT "GeometryCriterium_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "Place"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GeometryCriterium" ADD CONSTRAINT "GeometryCriterium_geoScheduleConfigId_fkey" FOREIGN KEY ("geoScheduleConfigId") REFERENCES "GeoScheduleConfig"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Place" ADD CONSTRAINT "Place_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
