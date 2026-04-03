import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Check, Sparkles, Gift, Zap, Building2 } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const features = [
  '1 tree planted per card',
  'Instant email delivery',
  'Beautiful animations',
  'Personalized message',
  'Delivery tracking',
  'Impact dashboard',
]

const bulkPlans = [
  {
    name: 'Starter',
    cards: '5-10',
    discount: '10% off',
    icon: Gift,
  },
  {
    name: 'Popular',
    cards: '11-25',
    discount: '15% off',
    icon: Zap,
  },
  {
    name: 'Business',
    cards: '26-100',
    discount: '20% off',
    icon: Building2,
  },
]

const Pricing = () => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [count, setCount] = useState(0)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading animation
      gsap.fromTo(
        '.pricing-heading',
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

      // Main card animation
      gsap.fromTo(
        '.pricing-card',
        { opacity: 0, rotateX: 45, y: 50 },
        {
          opacity: 1,
          rotateX: 0,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.pricing-card',
            start: 'top 85%',
          },
        }
      )

      // Bulk plans animation
      gsap.fromTo(
        '.bulk-plan',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.bulk-plans',
            start: 'top 90%',
          },
        }
      )
    }, sectionRef)

    // Count up animation
    const targetCount = 5
    const duration = 1000
    const startTime = Date.now()
    
    const animateCount = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easeProgress = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(easeProgress * targetCount))
      
      if (progress < 1) {
        requestAnimationFrame(animateCount)
      }
    }

    const timer = setTimeout(animateCount, 500)
    return () => {
      clearTimeout(timer)
      ctx.revert()
    }
  }, [])

  return (
    <section
      id="pricing"
      ref={sectionRef}
      className="py-20 lg:py-32 bg-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="pricing-heading text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 font-['Open_Sans']">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Every card includes one tree planted and instant delivery. No hidden fees.
          </p>
        </div>

        {/* Main Pricing Card */}
        <div className="max-w-2xl mx-auto mb-16" style={{ perspective: '1000px' }}>
          <div className="pricing-card relative bg-gradient-to-br from-[#2d6a4f] to-[#1b4332] rounded-3xl p-8 lg:p-12 text-white overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
            
            {/* Content */}
            <div className="relative z-10">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full mb-6">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-sm font-semibold">Most Popular</span>
                </div>
                
                <div className="flex items-baseline justify-center gap-1 mb-2">
                  <span className="text-2xl">£</span>
                  <span className="text-6xl lg:text-7xl font-bold">{count}</span>
                </div>
                <p className="text-white/80">per card</p>
              </div>

              {/* Features */}
              <ul className="space-y-4 mb-8">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4" />
                    </div>
                    <span className="text-white/90">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Promo Badge */}
              <div className="bg-white/10 rounded-xl p-4 mb-8 text-center">
                <p className="text-sm text-white/80 mb-1">Valentine's Special</p>
                <p className="text-lg font-bold">Buy 3 cards, get 1 free</p>
                <p className="text-sm text-white/60 mt-1">Use code <span className="font-mono bg-white/20 px-2 py-0.5 rounded">LOVE2026</span></p>
              </div>

              {/* CTA */}
              <button className="w-full py-4 bg-white text-[#2d6a4f] font-bold rounded-xl hover:bg-gray-100 transition-colors duration-300 flex items-center justify-center gap-2">
                Get Started
                <Sparkles className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Bulk Plans */}
        <div className="bulk-plans">
          <h3 className="text-xl font-bold text-gray-900 text-center mb-8 font-['Open_Sans']">
            Bulk Discounts Available
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
            {bulkPlans.map((plan, index) => {
              const Icon = plan.icon
              return (
                <div
                  key={index}
                  className="bulk-plan p-6 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors duration-300 text-center group cursor-pointer"
                >
                  <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-[#d8f3dc] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-6 h-6 text-[#2d6a4f]" />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-1">{plan.name}</h4>
                  <p className="text-sm text-gray-600 mb-2">{plan.cards} cards</p>
                  <span className="inline-block px-3 py-1 bg-[#2d6a4f] text-white text-sm font-semibold rounded-full">
                    {plan.discount}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Corporate CTA */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">
            Sending 100+ holiday cards?{' '}
            <a href="#" className="text-[#2d6a4f] font-semibold hover:underline">
              Request a Managed Sending Service
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}

export default Pricing
