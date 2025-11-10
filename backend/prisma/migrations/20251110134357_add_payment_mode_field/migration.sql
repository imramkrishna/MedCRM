/*
  Warnings:

  - A unique constraint covering the columns `[transactionId]` on the table `orders` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."orders" ADD COLUMN     "confirmationSlip" TEXT,
ADD COLUMN     "paymentMode" "public"."PaymentMode" DEFAULT 'CASH_ON_DELIVERY',
ADD COLUMN     "transactionId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "orders_transactionId_key" ON "public"."orders"("transactionId");
