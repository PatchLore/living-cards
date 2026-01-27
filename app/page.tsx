"use client";

import React, { useEffect, useRef, useState } from "react";
import { track } from "@vercel/analytics";
import dynamic from "next/dynamic";

type CardItem = {
  key: string;
  title: string;
  desc: string;
  src: string;
  webmSrc?: string;
  poster?: string;
  label?: string;
  available: number;
  badges?: string[];
};

const CARDS: CardItem[] = [
  // Christmas Cards
  {
    key: "starlit-christmas-tree",
    title: "Starlit Christmas Tree",
    desc: "A bright starlit scene unfolds with gentle motion, soft light, and subtle atmosphere, creating a calm and beautifully refined moment.",
    src: "/cards/christmas_tree.mp4",
    label: "Limited Edition",
    available: 42,
    badges: ["Bestseller"],
  },
  {
    key: "christmas-night-moonlight",
    title: "Christmas Night Moonlight",
    desc: "A serene moonlit scene unfolds with gentle motion, soft light, and subtle atmosphere, creating a calm and beautifully refined moment.",
    src: "/cards/moonlight.mp4",
    label: "Limited Edition",
    available: 38,
    badges: ["Most Popular"],
  },
  {
    key: "snowy-cottage-evening",
    title: "Snowy Cottage Evening",
    desc: "A peaceful winter scene unfolds with gentle motion, soft light, and subtle atmosphere, creating a calm and beautifully refined moment.",
    src: "/cards/Christmas2.mp4",
    label: "Limited Edition",
    available: 36,
    badges: ["Bestseller"],
  },
  {
    key: "winter-forest-tree",
    title: "Winter Forest Tree",
    desc: "A quiet forest scene unfolds with gentle motion, soft light, and subtle atmosphere, creating a calm and beautifully refined moment.",
    src: "/cards/XmasTree.mp4",
    label: "Limited Edition",
    available: 33,
    badges: ["Most Popular"],
  },
  {
    key: "golden-christmas-tree-rise",
    title: "Golden Christmas Tree Rise",
    desc: "A radiant golden scene unfolds with gentle motion, soft light, and subtle atmosphere, creating a calm and beautifully refined moment.",
    src: "/cards/Christmas1.mp4",
    label: "Limited Edition",
    available: 29,
    badges: ["Bestseller"],
  },
  {
    key: "santas-moonlit-ride",
    title: "Santa's Moonlit Ride",
    desc: "A nostalgic winter scene unfolds with gentle motion, soft light, and subtle atmosphere, creating a calm and beautifully refined moment.",
    src: "/cards/Santa.mp4",
    label: "Limited Edition",
    available: 24,
    badges: ["Most Popular"],
  },
  // Birthday Cards
  {
    key: "birthday-rose-bloom",
    title: "Birthday Rose Bloom",
    desc: "A delicate floral scene unfolds with gentle motion, soft light, and subtle atmosphere, creating a calm and beautifully refined moment.",
    src: "/cards/rose.mp4",
    label: "Limited Edition",
    available: 35,
    badges: ["Bestseller"],
  },
  {
    key: "elegant-floral-birthday",
    title: "Elegant Floral Birthday",
    desc: "A graceful watercolor scene unfolds with gentle motion, soft light, and subtle atmosphere, creating a calm and beautifully refined moment.",
    src: "/cards/Birthday2.mp4",
    label: "Limited Edition",
    available: 31,
    badges: ["Most Popular"],
  },
  // Thank You Cards
  {
    key: "thank-you-florals",
    title: "Thank You Florals",
    desc: "A minimal floral scene unfolds with gentle motion, soft light, and subtle atmosphere, creating a calm and beautifully refined moment.",
    src: "/cards/Thankyou2.mp4",
    label: "Limited Edition",
    available: 27,
    badges: ["Bestseller"],
  },
  // Love / Heart Cards
  {
    key: "heart-of-light",
    title: "Heart of Light",
    desc: "A luminous golden scene unfolds with gentle motion, soft light, and subtle atmosphere, creating a calm and beautifully refined moment.",
    src: "/cards/heart1.mp4",
    label: "Limited Edition",
    available: 22,
    badges: ["Most Popular"],
  },
  {
    key: "golden-heart-glow",
    title: "Golden Heart Glow",
    desc: "A radiant glowing scene unfolds with gentle motion, soft light, and subtle atmosphere, creating a calm and beautifully refined moment.",
    src: "/cards/heart2.mp4",
    label: "Limited Edition",
    available: 19,
    badges: ["Bestseller"],
  },
  // General Cards
  {
    key: "warm-wishes",
    title: "Warm Wishes",
    desc: "A warm glowing scene unfolds with gentle motion, soft light, and subtle atmosphere, creating a calm and beautifully refined moment.",
    src: "/cards/warm_wishes.mp4",
    label: "Limited Edition",
    available: 25,
    badges: ["Most Popular"],
  },
];

const heroPreviewCards: CardItem[] = CARDS.slice(0, 3);
const ExitIntentModal = dynamic(() => import("../components/ExitIntentModal"), { ssr: false });

type LazyVideoProps = {
  src: string;
  webmSrc?: string;
  poster?: string;
  className?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  playsInline?: boolean;
  onMouseEnter?: React.MouseEventHandler<HTMLVideoElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLVideoElement>;
  onFocus?: React.FocusEventHandler<HTMLVideoElement>;
  onBlur?: React.FocusEventHandler<HTMLVideoElement>;
  onTouchStart?: React.TouchEventHandler<HTMLVideoElement>;
};

type StatValue = number | null;

type Testimonial = {
  quote: string;
  name: string;
  title: string;
  photo?: string;
};

type Logo = {
  src: string;
  alt: string;
};

function LazyVideo({
  src,
  webmSrc,
  poster,
  className,
  autoPlay,
  loop,
  muted,
  playsInline,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
  onTouchStart,
}: LazyVideoProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!videoRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(videoRef.current);
    return () => observer.disconnect();
  }, []);

  const requestLoad = () => {
    if (!shouldLoad) setShouldLoad(true);
  };

  return (
    <div className="relative">
      {!isLoaded && (
        <div
          className="absolute inset-0 rounded-2xl bg-slate-200/70 animate-pulse"
          aria-hidden
        />
      )}
      <video
        ref={videoRef}
        className={className}
        poster={poster}
        autoPlay={shouldLoad && autoPlay}
        loop={loop}
        muted={muted}
        playsInline={playsInline}
        preload={shouldLoad ? "metadata" : "none"}
        onLoadedData={() => setIsLoaded(true)}
        onMouseEnter={(event) => {
          requestLoad();
          onMouseEnter?.(event);
        }}
        onMouseLeave={(event) => {
          onMouseLeave?.(event);
        }}
        onFocus={(event) => {
          requestLoad();
          onFocus?.(event);
        }}
        onBlur={(event) => {
          onBlur?.(event);
        }}
        onTouchStart={(event) => {
          requestLoad();
          onTouchStart?.(event);
        }}
      >
        {shouldLoad && webmSrc && <source src={webmSrc} type="video/webm" />}
        {shouldLoad && <source src={src} type="video/mp4" />}
      </video>
    </div>
  );
}

export default function Home() {
  const [recipient, setRecipient] = useState("");
  const [message, setMessage] = useState("");
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>("All Cards");
  const [quickViewCard, setQuickViewCard] = useState<CardItem | null>(null);
  const [showFullPreview, setShowFullPreview] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [showMobileCta, setShowMobileCta] = useState(false);
  const [faqQuery, setFaqQuery] = useState("");
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  const collectionRef = useRef<HTMLElement | null>(null);
  const formRef = useRef<HTMLDivElement | null>(null);

  const selectedCardItem = CARDS.find((c) => c.key === selectedCard) ?? null;

  const stats = {
    treesPlanted: null as StatValue,
    cardsSent: null as StatValue,
    monthlyTreesPlanted: null as StatValue,
  };

  const testimonials: Testimonial[] = [];
  const partnerLogos: Logo[] = [];
  const impactImages: { src: string; alt: string }[] = [];
  const faqItems = [
    {
      question: "What is CardRoots?",
      answer: "CardRoots is a digital greeting card platform where every card helps plant a real tree.",
    },
    {
      question: "How do I personalize my message?",
      answer: "Choose a card, click Personalize, and add your recipient name and message before checkout.",
    },
    {
      question: "Can I schedule delivery for later?",
      answer: "Scheduling is not available yet, but we can add it based on demand. Contact us for updates.",
    },
    {
      question: "Do you offer refunds?",
      answer: "If there’s an issue with delivery or your card, contact support and we’ll make it right.",
    },
    {
      question: "How do I know my tree was actually planted?",
      answer: "We work with verified planting partners and can provide confirmation once available.",
    },
  ];

  useEffect(() => {
    if (selectedCard && formRef.current) {
      // small timeout to allow layout changes before scrolling
      setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 80);
    }
  }, [selectedCard]);

  useEffect(() => {
    if (!quickViewCard) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setQuickViewCard(null);
        setShowFullPreview(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [quickViewCard]);

  useEffect(() => {
    const handleScroll = () => {
      setShowMobileCta(window.scrollY > 520);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const thresholds = [25, 50, 75];
    const fired = new Set<number>();
    const handleScrollDepth = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;
      const percent = Math.round((scrollTop / docHeight) * 100);
      thresholds.forEach((threshold) => {
        if (percent >= threshold && !fired.has(threshold)) {
          fired.add(threshold);
          trackEvent("scroll_depth", { percent: threshold });
        }
      });
    };
    handleScrollDepth();
    window.addEventListener("scroll", handleScrollDepth, { passive: true });
    return () => window.removeEventListener("scroll", handleScrollDepth);
  }, []);

  const trackEvent = (name: string, data?: Record<string, string | number>) => {
    try {
      track(name, data);
    } catch {
      // ignore tracking failures
    }
  };

  const handlePreviewPlay =
    (cardKey: string) => (event: React.SyntheticEvent<HTMLVideoElement>) => {
      const video = event.currentTarget;
      video.play().catch(() => undefined);
      trackEvent("video_preview_play", { cardKey });
    };

  const handlePreviewPause = (event: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = event.currentTarget;
    video.pause();
    video.currentTime = 0;
  };

  const formatStat = (value: StatValue, fallback: string) =>
    value === null ? fallback : value.toLocaleString("en-GB");

  const filteredFaqs = faqItems.filter((item) =>
    item.question.toLowerCase().includes(faqQuery.toLowerCase())
  );

  const handleCheckout = async () => {
    if (!selectedCard) {
      alert("Please select a card first.");
      return;
    }
    trackEvent("checkout_start", { cardKey: selectedCard });

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cardKey: selectedCard,
          recipient: recipient,
          message: message,
        }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error("Stripe checkout error:", data);
        alert("Unable to start checkout. Please try again.");
      }
    } catch (error) {
      console.error("Checkout request failed:", error);
      alert("Something went wrong starting checkout. Please try again.");
    }
  };

  const CATEGORY_ORDER: Record<string, number> = {
    "Christmas": 0,
    "Birthday": 1,
    "Thank You": 2,
    "Love": 3,
    "General": 4,
  };

  function getCategory(cardKey: string): string {
    const k = cardKey.toLowerCase();
    if (k.includes("christmas") || k.includes("xmas") || k.includes("santa")) return "Christmas";
    if (k.includes("birthday")) return "Birthday";
    if (k.includes("thank")) return "Thank You";
    if (k.includes("heart") || k.includes("love")) return "Love";
    return "General";
  }

  const sortedCards = React.useMemo(() => {
    return [...CARDS].sort((a, b) => {
      const categoryA = getCategory(a.key);
      const categoryB = getCategory(b.key);
      const catA = CATEGORY_ORDER[categoryA] ?? 999;
      const catB = CATEGORY_ORDER[categoryB] ?? 999;

      if (catA !== catB) return catA - catB;

      // alphabetic fallback inside the same category
      return a.title.localeCompare(b.title);
    });
  }, []);

  const filters = ["All Cards", "Christmas", "Birthday", "Thank You", "Love"];

  const filteredCards = React.useMemo(() => {
    if (activeFilter === "All Cards") return sortedCards;
    return sortedCards.filter((card) => getCategory(card.key) === activeFilter);
  }, [activeFilter, sortedCards]);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://cardroots.com";
  
  // Structured data for Product collection
  const productCollectionSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Digital Christmas Cards That Plant Trees",
    description: "Collection of animated digital greeting cards that plant real trees. Eco-friendly Christmas, birthday, and thank you cards.",
    itemListElement: CARDS.map((card, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Product",
        name: card.title,
        description: card.desc,
        image: `${siteUrl}${card.src}`,
        offers: {
          "@type": "Offer",
          price: "5.00",
          priceCurrency: "GBP",
          availability: "https://schema.org/InStock",
          url: `${siteUrl}/card/${card.key}`,
        },
        brand: {
          "@type": "Brand",
          name: "CardRoots",
        },
        category: "Digital Greeting Cards",
        additionalProperty: {
          "@type": "PropertyValue",
          name: "Trees Planted",
          value: "1",
        },
      },
    })),
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-slate-100 py-16 px-6 relative">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productCollectionSchema) }}
      />

      {/* Decorative soft vignette / blur (visuals added later) */}
      <div className="absolute inset-0 pointer-events-none opacity-40 blur-3xl"></div>

      <header className="sticky top-0 z-30 -mx-6 mb-10 bg-white/90 backdrop-blur-xl border-b border-slate-200/70">
        <div className="max-w-6xl mx-auto px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-sm font-semibold text-slate-800">CardRoots</div>
          <nav className="hidden sm:flex items-center gap-4 text-sm font-medium text-slate-700">
            <button
              onClick={() => {
                document.getElementById("how-it-works")?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
                trackEvent("nav_how_it_works");
              }}
              className="hover:text-slate-900 transition"
            >
              How It Works
            </button>
            <button
              onClick={() => {
                collectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                trackEvent("nav_browse_cards");
              }}
              className="hover:text-slate-900 transition"
            >
              Browse Cards
            </button>
            <a
              href="/corporate"
              className="hover:text-slate-900 transition"
              onClick={() => trackEvent("nav_for_business")}
            >
              For Business
            </a>
          </nav>
          <button
            className="sm:hidden inline-flex items-center gap-2 text-sm font-medium text-slate-700"
            onClick={() => setIsNavOpen((prev) => !prev)}
            aria-expanded={isNavOpen}
            aria-controls="mobile-nav"
          >
            Menu
            <span className="text-lg">{isNavOpen ? "✕" : "☰"}</span>
          </button>
        </div>
        {isNavOpen && (
          <div
            id="mobile-nav"
            className="sm:hidden px-6 pb-4 flex flex-col gap-3 text-sm font-medium text-slate-700"
          >
            <button
              onClick={() => {
                document.getElementById("how-it-works")?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
                setIsNavOpen(false);
                trackEvent("nav_how_it_works");
              }}
              className="text-left"
            >
              How It Works
            </button>
            <button
              onClick={() => {
                collectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                setIsNavOpen(false);
                trackEvent("nav_browse_cards");
              }}
              className="text-left"
            >
              Browse Cards
            </button>
            <a
              href="/corporate"
              className="text-left"
              onClick={() => trackEvent("nav_for_business")}
            >
              For Business
            </a>
          </div>
        )}
      </header>

      {/* Hero */}
      <section
        className="max-w-6xl mx-auto mb-16 flex flex-col lg:flex-row items-center gap-10"
        itemScope
        itemType="https://schema.org/SoftwareApplication"
      >
        <div className="flex-1 text-center lg:text-left space-y-6">
          <p className="text-sm font-semibold tracking-wide text-amber-600 uppercase">
            Eco-friendly digital greetings
          </p>
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-slate-900"
            itemProp="name"
          >
            Send Beautiful Digital Cards That Plant Real Trees
          </h1>
          <p
            className="text-lg text-slate-700 max-w-xl mx-auto lg:mx-0"
            itemProp="description"
          >
            Choose an animated card, write a heartfelt message, and fund the planting of a real tree
            with every send.
          </p>
          {/* AI-friendly semantic content - hidden visually but accessible to crawlers */}
          <div className="sr-only">
            <p>
              CardRoots is a digital greeting card service that sends beautiful animated cards and
              plants a real tree for every card purchased. CardRoots provides eco-friendly digital
              cards for Christmas, birthdays, thank you messages, and special occasions. Unlike
              traditional greeting cards that create waste, CardRoots offers instant digital
              delivery with real environmental impact. Every digital card funds the planting of a
              real tree, making each greeting card a sustainable gift that helps restore forests
              worldwide.
            </p>
          </div>
          <div className="pt-2 flex flex-col sm:flex-row items-center sm:items-stretch gap-3">
            <button
              onClick={() => {
                collectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                trackEvent("cta_browse_hero");
              }}
              className="inline-flex items-center justify-center px-7 py-3.5 rounded-2xl bg-amber-500/90 hover:bg-amber-500 text-white font-medium shadow-md shadow-amber-500/30 transition-transform transform hover:-translate-y-0.5"
            >
              Browse Our Cards
            </button>
            <a
              href="/corporate"
              className="inline-flex items-center justify-center px-5 py-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-600 text-slate-100 font-medium transition"
              onClick={() => trackEvent("cta_business_hero")}
            >
              For Business / Bulk Orders
            </a>
          </div>
          <p className="text-sm text-slate-600">
            {formatStat(stats.treesPlanted, "X,XXX")} trees planted |{" "}
            {formatStat(stats.cardsSent, "X,XXX")} cards sent
          </p>
        </div>

        <div className="flex-1 w-full">
          <div className="relative">
            <div className="absolute -inset-6 bg-gradient-to-tr from-emerald-200/40 via-amber-100/30 to-sky-200/40 blur-2xl rounded-3xl pointer-events-none" />
            <div className="relative rounded-3xl bg-white/70 backdrop-blur-xl border border-white/60 shadow-xl overflow-hidden">
              <div className="flex gap-4 p-4 hero-carousel-track motion-reduce:animate-none">
                {[...heroPreviewCards, ...heroPreviewCards].map((card, index) => (
                  <div
                    key={`${card.key}-${index}`}
                    className="group min-w-[9.5rem] sm:min-w-[11rem] lg:min-w-[12rem] rounded-2xl overflow-hidden border border-slate-200/70 bg-slate-950/90 shadow-md transition-transform duration-500"
                  >
                    <LazyVideo
                      className="w-full h-32 sm:h-40 object-cover transition-transform duration-700 group-hover:scale-105"
                      src={card.src}
                      webmSrc={card.webmSrc}
                      poster={card.poster}
                      autoPlay
                      loop
                      muted
                      playsInline
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="max-w-6xl mx-auto mb-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-semibold text-slate-900">How It Works</h2>
          <p className="text-sm text-slate-600 mt-2">
            Choose a card, personalize your message, and deliver instantly via email.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "Choose Card",
              description: "Browse curated animated designs for every occasion.",
            },
            {
              title: "Personalize Message",
              description: "Add your message and preview the full animation.",
            },
            {
              title: "Tree Gets Planted",
              description: "Each card funds a real tree planted in verified projects.",
            },
          ].map((step, index) => (
            <div
              key={step.title}
              className="bg-white/90 border border-slate-200 rounded-2xl p-6 shadow-sm"
            >
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 font-semibold flex items-center justify-center mb-4">
                {index + 1}
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">{step.title}</h3>
              <p className="text-sm text-slate-600">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Collection */}
      <section
        id="collection"
        ref={collectionRef}
        className="max-w-6xl mx-auto mb-16"
      >
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Browse the collection</h2>
            <p className="text-sm text-slate-600">
              Pick an animated card and personalize it in minutes.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => {
                  setActiveFilter(filter);
                  trackEvent("filter_select", { filter });
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition ${
                  activeFilter === filter
                    ? "bg-slate-900 text-white border-slate-900"
                    : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory sm:overflow-visible sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-8">
          {filteredCards.map((card) => (
            <article
              key={card.key}
              className="min-w-[16rem] sm:min-w-0 snap-start rounded-3xl bg-white border border-slate-200 p-4 shadow-lg hover:shadow-2xl hover:scale-[1.02] transition transform"
            >
              <div className="flex flex-wrap items-center gap-2 mb-2">
                {card.label && (
                  <span className="text-[11px] uppercase tracking-wide text-amber-700 font-semibold bg-amber-100/70 px-2 py-1 rounded-full">
                    {card.label}
                  </span>
                )}
                {card.badges?.map((badge) => (
                  <span
                    key={badge}
                    className="text-[11px] uppercase tracking-wide text-emerald-700 font-semibold bg-emerald-100/70 px-2 py-1 rounded-full"
                  >
                    {badge}
                  </span>
                ))}
              </div>
              <div className="text-xs text-slate-600 font-medium mb-3">
                Limited Edition - Only {card.available} cards available
              </div>
              <div className="rounded-2xl overflow-hidden mb-4">
                <LazyVideo
                  className="w-full h-56 object-cover"
                  src={card.src}
                  webmSrc={card.webmSrc}
                  poster={card.poster}
                  loop
                  muted
                  playsInline
                  onMouseEnter={handlePreviewPlay(card.key)}
                  onMouseLeave={handlePreviewPause}
                  onFocus={handlePreviewPlay(card.key)}
                  onBlur={handlePreviewPause}
                  onTouchStart={handlePreviewPlay(card.key)}
                />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-1">{card.title}</h3>
              <p className="text-sm text-slate-700 mb-2">{card.desc}</p>
              <div className="text-sm text-slate-800 font-medium mb-3">
                £5 — Includes 1 tree planted 🌱
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => {
                    setSelectedCard(card.key);
                    trackEvent("select_card", { cardKey: card.key });
                  }}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-white hover:bg-slate-900 transition"
                >
                  Select This Card
                </button>
                <button
                  onClick={() => {
                    setQuickViewCard(card);
                    setShowFullPreview(false);
                    trackEvent("quick_view_open", { cardKey: card.key });
                  }}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition"
                >
                  Quick View
                </button>
                <button
                  onClick={() => {
                    setSelectedCard(card.key);
                    // also scroll to form
                    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                    trackEvent("personalize_start", { cardKey: card.key });
                  }}
                  className="px-3 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition"
                >
                  Personalize
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* Placeholder tiles for future cards */}
        {/*
        <article className="rounded-3xl bg-white border border-slate-200 p-4 shadow-lg">
          <div className="text-xs uppercase tracking-wide text-amber-600 font-semibold mb-2">Limited Edition</div>
          <div className="rounded-2xl overflow-hidden mb-4 h-56 bg-slate-100" />
          <h3 className="text-lg font-semibold text-slate-800 mb-1">Coming Soon</h3>
          <p className="text-sm text-slate-700 mb-4">More curated cards arriving this season.</p>
        </article>
        */}
      </section>

      {/* FAQ Block */}
      <section className="max-w-3xl mx-auto mb-12 px-6">
        <h2 className="text-2xl font-semibold text-slate-800 mb-4">Frequently Asked Questions</h2>
        <div className="mb-4">
          <input
            type="text"
            value={faqQuery}
            onChange={(event) => setFaqQuery(event.target.value)}
            placeholder="Search FAQs"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-700 bg-white"
            aria-label="Search FAQs"
          />
        </div>
        <div className="space-y-3">
          {filteredFaqs.map((item) => {
            const isOpen = openFaq === item.question;
            return (
              <div key={item.question} className="border border-slate-200 rounded-2xl bg-white">
                <button
                  className="w-full text-left px-5 py-4 flex items-center justify-between text-slate-800 font-medium"
                  onClick={() => setOpenFaq(isOpen ? null : item.question)}
                  aria-expanded={isOpen}
                >
                  <span>{item.question}</span>
                  <span className="text-lg">{isOpen ? "−" : "+"}</span>
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 text-sm text-slate-600">{item.answer}</div>
                )}
              </div>
            );
          })}
          {filteredFaqs.length === 0 && (
            <div className="text-sm text-slate-500">No results found. Try a different search.</div>
          )}
        </div>
      </section>

      <section className="max-w-6xl mx-auto mb-16">
        <div className="bg-white/90 border border-slate-200 rounded-3xl p-8 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">Trust & Impact</h2>
              <p className="text-sm text-slate-600 mt-2">
                {formatStat(stats.monthlyTreesPlanted, "X")} trees planted this month
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {[
                "Tree Planting Certificate Included",
                "Verified Planting Projects",
                "Secure Checkout",
              ].map((badge) => (
                <span
                  key={badge}
                  className="text-[11px] uppercase tracking-wide text-slate-700 font-semibold bg-slate-100 px-3 py-1.5 rounded-full"
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>

          {testimonials.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {testimonials.map((testimonial) => (
                <figure
                  key={testimonial.name}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <blockquote className="text-sm text-slate-700">
                    “{testimonial.quote}”
                  </blockquote>
                  <figcaption className="mt-4 text-sm font-semibold text-slate-900">
                    {testimonial.name}
                    <span className="block text-xs font-normal text-slate-600">
                      {testimonial.title}
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
          )}

          {partnerLogos.length > 0 && (
            <div className="mb-8">
              <p className="text-xs uppercase tracking-wide text-slate-500 font-semibold mb-3">
                Verified partners
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {partnerLogos.map((logo) => (
                  <div
                    key={logo.alt}
                    className="h-14 rounded-xl border border-slate-200 bg-white flex items-center justify-center"
                  >
                    <img src={logo.src} alt={logo.alt} className="max-h-8" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {impactImages.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {impactImages.map((image) => (
                <div key={image.alt} className="rounded-2xl overflow-hidden border border-slate-200">
                  <img src={image.src} alt={image.alt} className="w-full h-56 object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Personalization Form (hidden until a card is selected) */}
      <div className="max-w-3xl mx-auto" ref={formRef}>
        {selectedCardItem && (
          <section className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/40 p-7">
            <h2 className="text-2xl font-semibold text-slate-800 mb-2">
              Personalize Your Card — {selectedCardItem.title}
            </h2>
            <p className="text-sm text-slate-700 mb-6">Step 2 — Add a personal touch to your selected card.</p>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-slate-800 font-medium">Recipient name</label>
                <input
                  className="w-full px-4 py-3 border border-slate-300 text-slate-800 placeholder-slate-400 rounded-lg focus:ring-2 focus:ring-green-500/40 bg-white"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="e.g., Maya"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-800 font-medium">Message</label>
                <textarea
                  className="w-full px-4 py-3 border border-slate-300 text-slate-800 placeholder-slate-400 rounded-lg focus:ring-2 focus:ring-green-500/40 bg-white resize-none h-32"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write a heartfelt message..."
                  maxLength={240}
                />
                <p className="text-xs text-right text-slate-700">{message.length}/240</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleCheckout}
                    className="px-5 py-3 rounded-2xl bg-amber-500 text-white font-semibold shadow-md"
                  >
                    Continue to Payment
                  </button>
                  <button
                    onClick={() => setSelectedCard(null)}
                    className="px-4 py-3 rounded-2xl border border-slate-200 text-slate-700"
                  >
                    Back to Collection
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>

      {showMobileCta && (
        <div className="fixed bottom-4 left-4 right-4 z-40 sm:hidden">
          <button
            onClick={() => {
              collectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
              trackEvent("mobile_cta_view_all");
            }}
            className="w-full bg-slate-900 text-white py-3 rounded-2xl shadow-lg"
          >
            View All {filteredCards.length} Cards
          </button>
        </div>
      )}

      {quickViewCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6 py-10 bg-slate-900/70 backdrop-blur-sm">
          <div className="relative w-full max-w-4xl rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">{quickViewCard.title}</h3>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  {quickViewCard.label && (
                    <span className="text-[11px] uppercase tracking-wide text-amber-700 font-semibold bg-amber-100/70 px-2 py-1 rounded-full">
                      {quickViewCard.label}
                    </span>
                  )}
                  {quickViewCard.badges?.map((badge) => (
                    <span
                      key={badge}
                      className="text-[11px] uppercase tracking-wide text-emerald-700 font-semibold bg-emerald-100/70 px-2 py-1 rounded-full"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
                <p className="text-sm text-slate-600 mt-2">
                  Limited Edition - Only {quickViewCard.available} cards available
                </p>
              </div>
              <button
                onClick={() => {
                  setQuickViewCard(null);
                  setShowFullPreview(false);
                }}
                className="text-slate-500 hover:text-slate-800 transition"
                aria-label="Close quick view"
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-slate-700">{quickViewCard.desc}</p>
              <div className="rounded-2xl overflow-hidden bg-slate-100">
                <video
                  className={`w-full object-cover ${showFullPreview ? "h-96" : "h-64"}`}
                  src={quickViewCard.src}
                  autoPlay
                  loop={!showFullPreview}
                  muted
                  playsInline
                  controls={showFullPreview}
                />
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => {
                    setSelectedCard(quickViewCard.key);
                    trackEvent("select_card", { cardKey: quickViewCard.key });
                  }}
                  className="px-4 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition"
                >
                  Select This Card
                </button>
                <button
                  onClick={() => {
                    setShowFullPreview((prev) => !prev);
                    trackEvent("preview_full_toggle", { cardKey: quickViewCard.key });
                  }}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition"
                >
                  {showFullPreview ? "Back to Quick View" : "Preview Full Card"}
                </button>
                <button
                  onClick={() => {
                    setSelectedCard(quickViewCard.key);
                    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                    setQuickViewCard(null);
                    setShowFullPreview(false);
                    trackEvent("personalize_start", { cardKey: quickViewCard.key });
                  }}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition"
                >
                  Personalize
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ExitIntentModal
        headline="Wait! Plant your first tree"
        subheadline="Get a discount and track your tree planting impact."
        offer="Get 10% off your first card"
      />
    </main>
  );
}
