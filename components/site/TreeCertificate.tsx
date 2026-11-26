import type { TreeEvidence } from "../../lib/goodapi";
import { TREE_LOCATION, TREE_SPECIES } from "../../lib/goodapi";

const dateFmt = (iso: string | null) =>
  iso
    ? new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
    : null;

/**
 * The tree certificate shown on a card. Built from GoodAPI's verified
 * planting record (location, species, GPS, date and photos), not from
 * anything CardRoots writes itself.
 */
export default function TreeCertificate({
  treeId,
  evidence,
}: {
  treeId: string;
  evidence: TreeEvidence | null;
}) {
  const verified = evidence?.status === "planted_and_verified" || evidence?.status === "planted";

  return (
    <section className="mx-auto mt-14 max-w-2xl overflow-hidden rounded-3xl border border-emerald-200 bg-[#f7faf5] text-left shadow-lg">
      <div className="bg-[#123524] px-6 py-5 text-center text-cream">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#e9c97a]">Tree certificate</p>
        <p className="mt-2 font-display text-2xl">{verified ? "Planted and verified" : "Tree registered"}</p>
      </div>

      <div className="space-y-5 p-6 sm:p-8">
        {verified && evidence?.photo && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={evidence.photo}
            alt={`Mangrove planting at ${evidence.site ?? TREE_LOCATION}`}
            className="aspect-[16/9] w-full rounded-2xl object-cover"
            loading="lazy"
          />
        )}

        <dl className="grid gap-4 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-ink/50">Location</dt>
            <dd className="mt-1 font-medium text-ink">
              {evidence?.site ? `${evidence.site}${evidence.subsite ? `, ${evidence.subsite}` : ""}` : TREE_LOCATION}
            </dd>
          </div>
          <div>
            <dt className="text-ink/50">Species</dt>
            <dd className="mt-1 font-medium italic text-ink">
              {evidence?.species?.length ? evidence.species.join(", ") : TREE_SPECIES}
            </dd>
          </div>
          <div>
            <dt className="text-ink/50">{verified ? "Planted with" : "Planting partner"}</dt>
            <dd className="mt-1 font-medium text-ink">{evidence?.organisation ?? "A verified restoration partner"}</dd>
          </div>
          <div>
            <dt className="text-ink/50">{verified ? "Verified on" : "Registered on"}</dt>
            <dd className="mt-1 font-medium text-ink">
              {dateFmt(verified ? evidence?.verifiedAt ?? null : evidence?.registeredAt ?? null) ?? "Pending"}
            </dd>
          </div>
          {verified && evidence?.latitude != null && evidence?.longitude != null && (
            <div className="sm:col-span-2">
              <dt className="text-ink/50">GPS</dt>
              <dd className="mt-1 font-medium text-ink">
                {evidence.latitude.toFixed(4)}, {evidence.longitude.toFixed(4)}
              </dd>
            </div>
          )}
        </dl>

        {!verified && (
          <p className="rounded-xl bg-white p-4 text-sm leading-relaxed text-ink/70">
            Your tree is registered with our planting partner. Its verified certificate, with photos and exact location,
            will appear here once the planting has been confirmed on the ground.
          </p>
        )}

        <p className="border-t border-ink/10 pt-4 text-xs text-ink/50">
          Certificate ref. {treeId}. Planting and verification by GoodAPI and its restoration partners.
        </p>
      </div>
    </section>
  );
}
