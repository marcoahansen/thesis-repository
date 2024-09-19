/*
  Warnings:

  - A unique constraint covering the columns `[registration]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[registration]` on the table `advisors` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[registration]` on the table `authors` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "User_registration_key" ON "User"("registration");

-- CreateIndex
CREATE UNIQUE INDEX "advisors_registration_key" ON "advisors"("registration");

-- CreateIndex
CREATE UNIQUE INDEX "authors_registration_key" ON "authors"("registration");
