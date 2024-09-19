/*
  Warnings:

  - You are about to drop the column `contentType` on the `File` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `File` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `File` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "theses" DROP CONSTRAINT "theses_authorId_fkey";

-- DropForeignKey
ALTER TABLE "theses" DROP CONSTRAINT "theses_fileId_fkey";

-- AlterTable
ALTER TABLE "File" DROP COLUMN "contentType",
DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- AddForeignKey
ALTER TABLE "theses" ADD CONSTRAINT "theses_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "authors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "theses" ADD CONSTRAINT "theses_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File"("id") ON DELETE CASCADE ON UPDATE CASCADE;
