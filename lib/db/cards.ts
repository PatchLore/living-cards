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
async function generateShareId(maxRetries = 5): Promise<string> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const shareId = nanoid(10); // 10 characters for good uniqueness

    // Check if this share_id already exists
    const existing = await prisma.card.findUnique({
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
 * Creates a new card in the database
 * Enforces idempotency based on stripe_session_id
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
  try {
    // Idempotency check: if a card with this stripe_session_id exists, return it
    const existing = await prisma.card.findFirst({
      where: { stripeSessionId },
    });

    if (existing) {
      console.log(
        `[CARDS] Card already exists for session ${stripeSessionId}, returning existing card`
      );
      return prismaCardToCard(existing);
    }

    // Generate a unique share_id
    const shareId = await generateShareId();

    // Insert the new card
    const newCard = await prisma.card.create({
      data: {
        shareId,
        cardKey,
        recipientName,
        message,
        stripeSessionId,
        stripeCustomerEmail: stripeCustomerEmail ?? null,
      },
    });

    console.log(
      `[CARDS] Created new card with share_id: ${shareId} for session: ${stripeSessionId}`
    );

    return prismaCardToCard(newCard);
  } catch (error: unknown) {
    // Handle unique constraint violations (e.g., share_id collision despite check)
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "P2002"
    ) {
      // Prisma unique constraint error
      const meta = error && typeof error === "object" && "meta" in error ? error.meta : undefined;
      const target = meta && typeof meta === "object" && "target" in meta && Array.isArray(meta.target) ? meta.target : undefined;
      const field = target?.[0];
      if (field === "shareId") {
        console.warn(
          `[CARDS] Share ID collision detected, retrying with new ID...`
        );
        // Retry once with a new share_id
        const shareId = await generateShareId();
        try {
          const retryCard = await prisma.card.create({
            data: {
              shareId,
              cardKey,
              recipientName,
              message,
              stripeSessionId,
              stripeCustomerEmail: stripeCustomerEmail ?? null,
            },
          });
          return prismaCardToCard(retryCard);
        } catch (retryError: unknown) {
          console.error("[CARDS] Retry failed:", retryError);
          throw new Error("Failed to create card after retry");
        }
      } else if (field === "stripeSessionId") {
        // This shouldn't happen due to our idempotency check, but handle it
        console.log(
          `[CARDS] Card with stripe_session_id already exists (race condition), fetching existing`
        );
        const existing = await prisma.card.findFirst({
          where: { stripeSessionId },
        });
        if (existing) {
          return prismaCardToCard(existing);
        }
        throw new Error("Card exists but could not be retrieved");
      }
    }

    // Log unexpected errors
    console.error("[CARDS] Unexpected error creating card:", error);
    throw error;
  }
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

