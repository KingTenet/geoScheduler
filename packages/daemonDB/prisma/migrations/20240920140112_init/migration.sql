-- CreateEnum
CREATE TYPE "ActionDeletionStatus" AS ENUM ('DELETED', 'FAILED');

-- CreateEnum
CREATE TYPE "ActionExecutionStatus" AS ENUM ('WONT_START', 'STARTED', 'WONT_FINISH', 'FINISHED', 'FAILED');

-- CreateTable
CREATE TABLE "DaemonAction" (
    "id" TEXT NOT NULL,
    "appNames" TEXT[],
    "deletionStatus" "ActionDeletionStatus",
    "executionStatus" "ActionExecutionStatus",
    "shouldBeExecuted" BOOLEAN NOT NULL,
    "fromDate" TIMESTAMP(3) NOT NULL,
    "toDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DaemonAction_pkey" PRIMARY KEY ("id")
);
