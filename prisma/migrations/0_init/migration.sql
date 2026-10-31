-- CreateTable
CREATE TABLE "CardOrder" (
    "id" TEXT NOT NULL,
    "stripeSessionId" TEXT NOT NULL,
    "paid" BOOLEAN NOT NULL DEFAULT false,
    "recipientName" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "cardType" TEXT NOT NULL,
    "shareId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CardOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Card" (
    "id" TEXT NOT NULL,
    "shareId" TEXT NOT NULL,
    "cardKey" TEXT NOT NULL,
    "recipientName" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "stripeSessionId" TEXT,
    "stripeCustomerEmail" TEXT,
    "treeCertificateUrl" TEXT,
    "treeId" TEXT,
    "treeSpecies" TEXT,
    "treeLocation" TEXT,
    "treeDatePlanted" TIMESTAMP(3),
    "emailSent" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Card_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PartyRsvp" (
    "id" TEXT NOT NULL,
    "cardId" TEXT NOT NULL,
    "guestName" TEXT NOT NULL,
    "attending" BOOLEAN NOT NULL,
    "ipHash" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PartyRsvp_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CardOrder_stripeSessionId_key" ON "CardOrder"("stripeSessionId");

-- CreateIndex
CREATE UNIQUE INDEX "CardOrder_shareId_key" ON "CardOrder"("shareId");

-- CreateIndex
CREATE UNIQUE INDEX "Card_shareId_key" ON "Card"("shareId");

-- CreateIndex
CREATE INDEX "Card_shareId_idx" ON "Card"("shareId");

-- CreateIndex
CREATE INDEX "Card_stripeSessionId_idx" ON "Card"("stripeSessionId");

-- CreateIndex
CREATE INDEX "PartyRsvp_cardId_createdAt_idx" ON "PartyRsvp"("cardId", "createdAt");

-- CreateIndex
CREATE INDEX "PartyRsvp_ipHash_createdAt_idx" ON "PartyRsvp"("ipHash", "createdAt");

-- CreateIndex
CREATE INDEX "PartyRsvp_createdAt_idx" ON "PartyRsvp"("createdAt");

-- AddForeignKey
ALTER TABLE "PartyRsvp" ADD CONSTRAINT "PartyRsvp_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card"("id") ON DELETE CASCADE ON UPDATE CASCADE;


-- Match production: keep tables out of Supabase's auto-generated API. The app
-- connects as the table owner, which bypasses RLS. Prisma does not track RLS, so
-- this is invisible to `migrate diff`.
ALTER TABLE "CardOrder" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Card" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "PartyRsvp" ENABLE ROW LEVEL SECURITY;
