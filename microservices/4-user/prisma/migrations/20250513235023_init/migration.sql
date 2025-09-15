/*
  Warnings:

  - The primary key for the `seller_profile` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `seller_profile` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "seller_profile_userId_key";

-- AlterTable
ALTER TABLE "seller_profile" DROP CONSTRAINT "seller_profile_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "seller_profile_pkey" PRIMARY KEY ("userId");
