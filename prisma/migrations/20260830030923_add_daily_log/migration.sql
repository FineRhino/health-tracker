-- CreateTable
CREATE TABLE "DailyLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "calories" DOUBLE PRECISION,
    "fatG" DOUBLE PRECISION,
    "saturatedFatG" DOUBLE PRECISION,
    "carbsG" DOUBLE PRECISION,
    "proteinG" DOUBLE PRECISION,
    "fiberG" DOUBLE PRECISION,
    "alcoholG" DOUBLE PRECISION,
    "fastingHours" DOUBLE PRECISION,
    "bloatRating" INTEGER,
    "energyRating" INTEGER,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DailyLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DailyLog_userId_date_key" ON "DailyLog"("userId", "date");

-- AddForeignKey
ALTER TABLE "DailyLog" ADD CONSTRAINT "DailyLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
