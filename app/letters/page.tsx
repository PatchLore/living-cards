import React from "react";
import Image from "next/image";
import { Metadata } from "next";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.cardroots.com").replace(/\/$/, "");
const TITLE = "Printable Pen Pal Kits and Stamp Stickers";
const DESCRIPTION =
  "Printable pen pal stationery: letter paper, envelope templates, writing prompts and stamp-style stickers. Print at home, write a letter, post it.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/letters" },
  openGraph: {
    type: "website",
    url: `${siteUrl}/letters`,
    title: TITLE,
    description: DESCRIPTION,
    siteName: "CardRoots",
    images: [{ url: `${siteUrl}/letters/kit-cover.jpg`, width: 1200, height: 1200 }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

/**
 * Fill these in when the products are live (e.g. Payhip product URLs).
 * While a link is empty, its button shows "Opening soon" and points to an email instead.
 */
const LINKS = {
  kit: "https://payhip.com/b/B6T3p",
  stamps: "https://payhip.com/b/BMmGg",
};

const NOTIFY = "mailto:info@cardroots.com?subject=Letters%20shop%20-%20tell%20me%20when%20it%20opens";

const KIT_ITEMS = [
  "Four letter paper designs, A5",
  "Three envelope templates to cut and fold",
  "Twenty things to write about",
  "A pen pal profile card for your first letter",
  "Twelve open-when labels",
];

const STEPS = [
  ["Print", "Download your files and print at 100% on ordinary paper. Use sticker paper for the stamps if you have it."],
  ["Write", "Pick a prompt, fold an envelope and fill the page. It doesn't have to be good. It has to be yours."],
  ["Post", "Add a real stamp, seal it with a sticker and send it. Then wait for a reply."],
];

function BuyButton({ href, label }: { href: string; label: string }) {
  if (href) {
    return (
      <a href={href} className="inline-block rounded-full bg-berry px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-berry-deep">
        {label}
      </a>
    );
  }
  return (
    <a href={NOTIFY} className="inline-block rounded-full border border-ink/30 px-6 py-3 text-sm font-semibold text-ink transition hover:border-berry hover:text-berry">
      {label} · opening soon, email me
    </a>
  );
}

export default function LettersPage() {
  return (
    <main className="bg-paper px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-5xl">
        {/* Hero */}
        <section className="grid items-center gap-10 md:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-berry">Printable pen pal stationery</p>
            <h1 className="mt-3 font-display text-5xl italic leading-[1.05] text-ink sm:text-6xl">Letters worth writing.</h1>
            <p className="mt-5 max-w-xl text-lg text-ink/70">
              Paper, envelopes and little stamp-style stickers to print at home. Pour a cup of tea, write a proper letter and post it to
              someone you miss.
            </p>
            <p className="mt-6 max-w-md border-l-2 border-berry/60 pl-4 font-display text-lg italic text-ink/75">
              Dear you, I have been meaning to write.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#kit" className="inline-block rounded-full bg-berry px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-berry-deep">
                See the kits
              </a>
              <a href="#how" className="inline-block rounded-full border border-ink/30 px-6 py-3 text-sm font-semibold text-ink transition hover:border-berry hover:text-berry">
                How it works
              </a>
            </div>
          </div>
          <div aria-hidden className="relative mx-auto h-72 w-full max-w-xs sm:h-80">
            <Image src="/letters/bunny.png" alt="" width={180} height={250} className="absolute left-2 top-6 w-40 -rotate-6 drop-shadow-xl" />
            <Image src="/letters/tulip.png" alt="" width={190} height={340} className="absolute right-0 top-0 w-44 rotate-6 drop-shadow-xl" />
            <Image src="/letters/bird.png" alt="" width={170} height={220} className="absolute bottom-0 left-1/4 w-40 -rotate-2 drop-shadow-xl" />
          </div>
        </section>

        {/* Starter kit */}
        <section id="kit" className="mt-20 grid scroll-mt-24 items-center gap-10 md:grid-cols-2">
          <div className="rounded-2xl border border-ink/10 bg-white p-3 shadow-lg">
            <Image
              src="/letters/kit-cover.jpg"
              alt="Printable Pen Pal Starter Kit: letter paper, envelope template and prompt card"
              width={1200}
              height={1200}
              className="h-auto w-full rounded-xl"
            />
          </div>
          <div>
            <h2 className="font-display text-3xl italic text-ink sm:text-4xl">The Pen Pal Starter Kit</h2>
            <p className="mt-4 text-ink/70">
              Everything you need to begin a correspondence, printed on your own paper at your own kitchen table. No postage stamps are
              included, but there is a small square waiting for one.
            </p>
            <ul className="mt-5 divide-y divide-ink/10 border-y border-ink/10">
              {KIT_ITEMS.map((t) => (
                <li key={t} className="py-2.5 text-ink/80">
                  <span aria-hidden className="mr-3 text-berry">&#10086;</span>
                  {t}
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <BuyButton href={LINKS.kit} label="Get the kit" />
            </div>
            <p className="mt-3 text-sm text-ink/55">Instant digital download. Nothing is posted to you.</p>
          </div>
        </section>

        {/* Stamp series */}
        <section id="stamps" className="mt-20 grid scroll-mt-24 items-center gap-10 md:grid-cols-2">
          <div className="order-2 md:order-1">
            <h2 className="font-display text-3xl italic text-ink sm:text-4xl">Letterbox Morning, Series 01</h2>
            <p className="mt-4 text-ink/70">
              Twenty-four little stamp-style stickers: post and parcels, tea and cosy things, flowers, and a few animal pals who also like
              getting mail. Collect them all, or stick them on everything.
            </p>
            <p className="mt-3 text-ink/70">
              Print on sticker paper and cut them out, or use the transparent PNGs in your digital journal. They are decorative, so remember
              a real stamp for the post.
            </p>
            <div className="mt-6">
              <BuyButton href={LINKS.stamps} label="Get Series 01" />
            </div>
            <p className="mt-3 text-sm text-ink/55">Instant digital download.</p>
          </div>
          <div className="order-1 rounded-2xl border border-ink/10 bg-white p-3 shadow-lg md:order-2">
            <Image
              src="/letters/stamps-all.jpg"
              alt="All 24 stamp-style stickers in Letterbox Morning Series 01"
              width={1200}
              height={1200}
              className="h-auto w-full rounded-xl"
            />
          </div>
        </section>

        {/* How it works */}
        <section id="how" className="mt-20 scroll-mt-24">
          <h2 className="font-display text-3xl italic text-ink sm:text-4xl">How it works</h2>
          <ol className="mt-8 grid gap-5 md:grid-cols-3">
            {STEPS.map(([title, body], i) => (
              <li key={title} className="rounded-2xl border border-ink/10 bg-white p-6">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-berry font-display text-white">{i + 1}</span>
                <h3 className="mt-4 font-display text-xl text-ink">{title}</h3>
                <p className="mt-2 text-ink/65">{body}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* Sample letter */}
        <section className="mt-20">
          <h2 className="font-display text-3xl italic text-ink sm:text-4xl">A sample letter</h2>
          <div className="relative mx-auto mt-8 max-w-xl -rotate-1 rounded-sm border border-parchment-300 bg-parchment-50 p-8 shadow-xl sm:p-10">
            <p className="text-ink/80">Dear Alice,</p>
            <p className="mt-4 text-ink/80">
              It rained all morning, so I made a pot of tea and sat by the window with nothing to do. Then I thought of you, and your habit
              of leaving books half read on every windowsill.
            </p>
            <p className="mt-4 text-ink/80">What are you reading now? I have a good one to lend you, if you promise to give it back.</p>
            <p className="mt-4 text-right font-display italic text-ink/75">
              Yours, with ink on my fingers,
              <br />M.
            </p>
          </div>
        </section>

        <p className="mt-16 text-sm text-ink/55">
          Digital downloads for personal use. Some artwork was created with AI image tools and then arranged by hand. Questions? Write to{" "}
          <a href="mailto:info@cardroots.com" className="font-semibold text-berry underline">
            info@cardroots.com
          </a>
          .
        </p>
      </div>
    </main>
  );
}
