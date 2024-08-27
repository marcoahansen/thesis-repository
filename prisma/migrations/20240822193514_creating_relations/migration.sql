/*
  Warnings:

  - A unique constraint covering the columns `[authorId]` on the table `theses` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `authorId` to the `theses` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "theses" ADD COLUMN     "authorId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "authors" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "advisorId" TEXT NOT NULL,

    CONSTRAINT "authors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "advisors" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "advisors_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "theses_authorId_key" ON "theses"("authorId");

-- AddForeignKey
ALTER TABLE "theses" ADD CONSTRAINT "theses_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "authors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "authors" ADD CONSTRAINT "authors_advisorId_fkey" FOREIGN KEY ("advisorId") REFERENCES "advisors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
