import Link from "next/link";

const NAV = [
  { href: "/#christmas", label: "Christmas cards" },
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
        <nav aria-label="Main" className="hidden items-center gap-7 text-sm text-cream/80 md:flex">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="transition hover:text-gold">
              {n.label}
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
    </header>
  );
}
