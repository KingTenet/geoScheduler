-- CreateEnum
CREATE TYPE "ActionDeletionStatus" AS ENUM ('DELETED', 'FAILED');

-- CreateEnum
CREATE TYPE "ActionExecutionStatus" AS ENUM ('WONT_START', 'STARTED', 'WONT_FINISH', 'FINISHED', 'FAILED');

-- CreateEnum
CREATE TYPE "ActionType" AS ENUM ('START_BLOCK', 'STOP_BLOCK');

-- CreateEnum
CREATE TYPE "UpdateDelayType" AS ENUM ('SCHEDULED', 'TIMED_DELAY');

-- CreateEnum
CREATE TYPE "ScheduleDeletedStatus" AS ENUM ('WAITING_FOR_CLIENT', 'FAILED', 'DELETED');

-- CreateEnum
CREATE TYPE "DayOfWeek" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY');

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
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "idpId" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExternalBlock" (
    "id" TEXT NOT NULL,
    "blockScheduleConfigId" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "ExternalBlock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlockScheduleConfig" (
    "id" TEXT NOT NULL,
    "fromTime" TIMESTAMP(3),
    "toTime" TIMESTAMP(3),
    "updateDelayType" "UpdateDelayType",
    "updateDelaySeconds" INTEGER,
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedDate" TIMESTAMP(3) NOT NULL,
    "deleteStartedDate" TIMESTAMP(3),
    "deletionStatus" "ScheduleDeletedStatus",
    "userId" TEXT NOT NULL,

    CONSTRAINT "BlockScheduleConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Apps" (
    "id" TEXT NOT NULL,
    "actionsId" TEXT,

    CONSTRAINT "Apps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Actions" (
    "id" TEXT NOT NULL,
    "blockScheduleConfigId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "actionType" "ActionType" NOT NULL,
    "deletionDateThreshold" TIMESTAMP(3) NOT NULL,
    "deletionStatus" "ActionDeletionStatus",
    "executionStatus" "ActionExecutionStatus" NOT NULL,
    "password" TEXT,
    "fromDate" TIMESTAMP(3) NOT NULL,
    "toDate" TIMESTAMP(3) NOT NULL,
    "fromTime" TIMESTAMP(3) NOT NULL,
    "toTime" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Actions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeeklyRecurrence" (
    "id" TEXT NOT NULL,
    "fromDay" "DayOfWeek",
    "toDay" "DayOfWeek",
    "blockScheduleConfigId" TEXT NOT NULL,

    CONSTRAINT "WeeklyRecurrence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyRecurrence" (
    "id" TEXT NOT NULL,
    "repeatDays" "DayOfWeek"[],
    "blockScheduleConfigId" TEXT NOT NULL,

    CONSTRAINT "DailyRecurrence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GeometryCriterium" (
    "id" TEXT NOT NULL,
    "geometryBlockType" "GeometryBlockType" NOT NULL,
    "placeId" TEXT NOT NULL,
    "blockScheduleConfigId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "GeometryCriterium_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Place" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Place_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Post_name_idx" ON "Post"("name");

-- CreateIndex
CREATE UNIQUE INDEX "User_idpId_key" ON "User"("idpId");

-- CreateIndex
CREATE UNIQUE INDEX "WeeklyRecurrence_blockScheduleConfigId_key" ON "WeeklyRecurrence"("blockScheduleConfigId");

-- CreateIndex
CREATE UNIQUE INDEX "DailyRecurrence_blockScheduleConfigId_key" ON "DailyRecurrence"("blockScheduleConfigId");

-- CreateIndex
CREATE UNIQUE INDEX "GeometryCriterium_userId_placeId_geometryBlockType_key" ON "GeometryCriterium"("userId", "placeId", "geometryBlockType");

-- CreateIndex
CREATE UNIQUE INDEX "Place_userId_name_key" ON "Place"("userId", "name");

-- AddForeignKey
ALTER TABLE "ExternalBlock" ADD CONSTRAINT "ExternalBlock_blockScheduleConfigId_fkey" FOREIGN KEY ("blockScheduleConfigId") REFERENCES "BlockScheduleConfig"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExternalBlock" ADD CONSTRAINT "ExternalBlock_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlockScheduleConfig" ADD CONSTRAINT "BlockScheduleConfig_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Apps" ADD CONSTRAINT "Apps_actionsId_fkey" FOREIGN KEY ("actionsId") REFERENCES "Actions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Actions" ADD CONSTRAINT "Actions_blockScheduleConfigId_fkey" FOREIGN KEY ("blockScheduleConfigId") REFERENCES "BlockScheduleConfig"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeeklyRecurrence" ADD CONSTRAINT "WeeklyRecurrence_blockScheduleConfigId_fkey" FOREIGN KEY ("blockScheduleConfigId") REFERENCES "BlockScheduleConfig"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyRecurrence" ADD CONSTRAINT "DailyRecurrence_blockScheduleConfigId_fkey" FOREIGN KEY ("blockScheduleConfigId") REFERENCES "BlockScheduleConfig"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GeometryCriterium" ADD CONSTRAINT "GeometryCriterium_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "Place"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GeometryCriterium" ADD CONSTRAINT "GeometryCriterium_blockScheduleConfigId_fkey" FOREIGN KEY ("blockScheduleConfigId") REFERENCES "BlockScheduleConfig"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GeometryCriterium" ADD CONSTRAINT "GeometryCriterium_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Place" ADD CONSTRAINT "Place_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
