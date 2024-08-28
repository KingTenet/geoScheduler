/*
  Warnings:

  - Added the required column `radius` to the `Place` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Place" ADD COLUMN     "radius" DOUBLE PRECISION NOT NULL;
