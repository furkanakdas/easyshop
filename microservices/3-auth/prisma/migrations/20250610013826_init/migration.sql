/*
  Warnings:

  - You are about to drop the column `payload` on the `outbox_event` table. All the data in the column will be lost.
  - Added the required column `value` to the `outbox_event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "outbox_event" DROP COLUMN "payload",
ADD COLUMN     "value" JSONB NOT NULL;
