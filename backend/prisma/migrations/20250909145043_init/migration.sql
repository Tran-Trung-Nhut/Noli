-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "paymentMethod" DROP NOT NULL,
ALTER COLUMN "paymentMethod" DROP DEFAULT;
