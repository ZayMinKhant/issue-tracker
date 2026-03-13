-- CreateEnum
CREATE TYPE "IssueStatus" AS ENUM ('REPORTED', 'IN_PROGRESS', 'SOLVED');

-- CreateEnum
CREATE TYPE "IssueCategory" AS ENUM ('GENERAL', 'MAINTENANCE', 'SECURITY', 'CLEANING', 'NOISE', 'PARKING');

-- CreateTable
CREATE TABLE "Issue" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "submitterName" TEXT NOT NULL,
    "category" "IssueCategory" NOT NULL,
    "status" "IssueStatus" NOT NULL DEFAULT 'REPORTED',
    "attachmentName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Issue_pkey" PRIMARY KEY ("id")
);
