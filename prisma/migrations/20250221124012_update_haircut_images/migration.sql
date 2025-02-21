/*
  Warnings:

  - The `imageUrl` column on the `Haircut` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Haircut" DROP COLUMN "imageUrl",
ADD COLUMN     "imageUrl" TEXT[];
