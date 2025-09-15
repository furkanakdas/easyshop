/*
  Warnings:

  - The `status` column on the `seller_profile` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "SellerProfileStatus" AS ENUM ('PENDING', 'APPROVED');

-- AlterTable
ALTER TABLE "seller_profile" DROP COLUMN "status",
ADD COLUMN     "status" "SellerProfileStatus" NOT NULL DEFAULT 'PENDING';
