import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { TreePine, Globe, Users, Heart } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const stats = [
  {
    icon: TreePine,
    value: 50000,
    suffix: '+',
    label: 'Trees Planted',
    color: '#2d6a4f',
  },
  {
    icon: Globe,
    value: 25,
    suffix: '+',
    label: 'Countries',
    color: '#1b4332',
  },
  {
    icon: Users,
    value: 100000,
    suffix: '+',
    label: 'Cards Sent',
    color: '#e7000a',
  },
  {
    icon: Heart,
    value: 98,
    suffix: '%',
    label: 'Happy Customers',
    color: '#ff6b6b',
  },
]

const Impact = () => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [counts, setCounts] = useState(stats.map(() => 0))
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Section entrance
      gsap.fromTo(
        '.impact-content',
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            onEnter: () => {
              if (!hasAnimated) {
                setHasAnimated(true)
                animateCounts()
              }
            },
          },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [hasAnimated])

  const animateCounts = () => {
    stats.forEach((stat, index) => {
      const duration = 2000
      const startTime = Date.now()
      
      const animate = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)
        const easeProgress = 1 - Math.pow(1 - progress, 3)
        
        setCounts((prev) => {
          const newCounts = [...prev]
          newCounts[index] = Math.floor(easeProgress * stat.value)
          return newCounts
        })
        
        if (progress < 1) {
          requestAnimationFrame(animate)
        }
      }
      
      setTimeout(animate, index * 200)
    })
  }

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(num >= 10000 ? 0 : 1) + 'K'
    }
    return num.toString()
  }

  return (
    <section
      ref={sectionRef}
      className="py-20 lg:py-32 bg-gradient-to-br from-[#1b4332] via-[#2d6a4f] to-[#1b4332] relative overflow-hidden"
    >
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#e7000a]/5 rounded-full blur-3xl" />
      </div>

      {/* Floating trees */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <TreePine
            key={i}
            className="absolute text-white/5 animate-float"
            style={{
              width: `${20 + i * 10}px`,
              height: `${20 + i * 10}px`,
              left: `${10 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}
      </div>

      <div className="impact-content relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full mb-6">
            <TreePine className="w-4 h-4 text-white" />
            <span className="text-sm font-semibold text-white">Our Impact</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 font-['Open_Sans']">
            Every Card Plants a Tree
          </h2>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Together, we're making a real difference. Join thousands of thoughtful senders helping restore forests worldwide.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-16">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div
                key={index}
                className="text-center p-6 lg:p-8 bg-white/10 backdrop-blur-sm rounded-2xl hover:bg-white/15 transition-colors duration-300"
              >
                <div
                  className="w-14 h-14 mx-auto mb-4 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${stat.color}40` }}
                >
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <div className="text-3xl lg:text-4xl font-bold text-white mb-1 font-['Open_Sans']">
                  {formatNumber(counts[index])}{stat.suffix}
                </div>
                <div className="text-sm text-white/70">{stat.label}</div>
              </div>
            )
          })}
        </div>

        {/* CTA */}
        <div className="text-center">
          <a
            href="#cards"
            onClick={(e) => {
              e.preventDefault()
              document.querySelector('#cards')?.scrollIntoView({ behavior: 'smooth' })
            }}
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#2d6a4f] font-bold rounded-full hover:bg-gray-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
          >
            Start Planting Trees
            <TreePine className="w-5 h-5" />
          </a>
        </div>
      </div>
    </section>
  )
}

export default Impact
