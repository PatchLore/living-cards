import { nanoid } from "nanoid";
import prisma from "../prisma";

/**
 * Card interface matching the database schema
 */
export interface Card {
  id: string;
  share_id: string;
  card_key: string;
  recipient_name: string;
  message: string;
  stripe_session_id: string;
  stripe_customer_email: string | null;
  email_sent: boolean;
  tree_certificate_url: string | null;
  tree_id: string | null;
  tree_species: string | null;
  tree_location: string | null;
  tree_date_planted: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Converts a Prisma Card model to the Card interface
 * Handles Date to string conversion
 */
function prismaCardToCard(card: {
  id: string;
  shareId: string;
  cardKey: string;
  recipientName: string;
  message: string;
  stripeSessionId: string;
  stripeCustomerEmail: string | null;
  emailSent: boolean;
  treeCertificateUrl: string | null;
  treeId: string | null;
  treeSpecies: string | null;
  treeLocation: string | null;
  treeDatePlanted: Date | null;
  createdAt: Date;
  updatedAt: Date;
}): Card {
  return {
    id: card.id,
    share_id: card.shareId,
    card_key: card.cardKey,
    recipient_name: card.recipientName,
    message: card.message,
    stripe_session_id: card.stripeSessionId,
    stripe_customer_email: card.stripeCustomerEmail,
    email_sent: card.emailSent,
    tree_certificate_url: card.treeCertificateUrl,
    tree_id: card.treeId,
    tree_species: card.treeSpecies,
    tree_location: card.treeLocation,
    tree_date_planted: card.treeDatePlanted?.toISOString() || null,
    created_at: card.createdAt.toISOString(),
    updated_at: card.updatedAt.toISOString(),
  };
}

/**
 * Generates a unique share ID
 * Retries on collision (rare but possible)
 */
async function generateShareId(
  db: Pick<typeof prisma, "card"> = prisma,
  maxRetries = 5,
): Promise<string> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const shareId = nanoid(10); // 10 characters for good uniqueness

    // Check if this share_id already exists
    const existing = await db.card.findUnique({
      where: { shareId },
    });

    if (!existing) {
      return shareId;
    }

    // If we're on the last attempt, throw an error
    if (attempt === maxRetries - 1) {
      throw new Error(
        `Failed to generate unique share_id after ${maxRetries} attempts`
      );
    }
  }

  // This should never be reached, but TypeScript needs it
  throw new Error("Failed to generate unique share_id");
}

/**
 * Creates the card for a Stripe checkout session, or returns the existing one.
 * The webhook and the success page can both call this at the same moment, so
 * creation runs under a per-session advisory lock to guarantee one card.
 */
export async function createCard({
  cardKey,
  recipientName,
  message,
  stripeSessionId,
  stripeCustomerEmail,
}: {
  cardKey: string;
  recipientName: string;
  message: string;
  stripeSessionId: string;
  stripeCustomerEmail?: string | null;
}): Promise<Card> {
  const card = await prisma.$transaction(async (tx) => {
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${stripeSessionId}))`;

    const existing = await tx.card.findFirst({ where: { stripeSessionId } });
    if (existing) {
      console.log(`[CARDS] Card already exists for session ${stripeSessionId}`);
      return existing;
    }

    const shareId = await generateShareId(tx);
    const created = await tx.card.create({
      data: {
        shareId,
        cardKey,
        recipientName,
        message,
        stripeSessionId,
        stripeCustomerEmail: stripeCustomerEmail ?? null,
      },
    });
    console.log(`[CARDS] Created card ${shareId} for session ${stripeSessionId}`);
    return created;
  });

  return prismaCardToCard(card);
}

export async function getCardBySessionId(stripeSessionId: string): Promise<Card | null> {
  const card = await prisma.card.findFirst({ where: { stripeSessionId } });
  return card ? prismaCardToCard(card) : null;
}

/**
 * Retrieves a card by its share_id
 * Returns null if not found (does not throw)
 */
export async function getCardByShareId(
  shareId: string
): Promise<Card | null> {
  try {
    const card = await prisma.card.findUnique({
      where: { shareId },
    });

    if (!card) {
      return null;
    }

    return prismaCardToCard(card);
  } catch (error) {
    console.error(`[CARDS] Error fetching card with share_id: ${shareId}`, error);
    // Return null instead of throwing for "not found" cases
    return null;
  }
}

