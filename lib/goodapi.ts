// GoodAPI tree planting (https://www.thegoodapi.com/docs/api/planting-trees).
// Each paid card plants one mangrove in the Kilifi, Kenya project (veritree-kenya,
// $0.43 per tree at time of writing). Planting only happens when GOODAPI_LIVE=1,
// so the flow can be tested without spending money.

const BASE = "https://app.thegoodapi.com";
export const TREE_PROJECT_ID = "veritree-kenya";
export const TREE_LOCATION = "Kilifi, Kenya";
export const TREE_SPECIES = "Mangrove (Rhizophora and Ceriops species)";

export function plantingEnabled() {
  return process.env.GOODAPI_LIVE === "1" && !!process.env.GOODAPI_API_KEY;
}

/**
 * Plants one tree for a paid card. The card's share ID is used as the
 * idempotency key, so a retried webhook can never plant a second tree.
 */
export async function plantTreeForCard({ shareId, cardKey }: { shareId: string; cardKey: string }) {
  if (!plantingEnabled()) return { treeId: null, skipped: true as const };

  const res = await fetch(`${BASE}/plant/trees`, {
    method: "POST",
    headers: { Authorization: process.env.GOODAPI_API_KEY!, "Content-Type": "application/json" },
    body: JSON.stringify({
      count: 1,
      project_id: TREE_PROJECT_ID,
      idempotency_key: `cardroots-${shareId}`,
      attribution: shareId,
      metadata: { cardKey, source: "cardroots" },
    }),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`GoodAPI planting failed (${res.status}): ${json.message || json.error || "unknown error"}`);

  const treeId: string | undefined = json.tree_details?.[0]?.id;
  if (!treeId) throw new Error("GoodAPI planting returned no tree ID");
  return { treeId, skipped: false as const };
}

export type TreeEvidence = {
  status: string;
  registeredAt: string | null;
  verifiedAt: string | null;
  species: string[];
  site: string | null;
  subsite: string | null;
  latitude: number | null;
  longitude: number | null;
  photo: string | null;
  photos: string[];
  organisation: string | null;
};

/** Verification status and ground evidence for one tree. Null if unavailable. */
export async function getTreeEvidence(treeId: string): Promise<TreeEvidence | null> {
  if (!process.env.GOODAPI_API_KEY) return null;
  try {
    const res = await fetch(`${BASE}/evidence/tree/${encodeURIComponent(treeId)}`, {
      headers: { Authorization: process.env.GOODAPI_API_KEY },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const j = await res.json();
    const steps: any[] = j.timeline ?? [];
    const step = (event: string) => steps.find((s) => s.event === event);
    const verified = step("planted_and_verified");
    const ev = verified?.evidence ?? {};
    return {
      status: j.status ?? "registered",
      registeredAt: step("registered")?.date ?? null,
      verifiedAt: verified?.date ?? null,
      species: Array.isArray(ev.species) ? ev.species : [],
      site: ev.planting_site_name ?? null,
      subsite: ev.subsite_name ?? null,
      latitude: ev.latitude ? Number(ev.latitude) : null,
      longitude: ev.longitude ? Number(ev.longitude) : null,
      photo: ev.image_url ?? null,
      photos: Array.isArray(ev.photos) ? ev.photos : [],
      organisation: ev.organization_name ?? null,
    };
  } catch {
    return null;
  }
}
