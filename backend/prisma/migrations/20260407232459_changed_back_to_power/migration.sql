/*
  Warnings:

  - You are about to drop the column `energyKwh` on the `PowerUsageHistory` table. All the data in the column will be lost.
  - Added the required column `powerKw` to the `PowerUsageHistory` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "PowerUsageHistory_measuredAt_energyKwh_idx";

-- AlterTable
ALTER TABLE "PowerUsageHistory" DROP COLUMN "energyKwh",
ADD COLUMN     "powerKw" DOUBLE PRECISION NOT NULL;

-- CreateIndex
CREATE INDEX "PowerUsageHistory_measuredAt_powerKw_idx" ON "PowerUsageHistory"("measuredAt", "powerKw");
