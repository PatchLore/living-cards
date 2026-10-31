-- Rate-limit rows for /api/enquiry (lib/enquiry.ts). Holds only a keyed IP hash,
-- a confirmation flag and a timestamp; the daily cleanup cron deletes rows after
-- 24 hours. Replaces the `prisma db push` step the enquiry branch's notes mention.

-- CreateTable
CREATE TABLE "EnquiryAttempt" (
    "id" TEXT NOT NULL,
    "ipHash" TEXT NOT NULL,
    "confirmationSent" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EnquiryAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "EnquiryAttempt_ipHash_createdAt_idx" ON "EnquiryAttempt"("ipHash", "createdAt");

-- CreateIndex
CREATE INDEX "EnquiryAttempt_createdAt_idx" ON "EnquiryAttempt"("createdAt");

-- Match the other tables: keep it out of Supabase's auto-generated API. The app
-- connects as the table owner, which bypasses RLS. Prisma does not track RLS.
ALTER TABLE "EnquiryAttempt" ENABLE ROW LEVEL SECURITY;
