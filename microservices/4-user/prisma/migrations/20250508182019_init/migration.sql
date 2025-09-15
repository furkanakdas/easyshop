/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `buyer_profile` table. All the data in the column will be lost.
  - You are about to drop the column `storeDescription` on the `seller_profile` table. All the data in the column will be lost.
  - You are about to drop the column `storeName` on the `seller_profile` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `seller_profile` table. All the data in the column will be lost.
  - Added the required column `businessName` to the `seller_profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `companyType` to the `seller_profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `seller_profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `iban` to the `seller_profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `identityNumber` to the `seller_profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `seller_profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `taxId` to the `seller_profile` table without a default value. This is not possible if the table is not empty.
  - Made the column `stripeAccountId` on table `seller_profile` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "CompanyType" AS ENUM ('SOLE_PROPRIETORSHIP');

-- DropIndex
DROP INDEX "seller_profile_storeName_idx";

-- AlterTable
ALTER TABLE "buyer_profile" DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "seller_profile" DROP COLUMN "storeDescription",
DROP COLUMN "storeName",
DROP COLUMN "updatedAt",
ADD COLUMN     "businessDescription" TEXT,
ADD COLUMN     "businessName" TEXT NOT NULL,
ADD COLUMN     "companyType" "CompanyType" NOT NULL,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "iban" TEXT NOT NULL,
ADD COLUMN     "identityNumber" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "taxId" TEXT NOT NULL,
ALTER COLUMN "stripeAccountId" SET NOT NULL;

-- CreateIndex
CREATE INDEX "seller_profile_businessName_idx" ON "seller_profile"("businessName");
