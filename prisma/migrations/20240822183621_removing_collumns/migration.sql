/*
  Warnings:

  - You are about to drop the column `abstract` on the `theses` table. All the data in the column will be lost.
  - You are about to drop the column `advisor` on the `theses` table. All the data in the column will be lost.
  - You are about to drop the column `author` on the `theses` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "theses" DROP COLUMN "abstract",
DROP COLUMN "advisor",
DROP COLUMN "author";
