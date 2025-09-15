-- AlterTable
ALTER TABLE "user" ADD COLUMN     "otp" TEXT,
ADD COLUMN     "otpExpiresAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "trusted_device" (
    "id" TEXT NOT NULL,
    "deviceId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trusted_device_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "trusted_device_deviceId_key" ON "trusted_device"("deviceId");

-- CreateIndex
CREATE UNIQUE INDEX "trusted_device_userId_deviceId_key" ON "trusted_device"("userId", "deviceId");

-- AddForeignKey
ALTER TABLE "trusted_device" ADD CONSTRAINT "trusted_device_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
