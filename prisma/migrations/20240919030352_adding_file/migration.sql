/*
  Warnings:

  - You are about to drop the column `filePath` on the `theses` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[fileId]` on the table `theses` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `fileId` to the `theses` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "theses" DROP COLUMN "filePath",
ADD COLUMN     "fileId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "File" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "key" VARCHAR(255) NOT NULL,
    "contentType" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "thesisId" TEXT NOT NULL,

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "theses_fileId_key" ON "theses"("fileId");

-- AddForeignKey
ALTER TABLE "theses" ADD CONSTRAINT "theses_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
