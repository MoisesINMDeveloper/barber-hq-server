/*
  Warnings:

  - You are about to drop the `_BarbershopToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_BarbershopToUser" DROP CONSTRAINT "_BarbershopToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_BarbershopToUser" DROP CONSTRAINT "_BarbershopToUser_B_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "barberShopId" INTEGER;

-- DropTable
DROP TABLE "_BarbershopToUser";

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_barberShopId_fkey" FOREIGN KEY ("barberShopId") REFERENCES "Barbershop"("id") ON DELETE SET NULL ON UPDATE CASCADE;
