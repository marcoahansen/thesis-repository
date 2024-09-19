/*
  Warnings:

  - You are about to drop the column `filePath` on the `theses` table. All the data in the column will be lost.
  - Added the required column `fileUrl` to the `theses` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "theses" DROP COLUMN "filePath",
ADD COLUMN     "fileUrl" VARCHAR(255) NOT NULL;
