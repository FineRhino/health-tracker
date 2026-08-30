-- DropIndex
DROP INDEX "BiometricEntry_userId_recordedAt_idx";

-- CreateIndex
CREATE UNIQUE INDEX "BiometricEntry_userId_recordedAt_key" ON "BiometricEntry"("userId", "recordedAt");
