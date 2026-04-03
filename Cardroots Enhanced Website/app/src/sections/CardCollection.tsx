import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Eye, Heart, Sparkles, Flame, Star } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

interface Card {
  id: number
  name: string
  description: string
  image: string
  price: number
  badge?: string
  badgeIcon?: React.ReactNode
  available: number
}

const cards: Card[] = [
  {
    id: 1,
    name: 'Valentine Blossom',
    description: 'Soft blossoms for a sweet Valentine.',
    image: '/valentine-blossom.jpg',
    price: 5,
    badge: 'Limited Time',
    badgeIcon: <Sparkles className="w-3 h-3" />,
    available: 40,
  },
  {
    id: 2,
    name: 'Valentine Dream',
    description: 'A dreamy animation to say I love you.',
    image: '/valentine-dream.jpg',
    price: 5,
    badge: 'Staff Pick',
    badgeIcon: <Star className="w-3 h-3" />,
    available: 28,
  },
  {
    id: 3,
    name: 'Valentine Forever',
    description: 'A timeless Valentine message.',
    image: '/valentine-forever.jpg',
    price: 5,
    badge: 'Limited Time',
    badgeIcon: <Sparkles className="w-3 h-3" />,
    available: 36,
  },
  {
    id: 4,
    name: 'Valentine Heart Glow',
    description: 'A radiant heart that says I love you.',
    image: '/valentine-heart-glow.jpg',
    price: 5,
    badge: 'Most Popular',
    badgeIcon: <Flame className="w-3 h-3" />,
    available: 42,
  },
  {
    id: 5,
    name: 'Valentine Love Light',
    description: 'Warm light for your special someone.',
    image: '/valentine-love-light.jpg',
    price: 5,
    badge: 'Limited Time',
    badgeIcon: <Sparkles className="w-3 h-3" />,
    available: 38,
  },
  {
    id: 6,
    name: 'Valentine Rose',
    description: 'A blooming rose for the one you love.',
    image: '/valentine-rose.jpg',
    price: 5,
    badge: 'Limited Time',
    badgeIcon: <Sparkles className="w-3 h-3" />,
    available: 45,
  },
  {
    id: 7,
    name: 'Valentine Spark',
    description: 'A little spark of love for Valentine\'s Day.',
    image: '/valentine-spark.jpg',
    price: 5,
    badge: 'New This Year',
    badgeIcon: <Sparkles className="w-3 h-3" />,
    available: 30,
  },
  {
    id: 8,
    name: 'Valentine Sweetheart',
    description: 'A sweet animation for your special someone.',
    image: '/valentine-sweetheart.jpg',
    price: 5,
    badge: 'Limited Time',
    badgeIcon: <Sparkles className="w-3 h-3" />,
    available: 34,
  },
  {
    id: 9,
    name: 'Valentine Together',
    description: 'Celebrate being together with a thoughtful gesture.',
    image: '/valentine-together.jpg',
    price: 5,
    badge: 'Limited Time',
    badgeIcon: <Sparkles className="w-3 h-3" />,
    available: 32,
  },
]

const CardCollection = () => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading animation
      gsap.fromTo(
        '.collection-heading',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          },
        }
      )

      // Cards stagger animation
      gsap.fromTo(
        '.card-item',
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: scrollContainerRef.current,
            start: 'top 85%',
          },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, _cardId: number) => {
    const card = e.currentTarget
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateX = (y - centerY) / 10
    const rotateY = (centerX - x) / 10

    gsap.to(card, {
      rotateX: -rotateX,
      rotateY: rotateY,
      duration: 0.3,
      ease: 'power2.out',
    })
  }

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget
    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.5,
      ease: 'power2.out',
    })
    setHoveredCard(null)
  }

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case 'Most Popular':
        return 'bg-orange-500'
      case 'Staff Pick':
        return 'bg-purple-500'
      case 'New This Year':
        return 'bg-blue-500'
      default:
        return 'bg-[#e7000a]'
    }
  }

  return (
    <section
      id="cards"
      ref={sectionRef}
      className="py-20 lg:py-32 bg-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="collection-heading text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#fff0f3] rounded-full mb-4">
            <Heart className="w-4 h-4 text-[#e7000a]" />
            <span className="text-sm font-semibold text-[#e7000a]">New Valentine Collection</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 font-['Open_Sans']">
            Choose Your Perfect Card
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Each card plants a real tree. Browse our collection of beautiful animated Valentine cards.
          </p>
        </div>

        {/* Cards Grid */}
        <div
          ref={scrollContainerRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {cards.map((card) => (
            <div
              key={card.id}
              className="card-item group relative"
              style={{ perspective: '1000px' }}
            >
              <div
                className="relative bg-white rounded-2xl overflow-hidden card-shadow hover:card-shadow-hover transition-shadow duration-500"
                style={{ transformStyle: 'preserve-3d' }}
                onMouseMove={(e) => handleMouseMove(e, card.id)}
                onMouseEnter={() => setHoveredCard(card.id)}
                onMouseLeave={handleMouseLeave}
              >
                {/* Image Container */}
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img
                    src={card.image}
                    alt={card.name}
                    className={`w-full h-full object-cover transition-transform duration-700 ${
                      hoveredCard === card.id ? 'scale-110' : 'scale-100'
                    }`}
                  />
                  
                  {/* Overlay on hover */}
                  <div
                    className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300 ${
                      hoveredCard === card.id ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    <button className="flex items-center gap-2 px-6 py-3 bg-white text-gray-900 font-semibold rounded-full hover:bg-[#e7000a] hover:text-white transition-colors duration-300 transform hover:scale-105">
                      <Eye className="w-5 h-5" />
                      Preview
                    </button>
                  </div>

                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 ${getBadgeColor(
                        card.badge || ''
                      )} text-white text-xs font-bold rounded-full`}
                    >
                      {card.badgeIcon}
                      {card.badge}
                    </span>
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-semibold rounded-full">
                      <Heart className="w-3 h-3 text-[#e7000a]" />
                      Valentine
                    </span>
                  </div>

                  {/* Available count */}
                  <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-semibold rounded-full">
                    Only {card.available} left
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-900 mb-1 font-['Open_Sans']">
                    {card.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">{card.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-[#2d6a4f]">£{card.price}</span>
                      <span className="text-sm text-gray-500 ml-1">per card</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-[#2d6a4f]">
                      <span>🌱</span>
                      <span className="font-medium">1 tree planted</span>
                    </div>
                  </div>

                  <button className="w-full mt-4 py-3 bg-[#2d6a4f] text-white font-semibold rounded-xl hover:bg-[#1b4332] transition-all duration-300 hover:shadow-lg hover:shadow-green-900/20 transform hover:-translate-y-0.5">
                    Select This Card
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <button className="inline-flex items-center gap-2 px-8 py-4 bg-gray-100 text-gray-700 font-semibold rounded-full hover:bg-gray-200 transition-all duration-300">
            View All Cards
            <Sparkles className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  )
}

export default CardCollection
