-- CreateTable
CREATE TABLE "outbox_event" (
    "id" TEXT NOT NULL,
    "aggregateId" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "outbox_event_pkey" PRIMARY KEY ("id")
);
