/*
  Warnings:

  - You are about to drop the column `address` on the `buyer_profile` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `buyer_profile` table. All the data in the column will be lost.
  - You are about to drop the column `fullName` on the `buyer_profile` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `buyer_profile` table. All the data in the column will be lost.
  - You are about to drop the column `address` on the `seller_profile` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `seller_profile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "buyer_profile" DROP COLUMN "address",
DROP COLUMN "createdAt",
DROP COLUMN "fullName",
DROP COLUMN "phone",
ADD COLUMN     "firstName" TEXT,
ADD COLUMN     "lastName" TEXT;

-- AlterTable
ALTER TABLE "seller_profile" DROP COLUMN "address",
DROP COLUMN "phone";

-- CreateTable
CREATE TABLE "Address" (
    "id" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "neighbourhood" TEXT NOT NULL,
    "detailedAddress" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "buyerProfileId" TEXT NOT NULL,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_buyerProfileId_fkey" FOREIGN KEY ("buyerProfileId") REFERENCES "buyer_profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
