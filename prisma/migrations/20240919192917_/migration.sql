/*
  Warnings:

  - You are about to drop the column `fileId` on the `theses` table. All the data in the column will be lost.
  - You are about to drop the `File` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `filePath` to the `theses` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "theses" DROP CONSTRAINT "theses_authorId_fkey";

-- DropForeignKey
ALTER TABLE "theses" DROP CONSTRAINT "theses_fileId_fkey";

-- DropIndex
DROP INDEX "theses_fileId_key";

-- AlterTable
ALTER TABLE "theses" DROP COLUMN "fileId",
ADD COLUMN     "filePath" VARCHAR(255) NOT NULL;

-- DropTable
DROP TABLE "File";

-- AddForeignKey
ALTER TABLE "theses" ADD CONSTRAINT "theses_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "authors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
