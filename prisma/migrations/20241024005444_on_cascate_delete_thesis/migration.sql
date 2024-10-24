-- DropForeignKey
ALTER TABLE "theses" DROP CONSTRAINT "theses_authorId_fkey";

-- AddForeignKey
ALTER TABLE "theses" ADD CONSTRAINT "theses_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "authors"("id") ON DELETE CASCADE ON UPDATE CASCADE;
