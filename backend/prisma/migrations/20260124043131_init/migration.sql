-- CreateTable
CREATE TABLE "HydrationStation" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "bottlesWashed" INTEGER NOT NULL,
    "lastCleaningCycleAt" TIMESTAMP(3),

    CONSTRAINT "HydrationStation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PowerUsageHistory" (
    "id" SERIAL NOT NULL,
    "stationId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "measuredAt" TIMESTAMP(3) NOT NULL,
    "powerKw" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "PowerUsageHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WaterUsageHistory" (
    "id" SERIAL NOT NULL,
    "stationId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "measuredAt" TIMESTAMP(3) NOT NULL,
    "waterFlOz" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "WaterUsageHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PowerUsageHistory_measuredAt_powerKw_idx" ON "PowerUsageHistory"("measuredAt", "powerKw");

-- CreateIndex
CREATE INDEX "WaterUsageHistory_measuredAt_waterFlOz_idx" ON "WaterUsageHistory"("measuredAt", "waterFlOz");

-- AddForeignKey
ALTER TABLE "HydrationStation" ADD CONSTRAINT "HydrationStation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PowerUsageHistory" ADD CONSTRAINT "PowerUsageHistory_stationId_fkey" FOREIGN KEY ("stationId") REFERENCES "HydrationStation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WaterUsageHistory" ADD CONSTRAINT "WaterUsageHistory_stationId_fkey" FOREIGN KEY ("stationId") REFERENCES "HydrationStation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
