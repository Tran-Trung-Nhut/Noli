/*
  Warnings:

  - You are about to drop the column `status` on the `Order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "status";

-- CreateTable
CREATE TABLE "OrderStatus" (
    "id" SERIAL NOT NULL,
    "orderId" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "previousStatusId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OrderStatus_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OrderStatus_previousStatusId_key" ON "OrderStatus"("previousStatusId");

-- AddForeignKey
ALTER TABLE "OrderStatus" ADD CONSTRAINT "OrderStatus_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderStatus" ADD CONSTRAINT "OrderStatus_previousStatusId_fkey" FOREIGN KEY ("previousStatusId") REFERENCES "OrderStatus"("id") ON DELETE SET NULL ON UPDATE CASCADE;
