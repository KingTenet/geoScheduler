/*
  Warnings:

  - A unique constraint covering the columns `[userId,name,longitude]` on the table `Place` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Place_userId_name_key";

-- CreateIndex
CREATE UNIQUE INDEX "Place_userId_name_longitude_key" ON "Place"("userId", "name", "longitude");
