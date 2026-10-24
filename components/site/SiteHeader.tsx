import Link from "next/link";

const NAV: { href: string; label: string; isNew?: boolean }[] = [
  { href: "/#christmas", label: "Christmas cards" },
  { href: "/kids", label: "✨ For Kids", isNew: true },
  { href: "/#how", label: "How it works" },
  { href: "/#occasions", label: "Other occasions" },
  { href: "/#faq", label: "FAQ" },
  { href: "/corporate", label: "Business" },
];

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-night">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 text-cream">
          <span aria-hidden className="text-xl">🌲</span>
          <span className="font-display text-xl tracking-tight">CardRoots</span>
        </Link>
        <nav aria-label="Main" className="hidden items-center gap-5 text-sm text-cream/80 lg:flex">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="flex items-center gap-1.5 whitespace-nowrap transition hover:text-gold">
              {n.label}
              {n.isNew && <span className="rounded-full bg-gold/20 px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-gold">NEW</span>}
            </Link>
          ))}
        </nav>
        <Link
          href="/#christmas"
          className="rounded-full bg-berry px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-berry-deep"
        >
          Send a card
        </Link>
      </div>
      <nav aria-label="Main (mobile)" className="no-scrollbar flex items-center gap-5 overflow-x-auto border-t border-white/10 px-4 py-3 text-sm text-cream/80 sm:px-6 lg:hidden">
        {NAV.map((n) => (
          <Link key={n.href} href={n.href} className="flex shrink-0 items-center gap-1.5 whitespace-nowrap transition hover:text-gold">
            {n.label}
            {n.isNew && <span className="rounded-full bg-gold/20 px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-gold">NEW</span>}
          </Link>
        ))}
      </nav>
    </header>
  );
}
