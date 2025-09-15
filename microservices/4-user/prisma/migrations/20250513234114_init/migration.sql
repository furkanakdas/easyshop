/*
  Warnings:

  - The primary key for the `buyer_profile` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `buyer_profile` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Address" DROP CONSTRAINT "Address_buyerProfileId_fkey";

-- DropIndex
DROP INDEX "buyer_profile_userId_key";

-- AlterTable
ALTER TABLE "buyer_profile" DROP CONSTRAINT "buyer_profile_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "buyer_profile_pkey" PRIMARY KEY ("userId");

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_buyerProfileId_fkey" FOREIGN KEY ("buyerProfileId") REFERENCES "buyer_profile"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
