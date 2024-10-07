/*
  Warnings:

  - Added the required column `registration` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `registration` to the `advisors` table without a default value. This is not possible if the table is not empty.
  - Added the required column `registration` to the `authors` table without a default value. This is not possible if the table is not empty.
  - Added the required column `abstract` to the `theses` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "registration" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "advisors" ADD COLUMN     "registration" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "authors" ADD COLUMN     "registration" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "theses" ADD COLUMN     "abstract" TEXT NOT NULL;
