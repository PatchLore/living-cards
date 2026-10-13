import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-night text-cream/70">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[2fr_1fr_1fr] lg:px-8">
        <div>
          <p className="font-display text-2xl text-cream">CardRoots</p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed">
            Animated digital cards, personalised in the scene itself and delivered instantly. Every card helps plant a real
            tree.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold text-cream">Cards</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link className="hover:text-gold" href="/#christmas">Christmas</Link></li>
            <li><Link className="hover:text-gold" href="/#occasions">Birthday, thank you &amp; love</Link></li>
            <li><Link className="hover:text-gold" href="/corporate">Business &amp; bulk orders</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold text-cream">Help</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link className="hover:text-gold" href="/#faq">FAQ</Link></li>
            <li><a className="hover:text-gold" href="mailto:info@cardroots.com">info@cardroots.com</a></li>
            <li><Link className="hover:text-gold" href="/terms">Terms</Link> · <Link className="hover:text-gold" href="/privacy">Privacy</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-6 text-center text-xs text-cream/50">
        © {new Date().getFullYear()} CardRoots
      </div>
    </footer>
  );
}
