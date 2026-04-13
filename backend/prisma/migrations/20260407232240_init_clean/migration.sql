/*
  Warnings:

  - You are about to drop the column `powerKw` on the `PowerUsageHistory` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[stationId,day]` on the table `PowerUsageHistory` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[stationId,day]` on the table `WaterUsageHistory` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `energyKwh` to the `PowerUsageHistory` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "PowerUsageHistory_measuredAt_powerKw_idx";

-- AlterTable
ALTER TABLE "PowerUsageHistory" DROP COLUMN "powerKw",
ADD COLUMN     "day" TIMESTAMP(3),
ADD COLUMN     "energyKwh" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "WaterUsageHistory" ADD COLUMN     "day" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "SensorReadings" (
    "id" SERIAL NOT NULL,
    "stationId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "measuredAt" TIMESTAMP(3) NOT NULL,
    "noOfCleaningCycles" INTEGER NOT NULL,
    "doneCleaning" BOOLEAN NOT NULL,
    "soapWeight" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "SensorReadings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PowerUsageHistory_measuredAt_energyKwh_idx" ON "PowerUsageHistory"("measuredAt", "energyKwh");

-- CreateIndex
CREATE UNIQUE INDEX "PowerUsageHistory_stationId_day_key" ON "PowerUsageHistory"("stationId", "day");

-- CreateIndex
CREATE UNIQUE INDEX "WaterUsageHistory_stationId_day_key" ON "WaterUsageHistory"("stationId", "day");

-- AddForeignKey
ALTER TABLE "SensorReadings" ADD CONSTRAINT "SensorReadings_stationId_fkey" FOREIGN KEY ("stationId") REFERENCES "HydrationStation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
