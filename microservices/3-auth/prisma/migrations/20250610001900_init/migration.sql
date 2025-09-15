/*
  Warnings:

  - You are about to drop the column `eventType` on the `outbox_event` table. All the data in the column will be lost.
  - Added the required column `topic` to the `outbox_event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "outbox_event" DROP COLUMN "eventType",
ADD COLUMN     "topic" TEXT NOT NULL;
