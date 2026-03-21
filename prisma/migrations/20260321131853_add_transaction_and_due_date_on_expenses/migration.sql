/*
  Warnings:

  - You are about to drop the column `date` on the `Expense` table. All the data in the column will be lost.
  - Added the required column `dueDate` to the `Expense` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transactionDate` to the `Expense` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Expense_date_groupId_idx";

-- AlterTable
ALTER TABLE "Expense" DROP COLUMN "date",
ADD COLUMN     "dueDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "transactionDate" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE INDEX "Expense_dueDate_groupId_idx" ON "Expense"("dueDate", "groupId");
