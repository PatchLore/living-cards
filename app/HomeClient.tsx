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
  priority?: boolean;
};

const CARDS: CardItem[] = [
  // Easter Cards — posters easter1.jpg–easter8.jpg + matching MP4s in public/cards/posters/
  {
    key: "easter-morning",
    title: "Easter Morning",
    desc: "A beautiful Easter morning animation.",
    src: "/cards/posters/easter1.mp4",
    poster: "/cards/posters/easter1.jpg",
    label: "New Easter Collection",
    available: 45,
    badges: ["Easter"],
    priority: true,
  },
  {
    key: "easter-bloom",
    title: "Easter Bloom",
    desc: "Spring flowers blooming for Easter.",
    src: "/cards/posters/easter2.mp4",
    poster: "/cards/posters/easter2.jpg",
    label: "⭐ Staff Pick",
    available: 42,
    badges: ["Easter"],
    priority: true,
  },
  {
    key: "easter-bunny",
    title: "Easter Bunny",
    desc: "A cheerful Easter bunny to brighten their day.",
    src: "/cards/posters/easter3.mp4",
    poster: "/cards/posters/easter3.jpg",
    label: "🔥 Most Popular",
    available: 40,
    badges: ["Easter"],
    priority: true,
  },
  {
    key: "easter-eggs",
    title: "Easter Eggs",
    desc: "Colourful Easter eggs for a joyful celebration.",
    src: "/cards/posters/easter4.mp4",
    poster: "/cards/posters/easter4.jpg",
    label: "Limited Time",
    available: 38,
    badges: ["Easter"],
  },
  {
    key: "easter-garden",
    title: "Easter Garden",
    desc: "A garden in full spring bloom for Easter.",
    src: "/cards/posters/easter5.mp4",
    poster: "/cards/posters/easter5.jpg",
    label: "Limited Time",
    available: 36,
    badges: ["Easter"],
  },
  {
    key: "easter-joy",
    title: "Easter Joy",
    desc: "Spreading joy this Easter season.",
    src: "/cards/posters/easter6.mp4",
    poster: "/cards/posters/easter6.jpg",
    label: "Limited Time",
    available: 34,
    badges: ["Easter"],
  },
  {
    key: "easter-sunrise",
    title: "Easter Sunrise",
    desc: "A warm Easter sunrise to share with loved ones.",
    src: "/cards/posters/easter7.mp4",
    poster: "/cards/posters/easter7.jpg",
    label: "Limited Time",
    available: 32,
    badges: ["Easter"],
  },
  {
    key: "easter-wishes",
    title: "Easter Wishes",
    desc: "Warm Easter wishes for everyone you love.",
    src: "/cards/posters/easter8.mp4",
    poster: "/cards/posters/easter8.jpg",
    label: "🆕 New This Year",
    available: 30,
    badges: ["Easter"],
  },
  // Christmas Cards
  {
    key: "starlit-christmas-tree",
    title: "Starlit Christmas Tree",
    desc: "A sparkling tree under a starlit winter sky.",
    src: "/cards/christmas_tree.mp4",
    poster: "/cards/posters/christmas_tree.jpg",
    label: "Limited Edition",
    available: 42,
    badges: ["Bestseller"],
  },
  {
    key: "christmas-night-moonlight",
    title: "Christmas Night Moonlight",
    desc: "A moonlit winter night with soft glow and snowfall.",
    src: "/cards/moonlight.mp4",
    poster: "/cards/posters/moonlight.jpg",
    label: "Limited Edition",
    available: 38,
    badges: ["Most Popular"],
  },
  {
    key: "snowy-cottage-evening",
    title: "Snowy Cottage Evening",
    desc: "Cozy cottage lights on a calm snowy evening.",
    src: "/cards/Christmas2.mp4",
    poster: "/cards/posters/Christmas2.jpg",
    label: "Limited Edition",
    available: 36,
    badges: ["Bestseller"],
  },
  {
    key: "winter-forest-tree",
    title: "Winter Forest Tree",
    desc: "A tranquil forest scene with a glowing evergreen.",
    src: "/cards/XmasTree.mp4",
    poster: "/cards/posters/XmasTree.jpg",
    label: "Limited Edition",
    available: 33,
    badges: ["Most Popular"],
  },
  {
    key: "golden-christmas-tree-rise",
    title: "Golden Christmas Tree Rise",
    desc: "Golden festive light rising through the winter air.",
    src: "/cards/Christmas1.mp4",
    poster: "/cards/posters/Christmas1.jpg",
    label: "Limited Edition",
    available: 29,
    badges: ["Bestseller"],
  },
  {
    key: "santas-moonlit-ride",
    title: "Santa's Moonlit Ride",
    desc: "Santa’s sleigh gliding across a quiet night sky.",
    src: "/cards/Santa.mp4",
    poster: "/cards/posters/Santa.jpg",
    label: "Limited Edition",
    available: 24,
    badges: ["Most Popular"],
  },
  // Birthday Cards (rose/heart posters removed — only Valentine uses valentine1-5)
  {
    key: "elegant-floral-birthday",
    title: "Elegant Floral Birthday",
    desc: "Soft watercolor florals with celebratory motion.",
    src: "/cards/Birthday2.mp4",
    poster: "/cards/posters/Birthday2.jpg",
    label: "Limited Edition",
    available: 31,
    badges: ["Most Popular"],
  },
  // Thank You Cards
  {
    key: "thank-you-florals",
    title: "Thank You Florals",
    desc: "Minimal florals that say thank you with warmth.",
    src: "/cards/Thankyou2.mp4",
    poster: "/cards/posters/Thankyou2.jpg",
    label: "Limited Edition",
    available: 27,
    badges: ["Bestseller"],
  },
  // General Cards
  {
    key: "warm-wishes",
    title: "Warm Wishes",
    desc: "A gentle warm glow for any heartfelt message.",
    src: "/cards/warm_wishes.mp4",
    poster: "/cards/posters/warm_wishes.jpg",
    label: "Limited Edition",
    available: 25,
    badges: ["Most Popular"],
  },
];

const heroPreviewCards: CardItem[] = CARDS.filter((c) => c.priority).slice(0, 3);

// Descriptive alt text for Easter cards (SEO + accessibility)
const EASTER_CARD_ALTS: Record<string, string> = {
  "easter-morning": "Easter morning digital card animation that plants a tree",
  "easter-bloom": "Easter bloom spring flowers digital card animation that plants a tree",
  "easter-bunny": "Easter bunny digital card animation that plants a tree",
  "easter-eggs": "Easter eggs colourful digital card animation that plants a tree",
  "easter-garden": "Easter garden spring bloom digital card animation that plants a tree",
  "easter-joy": "Easter joy digital card animation that plants a tree",
  "easter-sunrise": "Easter sunrise digital card animation that plants a tree",
  "easter-wishes": "Easter wishes digital card animation that plants a tree",
};

function getEasterCardAlt(card: CardItem): string {
  return EASTER_CARD_ALTS[card.key] ?? `${card.title} digital Easter card animation that plants a tree`;
}

// Cache-bust poster URLs for seasonal cards so edge/browser don't serve stale cached images
const POSTER_CACHE_VERSION = "easter";
function posterUrl(poster: string | undefined, bustCache = false): string {
  if (!poster) return "";
  return bustCache ? `${poster}?v=${POSTER_CACHE_VERSION}` : poster;
}

const ExitIntentModal = dynamic(() => import("../components/ExitIntentModal"), { ssr: false });

type LazyVideoProps = {
  src: string;
  webmSrc?: string;
  poster?: string;
  className?: string;
  autoPlay?: boolean;
  tapToPlay?: boolean;
  disablePointerEvents?: boolean;
  loop?: boolean;
  muted?: boolean;
  playsInline?: boolean;
  /** When true, load video source immediately so poster doesn't show first (no hover-to-reveal). */
  eagerLoad?: boolean;
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


function LazyVideo({
  src,
  webmSrc,
  poster,
  className,
  autoPlay,
  tapToPlay,
  disablePointerEvents,
  loop,
  muted,
  playsInline,
  eagerLoad,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
  onTouchStart,
}: LazyVideoProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const isHoveredRef = useRef(false);
  const [shouldLoad, setShouldLoad] = useState(!!eagerLoad);
  const [isLoaded, setIsLoaded] = useState(false);
  const [shouldPlayOnLoad, setShouldPlayOnLoad] = useState(false);
  const [playOnHover, setPlayOnHover] = useState(false);

  useEffect(() => {
    if (eagerLoad || !videoRef.current) return;
    let observer: IntersectionObserver | null = null;
    const fallbackTimer = setTimeout(() => {
      setShouldLoad(true);
    }, 1500);

    if (typeof IntersectionObserver === "undefined") {
      setShouldLoad(true);
      return () => clearTimeout(fallbackTimer);
    }

    observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer?.disconnect();
          clearTimeout(fallbackTimer);
        }
      },
      { rootMargin: "100px", threshold: 0.1 }
    );

    observer.observe(videoRef.current);
    return () => {
      clearTimeout(fallbackTimer);
      observer?.disconnect();
    };
  }, [eagerLoad]);

  const requestLoad = () => {
    if (!shouldLoad) setShouldLoad(true);
  };

  const requestPlay = () => {
    setShouldLoad(true);
    setShouldPlayOnLoad(true);
  };

  useEffect(() => {
    if (!shouldLoad || !shouldPlayOnLoad || !videoRef.current) return;
    videoRef.current.play().catch(() => undefined);
    setShouldPlayOnLoad(false);
  }, [shouldLoad, shouldPlayOnLoad]);

  // When user hovers, we requestLoad() but state updates async — so play() runs before <source> exists. Play once video is ready (and only if still hovered).
  useEffect(() => {
    if (!shouldLoad || !playOnHover || !videoRef.current) return;
    const v = videoRef.current;
    if (v.readyState >= 2) {
      if (isHoveredRef.current) v.play().catch(() => undefined);
      setPlayOnHover(false);
      return;
    }
    const onCanPlay = () => {
      if (isHoveredRef.current) v.play().catch(() => undefined);
      setPlayOnHover(false);
    };
    v.addEventListener("canplay", onCanPlay, { once: true });
    return () => v.removeEventListener("canplay", onCanPlay);
  }, [shouldLoad, playOnHover]);

  return (
    <div className="relative">
      {/* Only show loading overlay when no poster — otherwise it would cover the poster and show blank until video loads */}
      {shouldLoad && !isLoaded && !poster && (
        <div
          className="absolute inset-0 rounded-2xl bg-slate-200/70 animate-pulse"
          aria-hidden
        />
      )}
      <video
        ref={videoRef}
        className={`${className ?? ""} ${disablePointerEvents ? "pointer-events-none" : ""}`}
        poster={poster}
        autoPlay={shouldLoad && autoPlay}
        loop={loop}
        muted={muted}
        playsInline={playsInline}
        preload={shouldLoad ? "metadata" : "none"}
        onLoadedData={() => {
          setIsLoaded(true);
          if (shouldPlayOnLoad) {
            videoRef.current?.play().catch(() => undefined);
            setShouldPlayOnLoad(false);
          }
        }}
        onError={() => setIsLoaded(true)}
        onMouseEnter={(event) => {
          setShouldLoad(true);
          setShouldPlayOnLoad(true);
          setPlayOnHover(true);
          onMouseEnter?.(event);
        }}
        onMouseLeave={(event) => {
          setPlayOnHover(false);
          if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
          }
          onMouseLeave?.(event);
        }}
        onFocus={(event) => {
          isHoveredRef.current = true;
          requestLoad();
          setPlayOnHover(true);
          onFocus?.(event);
        }}
        onBlur={(event) => {
          isHoveredRef.current = false;
          setPlayOnHover(false);
          onBlur?.(event);
        }}
        onTouchStart={(event) => {
          requestLoad();
          if (tapToPlay) requestPlay();
          onTouchStart?.(event);
        }}
        onClick={(event) => {
          if (tapToPlay) requestPlay();
        }}
      >
        {shouldLoad && webmSrc && <source src={webmSrc} type="video/webm" />}
        {shouldLoad && <source src={src} type="video/mp4" />}
      </video>
    </div>
  );
}

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error("Homepage render error:", error);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <main className="min-h-screen bg-[#FAFAF9] text-[#1A1A1A] px-4 sm:px-6 pb-16 md:pb-20">
        <section className="max-w-7xl mx-auto py-16">
          <h1 className="text-[32px] font-semibold mb-4">Cards are loading…</h1>
          <p className="text-[16px] text-[#1A1A1A]/70 mb-6">
            If this doesn’t resolve, please refresh the page.
          </p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {CARDS.map((card) => (
              <div
                key={`fallback-error-${card.key}`}
                className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm"
              >
                {card.poster && (
                  <img
                    src={posterUrl(card.poster, card.priority || card.key.startsWith("easter"))}
                    alt={card.key.startsWith("easter") ? getEasterCardAlt(card) : card.title}
                    className="w-full h-40 object-cover"
                    loading="lazy"
                  />
                )}
                <div className="px-3 py-3 text-sm font-medium text-[#1A1A1A] truncate">
                  {card.title}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    );
  }
}

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const update = () => setIsMobile(media.matches);
    update();

    if (media.addEventListener) {
      media.addEventListener("change", update);
      return () => media.removeEventListener("change", update);
    }

    media.addListener(update);
    return () => media.removeListener(update);
  }, [breakpoint]);

  return isMobile;
}

type MobilePreviewModalProps = {
  card: CardItem;
  onClose: () => void;
  onCheckout: (cardKey: string) => void;
};

function MobilePreviewModal({ card, onClose, onCheckout }: MobilePreviewModalProps) {
  const [videoFailed, setVideoFailed] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.setAttribute("webkit-playsinline", "true");
    video.setAttribute("x5-playsinline", "true");
  }, []);

  return (
    <div className="fixed inset-0 z-[60] bg-black/80 flex flex-col px-5 py-6">
      <div className="flex items-center justify-between text-white mb-4">
        <h2 className="text-lg font-semibold">{card.title}</h2>
        <button
          type="button"
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-white/10 text-white text-lg"
          aria-label="Close preview"
        >
          ✕
        </button>
      </div>
      <div className="flex-1 flex flex-col justify-center">
        <div className="relative rounded-2xl overflow-hidden bg-black/30">
          {videoFailed ? (
            <img
              src={posterUrl(card.poster, card.priority || card.key.startsWith("easter"))}
              alt={card.key.startsWith("easter") ? getEasterCardAlt(card) : card.title}
              className="w-full h-[60vh] object-cover"
              loading="lazy"
            />
          ) : (
            <video
              ref={videoRef}
              className="w-full h-[60vh] object-cover"
              src={card.src}
              poster={posterUrl(card.poster, card.priority || card.key.startsWith("easter"))}
              playsInline
              muted
              controls
              preload="metadata"
              onError={(e) => {
                console.error("Video error:", e);
                setVideoFailed(true);
              }}
              onLoadedData={() => {
                console.log("Video loaded successfully");
              }}
              style={{ WebkitPlaysinline: true } as React.CSSProperties}
            />
          )}
        </div>
        <button
          type="button"
          onClick={() => onCheckout(card.key)}
          className="mt-6 h-12 w-full rounded-full bg-[#2D6A4F] text-white font-semibold"
        >
          Buy / View Product
        </button>
      </div>
    </div>
  );
}

export default function Home() {
  const [recipient, setRecipient] = useState("");
  const [message, setMessage] = useState("");
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>("Easter");
  const [quickViewCard, setQuickViewCard] = useState<CardItem | null>(null);
  const [showFullPreview, setShowFullPreview] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [showMobileCta, setShowMobileCta] = useState(false);
  const [showSeasonalBanner, setShowSeasonalBanner] = useState(true);
  const [faqQuery, setFaqQuery] = useState("");
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const [cardsReady, setCardsReady] = useState(false);
  const [heroStartIndex, setHeroStartIndex] = useState(0);
  const [mobilePreviewCard, setMobilePreviewCard] = useState<CardItem | null>(null);
  const isMobileDevice = useIsMobile();

  const collectionRef = useRef<HTMLElement | null>(null);
  const formRef = useRef<HTMLDivElement | null>(null);

  const selectedCardItem = CARDS.find((c) => c.key === selectedCard) ?? null;

  const stats = {
    treesPlanted: null as StatValue,
    cardsSent: null as StatValue,
    monthlyTreesPlanted: null as StatValue,
  };

  const testimonials: Testimonial[] = [
    {
      quote: "Sent this to my wife instead of flowers - she loved that it plants a tree! Perfect last-minute gift.",
      name: "Tom B.",
      title: "Verified Customer",
    },
    {
      quote: "Such a meaningful way to send holiday greetings. Love knowing a tree gets planted!",
      name: "Sarah M.",
      title: "Verified Customer",
    },
    {
      quote: "Beautiful animations and guilt-free. No more paper waste.",
      name: "James K.",
      title: "Verified Customer",
    },
    {
      quote: "Sent 20 Christmas cards this year and planted 20 trees. Perfect!",
      name: "Emma L.",
      title: "Verified Customer",
    },
  ];
  const faqItems = [
    {
      question: "How does CardRoots work?",
      answer:
        "Choose a card, personalize your message, and send instantly. Every card funds a real tree planting.",
    },
    {
      question: "Are the trees really planted? How can I verify?",
      answer:
        "We partner with verified planting organizations and can provide confirmation when available.",
    },
    {
      question: "Can I personalize my card with photos or custom designs?",
      answer:
        "Custom designs are not available yet, but we can support bespoke requests for bulk or corporate orders.",
    },
    {
      question: "When will my card be delivered?",
      answer: "Cards are delivered instantly after checkout.",
    },
    {
      question: "Can I schedule delivery for a future date?",
      answer: "Scheduling is not available yet, but we can add it based on demand.",
    },
    {
      question: "What happens after I send a card?",
      answer:
        "We send your digital card instantly and begin the tree planting process with our partners.",
    },
    {
      question: "Do you offer bulk or corporate orders?",
      answer: "Yes. Contact us for managed sending services and volume pricing.",
    },
    {
      question: "What is your refund policy?",
      answer:
        "If there’s a delivery issue, contact support and we’ll make it right.",
    },
  ];

  useEffect(() => {
    if (selectedCard && formRef.current) {
      setTimeout(() => {
        const el = formRef.current;
        if (!el) return;
        const y = el.getBoundingClientRect().top + window.scrollY - 120;
        window.scrollTo({ top: y, behavior: "smooth" });
      }, 120);
    }
  }, [selectedCard]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const dismissed = localStorage.getItem("dismiss-seasonal-banner");
      if (dismissed === "1") setShowSeasonalBanner(false);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setCardsReady(true), 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroStartIndex((prev) => (prev + 1) % heroPreviewCards.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

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
    (cardKey: string, force = false) =>
    (event: React.SyntheticEvent<HTMLVideoElement>) => {
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

  const handleCheckout = async (cardKeyOverride?: string) => {
    const cardKey = cardKeyOverride ?? selectedCard;
    if (!cardKey) {
      alert("Please select a card first.");
      return;
    }
    trackEvent("checkout_start", { cardKey });

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cardKey: cardKey,
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
    Easter: 0,
    Christmas: 1,
    Birthday: 2,
    "Thank You": 3,
    Love: 4,
    General: 5,
  };

  function getCategory(cardKey: string): string {
    const k = cardKey.toLowerCase();
    if (k.includes("easter")) return "Easter";
    if (k.includes("christmas") || k.includes("xmas") || k.includes("santa")) return "Christmas";
    if (k.includes("birthday")) return "Birthday";
    if (k.includes("thank")) return "Thank You";
    if (k.includes("heart") || k.includes("love")) return "Love";
    return "General";
  }

  const sortedCards = React.useMemo(() => {
    return [...CARDS].sort((a, b) => {
      const priorityA = a.priority ? 1 : 0;
      const priorityB = b.priority ? 1 : 0;
      if (priorityB !== priorityA) return priorityB - priorityA;
      const categoryA = getCategory(a.key);
      const categoryB = getCategory(b.key);
      const catA = CATEGORY_ORDER[categoryA] ?? 999;
      const catB = CATEGORY_ORDER[categoryB] ?? 999;
      if (catA !== catB) return catA - catB;
      return a.title.localeCompare(b.title);
    });
  }, []);

  const filters = ["Easter", "Christmas", "Birthday", "Thank You", "All"];

  const filteredCards = React.useMemo(() => {
    if (activeFilter === "All") return sortedCards;
    return sortedCards.filter((card) => getCategory(card.key) === activeFilter);
  }, [activeFilter, sortedCards]);

  const heroCards = heroPreviewCards.map((_, index) => {
    return heroPreviewCards[(heroStartIndex + index) % heroPreviewCards.length];
  });

  const easterCards = sortedCards.filter((card) => getCategory(card.key) === "Easter");
  const christmasCards = sortedCards.filter((card) => getCategory(card.key) === "Christmas");
  const birthdayCards = sortedCards.filter((card) => getCategory(card.key) === "Birthday");
  const thankYouLoveCards = sortedCards.filter((card) => {
    const category = getCategory(card.key);
    return category === "Thank You" || category === "Love" || category === "General";
  });

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.cardroots.com";
  const baseUrl = siteUrl.replace(/\/$/, "");
  
  // Days until Easter (April 20)
  const easterDate = new Date(new Date().getFullYear(), 3, 20);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  easterDate.setHours(0, 0, 0, 0);
  const daysUntilEaster = Math.max(0, Math.ceil((easterDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));

  // Structured data for Product collection
  const productCollectionSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Digital Easter Cards That Plant Trees",
    description: "Collection of animated digital greeting cards that plant real trees. Eco-friendly Easter, Christmas, birthday, and thank you cards.",
    itemListElement: CARDS.map((card, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Product",
        name: card.title,
        description: card.desc,
        image: `${baseUrl}${card.poster ?? card.src}`,
        offers: {
          "@type": "Offer",
          price: "5.00",
          priceCurrency: "GBP",
          availability: "https://schema.org/InStock",
          url: card.priority ? `${baseUrl}/cards/easter/${card.key}` : `${baseUrl}/card/${card.key}`,
        },
        brand: {
          "@type": "Brand",
          name: "CardRoots",
        },
        category: "Digital Greeting Cards",
        additionalProperty: [
          {
            "@type": "PropertyValue",
            name: "Trees Planted",
            value: "1",
          },
          {
            "@type": "PropertyValue",
            name: "Delivery Time",
            value: "Instant",
          },
          {
            "@type": "PropertyValue",
            name: "Sustainability Feature",
            value: "Plants one verified tree per card",
          },
        ],
      },
    })),
  };

  // FAQ schema for AI discovery (homepage FAQPage JSON-LD)
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How do digital Easter cards work?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Choose from our collection of 8 animated Easter cards, personalize your message, add recipient details, and we deliver it instantly via email. Every card plants one verified tree through our reforestation partners. The whole process takes less than 3 minutes.",
        },
      },
      {
        "@type": "Question",
        name: "Are the trees really planted? How can I verify?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, every card plants one real tree. We partner with verified reforestation organizations globally. After sending your card, you receive a digital tree certificate with GPS coordinates, planting date, and project details for full transparency.",
        },
      },
      {
        "@type": "Question",
        name: "Can I send an Easter card on Easter itself?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Absolutely! Our cards are delivered instantly via email, so you can send them right up until midnight on Easter. Perfect for last-minute gifts or when you're separated by distance.",
        },
      },
      {
        "@type": "Question",
        name: "What makes CardRoots cards better than traditional paper cards?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "CardRoots cards offer instant email delivery (no waiting 2-5 days), cost just £5 including tree planting (vs £3-8 plus postage), feature beautiful animations (vs static paper), create environmental benefit (vs landfill waste), and provide verified impact tracking (vs no accountability).",
        },
      },
      {
        "@type": "Question",
        name: "When will my card be delivered?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Instantly! Your personalized animated card is delivered via email within seconds of completing your order. You can schedule future delivery dates or send immediately.",
        },
      },
      {
        "@type": "Question",
        name: "Do you offer bulk or corporate orders?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes! We offer bulk discounts and a managed sending service for corporate Easter campaigns. Email info@cardroots.com for custom quotes on orders of 100+ cards.",
        },
      },
    ],
  };

  return (
    <ErrorBoundary>
      <main className="min-h-screen bg-[#FAFAF9] text-[#1A1A1A] px-4 sm:px-6 pb-16 md:pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productCollectionSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Sticky Easter urgency banner */}
      {showSeasonalBanner && (
        <div className="sticky top-0 z-50 w-full bg-easter-primary text-white text-sm px-4 py-2.5 flex items-center justify-center gap-3 shadow-md">
          <span>
            🐣 Easter is April 20 — Instant email delivery, send anytime before midnight!
          </span>
          <button
            aria-label="Dismiss banner"
            onClick={() => {
              try {
                localStorage.setItem("dismiss-seasonal-banner", "1");
              } catch {
                // ignore
              }
              setShowSeasonalBanner(false);
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 text-white/90 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}

      <header className="sticky top-0 z-30 -mx-4 sm:-mx-6 mb-6 bg-[#FAFAF9]/90 backdrop-blur-xl border-b border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-base font-semibold text-[#1A1A1A]">CardRoots</div>
          <nav className="hidden sm:flex items-center gap-6 text-sm font-medium text-[#1A1A1A]">
            <button
              onClick={() => {
                document.getElementById("how-it-works")?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
                trackEvent("nav_how_it_works");
              }}
              className="hover:text-[#2D6A4F] transition"
            >
              How It Works
            </button>
            <button
              onClick={() => {
                collectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                trackEvent("nav_browse_cards");
              }}
              className="hover:text-[#2D6A4F] transition"
            >
              Browse Cards
            </button>
            <a
              href="/corporate"
              className="hover:text-[#2D6A4F] transition"
              onClick={() => trackEvent("nav_for_business")}
            >
              For Business
            </a>
          </nav>
          <button
            className="sm:hidden inline-flex items-center gap-2 text-sm font-medium text-[#1A1A1A]"
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
            className="sm:hidden px-4 sm:px-6 pb-4 flex flex-col gap-3 text-sm font-medium text-[#1A1A1A]"
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

      {/* Hero - Easter first */}
      <section
        className="relative -mx-4 sm:-mx-6 mb-12 md:mb-20 bg-gradient-to-br from-green-100 via-easter-yellow/30 to-[#FAFAF9] overflow-hidden"
        itemScope
        itemType="https://schema.org/SoftwareApplication"
      >
        {/* Soft heart animation overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-30" aria-hidden>
          <div className="absolute top-20 left-[10%] w-16 h-16 rounded-full bg-easter-primary/40 blur-2xl animate-pulse" />
          <div className="absolute top-40 right-[15%] w-20 h-20 rounded-full bg-easter-lavender/40 blur-2xl animate-pulse" style={{ animationDelay: "1s" }} />
          <div className="absolute bottom-32 left-[20%] w-14 h-14 rounded-full bg-easter-yellow/50 blur-2xl animate-pulse" style={{ animationDelay: "0.5s" }} />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-20 min-h-[60vh] md:min-h-[70vh] lg:min-h-[80vh] flex flex-col justify-center">
          <div className="max-w-3xl space-y-5">
            <p className="text-sm font-semibold tracking-wide text-easter-primary uppercase">
              Eco-friendly digital greetings
            </p>
            <h1
              className="text-[36px] md:text-[48px] lg:text-[56px] font-bold text-[#1A1A1A]"
              itemProp="name"
            >
              Send Digital Easter Cards That Plant Trees
            </h1>
            <p
              className="text-[16px] md:text-[18px] leading-[1.6] text-[#1A1A1A]/80"
              itemProp="description"
            >
              Easter is {daysUntilEaster} days away — Send a living card that grows instead of dies
            </p>
            <div className="sr-only">
              <p>
                CardRoots sends digital Easter cards that plant real trees. Eco-friendly digital
                greeting cards for Easter, Christmas, birthdays, and special occasions.
                Instant delivery with real environmental impact.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center sm:items-stretch gap-4">
              <button
                onClick={() => {
                  document.getElementById("easter-collection")?.scrollIntoView({ behavior: "smooth", block: "start" });
                  trackEvent("cta_browse_hero");
                }}
                className="h-[60px] px-10 rounded-full bg-easter-primary hover:bg-easter-primary-hover text-white font-semibold shadow-lg transition"
              >
                Browse Easter Cards →
              </button>
              <a
                href="/corporate"
                className="h-[60px] px-8 rounded-full border border-slate-300 text-[#1A1A1A] font-semibold flex items-center justify-center hover:bg-slate-100 transition"
                onClick={() => trackEvent("cta_business_hero")}
              >
                For Business
              </a>
            </div>
            <p className="text-sm text-easter-primary font-medium">
              Join thousands planting trees, one card at a time 🌱
            </p>
          </div>

          <div className="mt-10">
            <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 scroll-touch md:grid md:grid-cols-3 md:overflow-visible md:max-w-3xl">
              {heroCards.map((card, index) => {
                const heroPoster = `/cards/posters/easter${index + 1}.jpg`;
                const heroSrc = `/cards/posters/easter${index + 1}.mp4`;
                return (
                  <div
                    key={`easter-hero-${index}-${heroStartIndex}`}
                    className="flex-shrink-0 snap-start w-[min(85vw,280px)] md:w-full rounded-2xl overflow-hidden border border-easter-primary/40 bg-white shadow-md animate-fade-in"
                  >
                    {isMobileDevice ? (
                      <img
                        src={posterUrl(heroPoster, true)}
                        alt={`Easter digital card ${index + 1} that plants a tree`}
                        className="w-full h-32 md:h-40 object-cover"
                        loading="eager"
                        fetchPriority="high"
                      />
                    ) : (
                      <LazyVideo
                        className="w-full h-32 md:h-40 object-cover"
                        src={heroSrc}
                        poster={posterUrl(heroPoster, true)}
                        autoPlay
                        loop
                        muted
                        playsInline
                        eagerLoad
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* New Easter Collection - above fold */}
      <section id="easter-collection" className="max-w-7xl mx-auto mb-12 md:mb-20" aria-labelledby="new-easter-collection-heading">
        <div className="flex items-center gap-3 mb-6">
          <h2 id="new-easter-collection-heading" className="text-[28px] md:text-[36px] font-semibold text-[#1A1A1A]">
            🐣 New Easter Collection
          </h2>
          <span className="text-xs uppercase tracking-wide font-semibold bg-amber-200/80 text-amber-900 px-3 py-1.5 rounded-full">
            Limited Time
          </span>
        </div>
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-4 scroll-touch sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:overflow-visible">
          {easterCards.map((card, index) => (
            <article
              key={card.key}
              className="flex-shrink-0 snap-start w-[min(85vw,320px)] sm:w-full group relative min-h-[380px] rounded-3xl bg-white border border-slate-200 p-4 shadow-sm transition-all duration-200 transform hover:scale-[1.02] hover:shadow-[0_8px_30px_rgba(123,198,126,0.2)] focus-within:ring-2 focus-within:ring-easter-primary focus-within:ring-offset-2 focus-within:outline-none"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[11px] uppercase tracking-wide font-semibold bg-easter-primary/20 text-easter-primary px-2 py-1 rounded-full">
                  {card.label}
                </span>
              </div>
              <div className="relative rounded-2xl overflow-hidden mb-3 bg-slate-100">
                {isMobileDevice ? (
                  <img
                    src={posterUrl(card.poster, card.priority || card.key.startsWith("easter"))}
                    alt={getEasterCardAlt(card)}
                    className="w-full h-44 object-cover cursor-pointer"
                    loading={index < 5 ? "eager" : "lazy"}
                    fetchPriority={index < 5 ? "high" : undefined}
                    onClick={() => setMobilePreviewCard(card)}
                  />
                ) : (
                  <LazyVideo
                    className="w-full h-44 object-cover"
                    src={card.src}
                    poster={posterUrl(card.poster, card.priority || card.key.startsWith("easter"))}
                    tapToPlay={false}
                    loop
                    muted
                    playsInline
                    eagerLoad={index < 5}
                    onMouseEnter={handlePreviewPlay(card.key)}
                    onMouseLeave={handlePreviewPause}
                  />
                )}
              </div>
              <h3 className="text-lg font-semibold text-[#1A1A1A] mb-1">{card.title}</h3>
              <p className="text-sm text-[#1A1A1A]/70 mb-3 line-clamp-2">{card.desc}</p>
              <div className="mb-3">
                <span className="text-xl font-semibold text-[#2D6A4F]">£5</span>
                <span className="text-xs text-[#1A1A1A]/60 ml-1">per card</span>
              </div>
              <a
                href={`/cards/easter/${card.key}`}
                onClick={(e) => {
                  e.preventDefault();
                  if (isMobileDevice) {
                    setMobilePreviewCard(card);
                  } else {
                    setSelectedCard(card.key);
                    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }
                  trackEvent("easter_send_this_card", { cardKey: card.key });
                }}
                className="block w-full min-h-[44px] h-11 rounded-full bg-easter-primary hover:bg-easter-primary-hover text-white font-semibold text-center leading-[2.75rem] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-easter-primary focus:ring-offset-2"
              >
                Send This Card
              </a>
            </article>
          ))}
        </div>
      </section>

      {/* Why Choose CardRoots? */}
      <section className="max-w-7xl mx-auto mb-12 md:mb-20" aria-labelledby="why-cardroots">
        <div className="text-center mb-8">
          <h2 id="why-cardroots" className="text-[28px] md:text-[42px] font-semibold text-[#1A1A1A] mb-3">
            Why Choose CardRoots?
          </h2>
          <p className="text-[16px] md:text-[18px] text-[#1A1A1A]/70">
            The eco-friendly alternative to traditional greeting cards
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[
            { label: "100% Verified Tree Planting", desc: "Not carbon offsets - real trees planted through verified partners" },
            { label: "Instant Email Delivery", desc: "No shipping required - perfect for last-minute gifts" },
            { label: "Beautiful Animated Cards", desc: "Not static images - engaging animations that bring your message to life" },
            { label: "Track Your Impact", desc: "See where your tree is planted and measure your environmental contribution" },
            { label: "Support Global Reforestation", desc: "Help restore forests and support sustainable projects worldwide" },
            { label: "Perfect for Long-Distance", desc: "Send instantly to anyone, anywhere - no postal delays" },
          ].map((item) => (
            <div
              key={item.label}
              className="flex flex-col gap-2 bg-white border border-slate-200 rounded-2xl px-4 py-4 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#E7F3EC] text-[#2D6A4F] flex items-center justify-center font-semibold flex-shrink-0">
                  ✓
                </div>
                <p className="text-[16px] font-semibold text-[#1A1A1A]">{item.label}</p>
              </div>
              <p className="text-sm text-[#1A1A1A]/70 ml-[52px]">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Natural Language Q&A Section for AI Discovery */}
      <section className="max-w-7xl mx-auto mb-12 md:mb-20" aria-labelledby="faq-heading">
        <div className="text-center mb-8">
          <h2 id="faq-heading" className="text-[28px] md:text-[42px] font-semibold text-[#1A1A1A] mb-3">
            Frequently Asked Questions
          </h2>
          <p className="text-[16px] md:text-[18px] text-[#1A1A1A]/70">
            Everything you need to know about digital Easter cards
          </p>
        </div>
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-[#1A1A1A] mb-2">What are digital Easter cards?</h3>
            <p className="text-[16px] text-[#1A1A1A]/70 leading-[1.6]">
              Digital Easter cards are animated greeting cards delivered instantly via email. Unlike traditional paper cards, they're eco-friendly and plant real trees. CardRoots digital cards feature beautiful animations, personalized messages, and verified tree planting through our reforestation partners.
            </p>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-[#1A1A1A] mb-2">How quickly are digital Easter cards delivered?</h3>
            <p className="text-[16px] text-[#1A1A1A]/70 leading-[1.6]">
              CardRoots digital Easter cards are delivered instantly via email - perfect for last-minute gifts or when you're separated by distance. You can send cards right up until midnight on Easter with no shipping delays or cutoff dates.
            </p>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-[#1A1A1A] mb-2">What makes CardRoots cards eco-friendly?</h3>
            <p className="text-[16px] text-[#1A1A1A]/70 leading-[1.6]">
              Every CardRoots card plants one verified tree through our reforestation partners. You can track your tree's planting location and environmental impact. Unlike paper cards that end up in landfill, our digital cards create zero waste while actively restoring forests worldwide.
            </p>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-[#1A1A1A] mb-2">Can I send an Easter card on Easter itself?</h3>
            <p className="text-[16px] text-[#1A1A1A]/70 leading-[1.6]">
              Yes! Our instant email delivery means you can send cards right up until midnight on Easter. No shipping delays or cutoff dates. Perfect for last-minute Easter shoppers or when you realize you forgot to send a card.
            </p>
          </div>
        </div>
      </section>

      {/* Comparison: Digital vs Traditional Cards */}
      <section className="max-w-7xl mx-auto mb-12 md:mb-20" aria-labelledby="comparison-heading">
        <div className="text-center mb-8">
          <h2 id="comparison-heading" className="text-[28px] md:text-[42px] font-semibold text-[#1A1A1A] mb-3">
            Digital Easter Cards vs Traditional Cards
          </h2>
          <p className="text-[16px] md:text-[18px] text-[#1A1A1A]/70">
            See why digital cards are better for you and the planet
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-[#1A1A1A] mb-4">Traditional Paper Cards</h3>
            <ul className="space-y-2 text-[16px] text-[#1A1A1A]/70">
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">✗</span>
                <span>Require 2-5 days shipping</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">✗</span>
                <span>Cost £3-8 + £1.50 postage</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">✗</span>
                <span>End up in landfill</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">✗</span>
                <span>Limited personalization</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-1">✗</span>
                <span>No environmental benefit</span>
              </li>
            </ul>
          </div>
          <div className="bg-white border-2 border-[#2D6A4F] rounded-2xl p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-[#1A1A1A] mb-4">CardRoots Digital Cards</h3>
            <ul className="space-y-2 text-[16px] text-[#1A1A1A]/70">
              <li className="flex items-start gap-2">
                <span className="text-[#2D6A4F] mt-1">✓</span>
                <span>Instant email delivery</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#2D6A4F] mt-1">✓</span>
                <span>£5 including tree planting</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#2D6A4F] mt-1">✓</span>
                <span>Zero waste, plants a tree</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#2D6A4F] mt-1">✓</span>
                <span>Fully customizable messages</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#2D6A4F] mt-1">✓</span>
                <span>Animated and interactive</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="max-w-7xl mx-auto mb-12 md:mb-20" aria-labelledby="use-cases-heading">
        <div className="text-center mb-8">
          <h2 id="use-cases-heading" className="text-[28px] md:text-[42px] font-semibold text-[#1A1A1A] mb-3">
            Perfect For
          </h2>
          <p className="text-[16px] md:text-[18px] text-[#1A1A1A]/70">
            Who benefits most from digital Easter cards?
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { title: "Long-Distance Couples", desc: "Send instantly to anyone, anywhere - no postal delays" },
            { title: "Last-Minute Shoppers", desc: "Perfect when you realize Easter is tomorrow" },
            { title: "Eco-Conscious Gift Givers", desc: "Show you care about the environment with every card" },
            { title: "Zero-Waste Advocates", desc: "No paper waste - just beautiful digital cards and real trees" },
            { title: "Corporate Campaigns", desc: "Send multiple cards efficiently while supporting reforestation" },
            { title: "Multiple Recipients", desc: "Send to parents, friends, colleagues - all instantly" },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm"
            >
              <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2">{item.title}</h3>
              <p className="text-sm text-[#1A1A1A]/70">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="max-w-7xl mx-auto mb-12 md:mb-20" aria-labelledby="how-it-works-heading">
        <div className="text-center mb-10">
          <h2 id="how-it-works-heading" className="text-[28px] md:text-[42px] font-semibold text-[#1A1A1A]">
            How It Works
          </h2>
          <p className="text-[16px] md:text-[18px] text-[#1A1A1A]/70 mt-2">
            Three simple steps to send a card and plant a tree.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "Choose Your Card",
              description: "Browse our collection of animated cards.",
              icon: "💌",
            },
            {
              title: "Personalize Your Message",
              description: "Add your heartfelt message and recipient details.",
              icon: "✍️",
            },
            {
              title: "Tree Gets Planted",
              description: "We plant a real tree and send your card instantly.",
              icon: "🌱",
            },
          ].map((step) => (
            <div
              key={step.title}
              className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm"
            >
              <div className="w-12 h-12 rounded-full bg-[#E7F3EC] text-[#2D6A4F] flex items-center justify-center mb-4 text-xl">
                <span aria-hidden>{step.icon}</span>
              </div>
              <h3 className="text-[24px] font-semibold text-[#1A1A1A] mb-2">
                {step.title}
              </h3>
              <p className="text-[16px] text-[#1A1A1A]/70 leading-[1.6]">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto mb-12 md:mb-20">
        <div className="text-center mb-10">
          <h2 className="text-[28px] md:text-[42px] font-semibold text-[#1A1A1A]">
            Trusted by thoughtful senders
          </h2>
          <p className="text-[16px] md:text-[18px] text-[#1A1A1A]/70 mt-2">
            Real people choosing eco-friendly greetings.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm"
            >
              <div className="flex items-center gap-2 text-[#D4AF37] mb-4">
                {"★★★★★".split("").map((star, index) => (
                  <span key={`${testimonial.name}-${index}`}>{star}</span>
                ))}
              </div>
              <p className="text-[16px] text-[#1A1A1A]/80 leading-[1.6]">
                “{testimonial.quote}”
              </p>
              <div className="mt-5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#E7F3EC] text-[#2D6A4F] font-semibold flex items-center justify-center">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#1A1A1A]">{testimonial.name}</p>
                  <p className="text-xs text-[#1A1A1A]/60">{testimonial.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Collection */}
      <section id="collection" ref={collectionRef} className="max-w-7xl mx-auto mb-12 md:mb-20">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-8">
          <div>
            <h2 className="text-[28px] md:text-[42px] font-semibold text-[#1A1A1A]">
              Browse the collection
            </h2>
            <p className="text-[16px] text-[#1A1A1A]/70 leading-[1.6]">
              Pick an animated card and personalize it in minutes.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => {
                  setActiveFilter(filter);
                  trackEvent("filter_select", { filter });
                }}
                className={`px-4 py-2 rounded-full text-sm font-semibold border transition ${
                  activeFilter === filter
                    ? "bg-[#2D6A4F] text-white border-[#2D6A4F]"
                    : "bg-white text-[#2D6A4F] border-[#2D6A4F] hover:bg-[#E7F3EC]"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {!cardsReady ? (
          <div>
            <p className="text-sm text-[#1A1A1A]/60 mb-4">Loading your cards...</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={`skeleton-${index}`}
                  className="w-full lg:min-w-[400px] rounded-3xl border border-slate-200 bg-white p-5 shadow-sm animate-pulse"
                >
                  <div className="h-56 rounded-2xl bg-slate-200 mb-4" />
                  <div className="h-5 w-2/3 bg-slate-200 mb-3" />
                  <div className="h-4 w-full bg-slate-200 mb-2" />
                  <div className="h-10 w-full bg-slate-200 mt-4" />
                </div>
              ))}
            </div>
          </div>
        ) : activeFilter === "All" ? (
          <div className="space-y-12">
            {[
              { title: "Easter Cards", cards: easterCards },
              { title: "Christmas Cards", cards: christmasCards },
              { title: "Birthday & Celebration Cards", cards: birthdayCards },
              { title: "Thank You & Love Cards", cards: thankYouLoveCards },
            ].map((section, sectionIndex) => (
              <div key={section.title}>
                <div className="flex items-center gap-4 mb-6">
                  <h3 className="text-[24px] font-semibold text-[#1A1A1A]">
                    {section.title}
                  </h3>
                  <div className="flex-1 h-px bg-slate-200" />
                </div>
                <div className="relative z-10 flex overflow-x-auto snap-x snap-mandatory gap-x-6 gap-y-10 pb-4 scroll-touch md:grid md:grid-cols-2 lg:grid-cols-3 md:overflow-visible">
                  {section.cards.map((card, index) => (
                    <article
                      key={card.key}
                      className="flex-shrink-0 snap-start w-[min(85vw,340px)] md:w-full group relative min-h-[420px] rounded-3xl bg-white border border-slate-200 p-5 shadow-sm transition-all duration-200 transform hover:scale-[1.02] hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] focus-within:ring-2 focus-within:ring-slate-300 focus-within:ring-offset-2 focus-within:outline-none animate-fade-in"
                      style={{ animationDelay: `${(sectionIndex * 6 + index) * 50}ms` }}
                      onClick={(event) => {
                        if (!isMobileDevice) return;
                        const target = event.target as HTMLElement;
                        if (target.closest("button")) return;
                        setMobilePreviewCard(card);
                      }}
                    >
                      {!isMobileDevice && (
                        <button
                          data-quick-view
                          onClick={(event) => {
                            event.stopPropagation();
                            setQuickViewCard(card);
                            setShowFullPreview(false);
                            trackEvent("quick_view_open", { cardKey: card.key });
                          }}
                          className="absolute top-4 right-4 min-w-[44px] min-h-[44px] w-11 h-11 rounded-full bg-white/90 border border-slate-200 flex items-center justify-center text-[#2D6A4F] hover:bg-[#E7F3EC] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] focus:ring-offset-2"
                          aria-label="Quick view"
                        >
                          👁
                        </button>
                      )}
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        {card.label && (
                          <span className="text-[11px] uppercase tracking-wide text-[#D4AF37] font-semibold bg-[#F5EED6] px-2 py-1 rounded-full">
                            {card.label}
                          </span>
                        )}
                        {card.badges?.map((badge) => (
                          <span
                            key={badge}
                            className="text-[11px] uppercase tracking-wide text-[#2D6A4F] font-semibold bg-[#E7F3EC] px-2 py-1 rounded-full"
                          >
                            {badge}
                          </span>
                        ))}
                      </div>
                      <div className="text-xs text-[#1A1A1A]/60 font-medium mb-3">
                        Limited Edition - Only {card.available} cards available
                      </div>
                      <div className="rounded-2xl overflow-hidden mb-4 bg-slate-100">
                        {isMobileDevice ? (
                          <img
                            src={posterUrl(card.poster, card.priority || card.key.startsWith("easter"))}
                            alt={getCategory(card.key) === "Easter" ? getEasterCardAlt(card) : card.title}
                            className="w-full h-60 md:h-64 object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <LazyVideo
                            className="w-full h-60 md:h-64 object-cover"
                            src={card.src}
                            webmSrc={card.webmSrc}
                            poster={posterUrl(card.poster, card.priority || card.key.startsWith("easter"))}
                            tapToPlay={false}
                            loop
                            muted
                            playsInline
                            eagerLoad={section.title === "Easter Cards" ? index < 5 : false}
                            onMouseEnter={handlePreviewPlay(card.key)}
                            onMouseLeave={handlePreviewPause}
                            onFocus={handlePreviewPlay(card.key)}
                            onBlur={handlePreviewPause}
                          />
                        )}
                      </div>
                      <h4 className="text-[24px] font-semibold text-[#1A1A1A] mb-2">
                        {card.title}
                      </h4>
                      <p className="text-[16px] text-[#1A1A1A]/70 mb-4 leading-[1.6] truncate whitespace-nowrap">
                        {card.desc}
                      </p>
                      <div className="mb-4">
                        <div className="text-[24px] font-semibold text-[#2D6A4F]">£5</div>
                        <div className="text-sm text-[#1A1A1A]/70">
                          Includes 1 tree planted 🌱
                        </div>
                      </div>
                      <button
                        onClick={(event) => {
                          event.stopPropagation();
                          setSelectedCard(card.key);
                          formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                          trackEvent("personalize_start", { cardKey: card.key });
                        }}
                        className="w-full min-h-[44px] h-12 rounded-full bg-[#2D6A4F] text-white font-semibold hover:bg-[#52B788] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] focus:ring-offset-2"
                      >
                        Select This Card
                      </button>
                    </article>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="relative z-10 flex overflow-x-auto snap-x snap-mandatory gap-x-6 gap-y-10 pb-4 scroll-touch md:grid md:grid-cols-2 lg:grid-cols-3 md:overflow-visible">
            {filteredCards.map((card, index) => (
              <article
                key={card.key}
                className="flex-shrink-0 snap-start w-[min(85vw,340px)] md:w-full group relative min-h-[420px] rounded-3xl bg-white border border-slate-200 p-5 shadow-sm transition-all duration-200 transform hover:scale-[1.02] hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] focus-within:ring-2 focus-within:ring-slate-300 focus-within:ring-offset-2 focus-within:outline-none animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
                onClick={(event) => {
                  if (!isMobileDevice) return;
                  const target = event.target as HTMLElement;
                  if (target.closest("button")) return;
                  setMobilePreviewCard(card);
                }}
              >
                {!isMobileDevice && (
                  <button
                    data-quick-view
                    onClick={(event) => {
                      event.stopPropagation();
                      setQuickViewCard(card);
                      setShowFullPreview(false);
                      trackEvent("quick_view_open", { cardKey: card.key });
                    }}
                    className="absolute top-4 right-4 min-w-[44px] min-h-[44px] w-11 h-11 rounded-full bg-white/90 border border-slate-200 flex items-center justify-center text-[#2D6A4F] hover:bg-[#E7F3EC] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] focus:ring-offset-2"
                    aria-label="Quick view"
                  >
                    👁
                  </button>
                )}
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  {card.label && (
                    <span className="text-[11px] uppercase tracking-wide text-[#D4AF37] font-semibold bg-[#F5EED6] px-2 py-1 rounded-full">
                      {card.label}
                    </span>
                  )}
                  {card.badges?.map((badge) => (
                    <span
                      key={badge}
                      className="text-[11px] uppercase tracking-wide text-[#2D6A4F] font-semibold bg-[#E7F3EC] px-2 py-1 rounded-full"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
                <div className="text-xs text-[#1A1A1A]/60 font-medium mb-3">
                  Limited Edition - Only {card.available} cards available
                </div>
                <div className="rounded-2xl overflow-hidden mb-4 bg-slate-100">
                  {isMobileDevice ? (
                    <img
                      src={posterUrl(card.poster, card.priority || card.key.startsWith("easter"))}
                      alt={getCategory(card.key) === "Easter" ? getEasterCardAlt(card) : card.title}
                      className="w-full h-60 md:h-64 object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <LazyVideo
                      className="w-full h-60 md:h-64 object-cover"
                      src={card.src}
                      webmSrc={card.webmSrc}
                      poster={posterUrl(card.poster, card.priority || card.key.startsWith("easter"))}
                      tapToPlay={false}
                      loop
                      muted
                      playsInline
                      eagerLoad={activeFilter === "Easter" ? index < 5 : false}
                      onMouseEnter={handlePreviewPlay(card.key)}
                      onMouseLeave={handlePreviewPause}
                      onFocus={handlePreviewPlay(card.key)}
                      onBlur={handlePreviewPause}
                    />
                  )}
                </div>
                <h4 className="text-[24px] font-semibold text-[#1A1A1A] mb-2">
                  {card.title}
                </h4>
                <p className="text-[16px] text-[#1A1A1A]/70 mb-4 leading-[1.6] truncate whitespace-nowrap">
                  {card.desc}
                </p>
                <div className="mb-4">
                  <div className="text-[24px] font-semibold text-[#2D6A4F]">£5</div>
                  <div className="text-sm text-[#1A1A1A]/70">
                    Includes 1 tree planted 🌱
                  </div>
                </div>
                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    setSelectedCard(card.key);
                    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                    trackEvent("personalize_start", { cardKey: card.key });
                  }}
                  className="w-full min-h-[44px] h-12 rounded-full bg-[#2D6A4F] text-white font-semibold hover:bg-[#52B788] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] focus:ring-offset-2"
                >
                  Select This Card
                </button>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Personalization Form (hidden until a card is selected) */}
      <div className="max-w-3xl mx-auto mb-12 md:mb-20" ref={formRef}>
        {selectedCardItem && (
          <section className="bg-white rounded-3xl shadow-lg border border-slate-200 p-8">
            <h2 className="text-[28px] font-semibold text-[#1A1A1A] mb-2">
              Personalize Your Card — {selectedCardItem.title}
            </h2>
            <p className="text-[16px] text-[#1A1A1A]/70 mb-6">
              Add a personal touch before checkout.
            </p>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[#1A1A1A] font-medium">Recipient name</label>
                <input
                  className="w-full px-4 py-3 border border-slate-300 text-[#1A1A1A] placeholder-slate-400 rounded-xl focus:ring-2 focus:ring-[#2D6A4F]/40 bg-white"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="e.g., Maya"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[#1A1A1A] font-medium">Message</label>
                <textarea
                  className="w-full px-4 py-3 border border-slate-300 text-[#1A1A1A] placeholder-slate-400 rounded-xl focus:ring-2 focus:ring-[#2D6A4F]/40 bg-white resize-none h-32"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write a heartfelt message..."
                  maxLength={240}
                />
                <p className="text-xs text-right text-[#1A1A1A]/60">{message.length}/240</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleCheckout()}
                    className="h-12 px-6 rounded-full bg-[#2D6A4F] text-white font-semibold shadow-md hover:bg-[#52B788] transition"
                  >
                    Continue to Payment
                  </button>
                  <button
                    onClick={() => setSelectedCard(null)}
                    className="h-12 px-4 rounded-full border border-slate-200 text-[#1A1A1A] hover:bg-slate-100 transition"
                  >
                    Back to Collection
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>

        {mobilePreviewCard && isMobileDevice && (
          <MobilePreviewModal
            card={mobilePreviewCard}
            onClose={() => setMobilePreviewCard(null)}
            onCheckout={(cardKey) => handleCheckout(cardKey)}
          />
        )}

      <section className="max-w-7xl mx-auto mb-12 md:mb-20">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm text-center">
          <h2 className="text-[28px] md:text-[42px] font-semibold text-[#1A1A1A]">
            Simple, Transparent Pricing
          </h2>
          <p className="text-[18px] text-[#2D6A4F] font-semibold mt-3">
            £5 per card | Bulk discounts available
          </p>
          <p className="text-[16px] text-[#1A1A1A]/70 mt-2">
            Every card includes one tree planted and instant delivery.
          </p>
          <div className="mt-4 p-4 rounded-2xl bg-easter-yellow/30 border border-easter-primary/40">
            <p className="text-[16px] font-semibold text-[#2D5A2F]">
              Easter Special: Buy 3 cards, get 1 free
            </p>
            <p className="text-sm text-[#2D5A2F]/90 mt-1">
              Use code <code className="bg-easter-primary/30 px-2 py-0.5 rounded font-mono font-semibold">EASTER2025</code> at checkout
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Block */}
      <section className="max-w-5xl mx-auto mb-12 md:mb-20">
        <h2 className="text-[28px] md:text-[42px] font-semibold text-[#1A1A1A] mb-6">
          Frequently Asked Questions
        </h2>
        <div className="mb-4">
          <input
            type="text"
            value={faqQuery}
            onChange={(event) => setFaqQuery(event.target.value)}
            placeholder="Search FAQs"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-[#1A1A1A] bg-white"
            aria-label="Search FAQs"
          />
        </div>
        <div className="space-y-3">
          {filteredFaqs.map((item) => {
            const isOpen = openFaq === item.question;
            return (
              <div key={item.question} className="border border-slate-200 rounded-2xl bg-white">
                <button
                  className="w-full text-left px-5 py-4 flex items-center justify-between text-[#1A1A1A] font-medium"
                  onClick={() => setOpenFaq(isOpen ? null : item.question)}
                  aria-expanded={isOpen}
                >
                  <span>{item.question}</span>
                  <span className="text-lg">{isOpen ? "−" : "+"}</span>
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 text-[16px] text-[#1A1A1A]/70">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
          {filteredFaqs.length === 0 && (
            <div className="text-sm text-[#1A1A1A]/60">No results found. Try a different search.</div>
          )}
        </div>
      </section>

      {showMobileCta && (
        <div className="fixed bottom-4 left-4 right-4 z-40 sm:hidden">
          <button
            onClick={() => {
              collectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
              trackEvent("mobile_cta_view_all");
            }}
            className="w-full bg-easter-primary text-white py-3 rounded-2xl shadow-lg"
          >
            Browse Easter Cards | £5 each 🌱
          </button>
        </div>
      )}

      {quickViewCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-10 bg-slate-900/70 backdrop-blur-sm">
          <div className="relative w-full max-w-4xl rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <div>
                <h3 className="text-xl font-semibold text-[#1A1A1A]">{quickViewCard.title}</h3>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  {quickViewCard.label && (
                    <span className="text-[11px] uppercase tracking-wide text-[#D4AF37] font-semibold bg-[#F5EED6] px-2 py-1 rounded-full">
                      {quickViewCard.label}
                    </span>
                  )}
                  {quickViewCard.badges?.map((badge) => (
                    <span
                      key={badge}
                      className="text-[11px] uppercase tracking-wide text-[#2D6A4F] font-semibold bg-[#E7F3EC] px-2 py-1 rounded-full"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
                <p className="text-sm text-[#1A1A1A]/70 mt-2">
                  Limited Edition - Only {quickViewCard.available} cards available
                </p>
              </div>
              <button
                onClick={() => {
                  setQuickViewCard(null);
                  setShowFullPreview(false);
                }}
                className="text-[#1A1A1A]/60 hover:text-[#1A1A1A] transition"
                aria-label="Close quick view"
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-[16px] text-[#1A1A1A]/70">{quickViewCard.desc}</p>
              <div className="rounded-2xl overflow-hidden bg-slate-100">
                {isMobileDevice ? (
                  <img
                    src={posterUrl(quickViewCard.poster, quickViewCard.priority || quickViewCard.key.startsWith("easter"))}
                    alt={quickViewCard.key.startsWith("easter") ? getEasterCardAlt(quickViewCard) : quickViewCard.title}
                    className={`w-full object-cover ${showFullPreview ? "h-96" : "h-64"}`}
                    loading="lazy"
                  />
                ) : (
                  <video
                    className={`w-full object-cover ${showFullPreview ? "h-96" : "h-64"}`}
                    src={quickViewCard.src}
                    poster={posterUrl(quickViewCard.poster, quickViewCard.priority || quickViewCard.key.startsWith("easter"))}
                    autoPlay
                    loop={!showFullPreview}
                    muted
                    playsInline
                    controls={showFullPreview}
                  />
                )}
              </div>
              <div>
                <div className="text-[24px] font-semibold text-[#2D6A4F]">£5</div>
                <div className="text-sm text-[#1A1A1A]/70">Includes 1 tree planted 🌱</div>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => {
                    setSelectedCard(quickViewCard.key);
                    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                    setQuickViewCard(null);
                    setShowFullPreview(false);
                    trackEvent("personalize_start", { cardKey: quickViewCard.key });
                  }}
                  className="h-12 px-6 rounded-full bg-[#2D6A4F] text-white font-semibold hover:bg-[#52B788] transition"
                >
                  Choose & Personalize
                </button>
                <button
                  onClick={() => {
                    setShowFullPreview((prev) => !prev);
                    trackEvent("preview_full_toggle", { cardKey: quickViewCard.key });
                  }}
                  className="h-12 px-5 rounded-full border border-slate-200 text-[#1A1A1A] hover:bg-slate-100 transition"
                >
                  {showFullPreview ? "Back to Quick View" : "Preview Full Card"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

        <ExitIntentModal
          headline="Wait! Easter is almost here"
          subheadline="Don't forget to send something meaningful. Our digital cards plant a tree and deliver instantly."
          offer=""
          ctaOnly
          ctaText="Browse Easter Cards"
          onCtaClick={() => {
            document.getElementById("easter-collection")?.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
        />
      </main>
    </ErrorBoundary>
  );
}
