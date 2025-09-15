/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `seller_profile` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[stripeAccountId]` on the table `seller_profile` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "seller_profile_email_key" ON "seller_profile"("email");

-- CreateIndex
CREATE UNIQUE INDEX "seller_profile_stripeAccountId_key" ON "seller_profile"("stripeAccountId");
