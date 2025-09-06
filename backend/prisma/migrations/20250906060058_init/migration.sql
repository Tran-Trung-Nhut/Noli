-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "paymentMethod" TEXT NOT NULL DEFAULT 'COD',
ADD COLUMN     "transactionId" TEXT;
