/*
  Warnings:

  - You are about to drop the `BuyerProfile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SellerProfile` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "BuyerProfile" DROP CONSTRAINT "BuyerProfile_userId_fkey";

-- DropForeignKey
ALTER TABLE "SellerProfile" DROP CONSTRAINT "SellerProfile_userId_fkey";

-- DropTable
DROP TABLE "BuyerProfile";

-- DropTable
DROP TABLE "SellerProfile";

-- CreateTable
CREATE TABLE "buyer_profile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "buyer_profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seller_profile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "storeName" TEXT NOT NULL,
    "storeDescription" TEXT,
    "stripeAccountId" TEXT,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "seller_profile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "buyer_profile_userId_key" ON "buyer_profile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "seller_profile_userId_key" ON "seller_profile"("userId");

-- CreateIndex
CREATE INDEX "seller_profile_storeName_idx" ON "seller_profile"("storeName");

-- AddForeignKey
ALTER TABLE "buyer_profile" ADD CONSTRAINT "buyer_profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seller_profile" ADD CONSTRAINT "seller_profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
