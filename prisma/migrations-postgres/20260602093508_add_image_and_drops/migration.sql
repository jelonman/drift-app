-- AlterTable
ALTER TABLE "MealPlan" ADD COLUMN "imageUrl" TEXT;

-- CreateTable
CREATE TABLE "Drop" (
    "id" TEXT NOT NULL,
    "familyId" TEXT NOT NULL,
    "rawText" TEXT NOT NULL,
    "imageUrl" TEXT,
    "taskIds" TEXT NOT NULL,
    "draftReply" TEXT,
    "needsClarification" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Drop_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Drop_familyId_createdAt_idx" ON "Drop"("familyId", "createdAt");

-- AddForeignKey
ALTER TABLE "Drop" ADD CONSTRAINT "Drop_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "Family"("id") ON DELETE CASCADE ON UPDATE CASCADE;
