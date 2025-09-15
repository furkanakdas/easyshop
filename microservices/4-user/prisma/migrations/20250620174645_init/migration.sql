/*
  Warnings:

  - A unique constraint covering the columns `[businessName]` on the table `seller_profile` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "seller_profile_businessName_key" ON "seller_profile"("businessName");
