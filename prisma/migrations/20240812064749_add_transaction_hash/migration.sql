/*
  Warnings:

  - You are about to drop the column `hash` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[transaction_hash]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `transaction_hash` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "User_hash_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "hash",
ADD COLUMN     "transaction_hash" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_transaction_hash_key" ON "User"("transaction_hash");
