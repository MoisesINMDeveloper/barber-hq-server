/*
  Warnings:

  - You are about to drop the column `userId` on the `BankAccount` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "BankAccount_userId_key";

-- AlterTable
ALTER TABLE "BankAccount" DROP COLUMN "userId";
