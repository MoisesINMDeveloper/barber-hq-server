/*
  Warnings:

  - The primary key for the `Appointment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Appointment` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `haircutId` column on the `Appointment` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `paymentId` column on the `Appointment` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Availability` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Availability` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `BankAccount` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `BankAccount` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Barbershop` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Barbershop` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Discount` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Discount` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Haircut` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Haircut` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Payment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Payment` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `verifiedBy` column on the `Payment` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Review` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Review` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `bankAccountId` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `WithdrawalRequest` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `WithdrawalRequest` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `processedBy` column on the `WithdrawalRequest` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `_BarbershopToUser` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Changed the type of `barberId` on the `Appointment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `barberId` on the `Availability` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `userId` on the `BankAccount` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `barberId` on the `Haircut` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `appointmentId` on the `Payment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `appointmentId` on the `Review` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `barberId` on the `Review` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `barberId` on the `WithdrawalRequest` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `A` on the `_BarbershopToUser` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `B` on the `_BarbershopToUser` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_barberId_fkey";

-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_haircutId_fkey";

-- DropForeignKey
ALTER TABLE "Availability" DROP CONSTRAINT "Availability_barberId_fkey";

-- DropForeignKey
ALTER TABLE "Haircut" DROP CONSTRAINT "Haircut_barberId_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_appointmentId_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_verifiedBy_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_appointmentId_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_barberId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_bankAccountId_fkey";

-- DropForeignKey
ALTER TABLE "WithdrawalRequest" DROP CONSTRAINT "WithdrawalRequest_barberId_fkey";

-- DropForeignKey
ALTER TABLE "WithdrawalRequest" DROP CONSTRAINT "WithdrawalRequest_processedBy_fkey";

-- DropForeignKey
ALTER TABLE "_BarbershopToUser" DROP CONSTRAINT "_BarbershopToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_BarbershopToUser" DROP CONSTRAINT "_BarbershopToUser_B_fkey";

-- AlterTable
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "barberId",
ADD COLUMN     "barberId" INTEGER NOT NULL,
DROP COLUMN "haircutId",
ADD COLUMN     "haircutId" INTEGER,
DROP COLUMN "paymentId",
ADD COLUMN     "paymentId" INTEGER,
ADD CONSTRAINT "Appointment_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Availability" DROP CONSTRAINT "Availability_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "barberId",
ADD COLUMN     "barberId" INTEGER NOT NULL,
ADD CONSTRAINT "Availability_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "BankAccount" DROP CONSTRAINT "BankAccount_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "userId",
ADD COLUMN     "userId" INTEGER NOT NULL,
ADD CONSTRAINT "BankAccount_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Barbershop" DROP CONSTRAINT "Barbershop_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Barbershop_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Discount" DROP CONSTRAINT "Discount_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Discount_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Haircut" DROP CONSTRAINT "Haircut_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "barberId",
ADD COLUMN     "barberId" INTEGER NOT NULL,
ADD CONSTRAINT "Haircut_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "appointmentId",
ADD COLUMN     "appointmentId" INTEGER NOT NULL,
DROP COLUMN "verifiedBy",
ADD COLUMN     "verifiedBy" INTEGER,
ADD CONSTRAINT "Payment_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Review" DROP CONSTRAINT "Review_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "appointmentId",
ADD COLUMN     "appointmentId" INTEGER NOT NULL,
DROP COLUMN "barberId",
ADD COLUMN     "barberId" INTEGER NOT NULL,
ADD CONSTRAINT "Review_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "bankAccountId",
ADD COLUMN     "bankAccountId" INTEGER,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "WithdrawalRequest" DROP CONSTRAINT "WithdrawalRequest_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "barberId",
ADD COLUMN     "barberId" INTEGER NOT NULL,
DROP COLUMN "processedBy",
ADD COLUMN     "processedBy" INTEGER,
ADD CONSTRAINT "WithdrawalRequest_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "_BarbershopToUser" DROP CONSTRAINT "_BarbershopToUser_AB_pkey",
DROP COLUMN "A",
ADD COLUMN     "A" INTEGER NOT NULL,
DROP COLUMN "B",
ADD COLUMN     "B" INTEGER NOT NULL,
ADD CONSTRAINT "_BarbershopToUser_AB_pkey" PRIMARY KEY ("A", "B");

-- CreateIndex
CREATE UNIQUE INDEX "BankAccount_userId_key" ON "BankAccount"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_appointmentId_key" ON "Payment"("appointmentId");

-- CreateIndex
CREATE UNIQUE INDEX "Review_appointmentId_key" ON "Review"("appointmentId");

-- CreateIndex
CREATE UNIQUE INDEX "User_bankAccountId_key" ON "User"("bankAccountId");

-- CreateIndex
CREATE INDEX "_BarbershopToUser_B_index" ON "_BarbershopToUser"("B");

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_barberId_fkey" FOREIGN KEY ("barberId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_haircutId_fkey" FOREIGN KEY ("haircutId") REFERENCES "Haircut"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_bankAccountId_fkey" FOREIGN KEY ("bankAccountId") REFERENCES "BankAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Haircut" ADD CONSTRAINT "Haircut_barberId_fkey" FOREIGN KEY ("barberId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WithdrawalRequest" ADD CONSTRAINT "WithdrawalRequest_barberId_fkey" FOREIGN KEY ("barberId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WithdrawalRequest" ADD CONSTRAINT "WithdrawalRequest_processedBy_fkey" FOREIGN KEY ("processedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_barberId_fkey" FOREIGN KEY ("barberId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Availability" ADD CONSTRAINT "Availability_barberId_fkey" FOREIGN KEY ("barberId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_verifiedBy_fkey" FOREIGN KEY ("verifiedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BarbershopToUser" ADD CONSTRAINT "_BarbershopToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Barbershop"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BarbershopToUser" ADD CONSTRAINT "_BarbershopToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
