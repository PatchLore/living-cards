-- CreateTable
CREATE TABLE "CardOrder" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "stripeSessionId" TEXT NOT NULL,
    "paid" BOOLEAN NOT NULL DEFAULT false,
    "recipientName" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "cardType" TEXT NOT NULL,
    "shareId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "CardOrder_stripeSessionId_key" ON "CardOrder"("stripeSessionId");

-- CreateIndex
CREATE UNIQUE INDEX "CardOrder_shareId_key" ON "CardOrder"("shareId");
