import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { X, Check, ArrowRight } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const traditionalCons = [
  'Require 2-5 days shipping',
  'Cost £3-8 + £1.50 postage',
  'End up in landfill',
  'Limited personalization',
  'No environmental benefit',
]

const cardRootsPros = [
  'Instant email delivery',
  '£5 including tree planting',
  'Zero waste, plants a tree',
  'Fully customizable messages',
  'Animated and interactive',
]

const Comparison = () => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [sliderPosition, setSliderPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.comparison-heading',
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

      gsap.fromTo(
        '.comparison-card',
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.comparison-container',
            start: 'top 85%',
          },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const handleMouseDown = () => setIsDragging(true)
  const handleMouseUp = () => setIsDragging(false)
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const percentage = (x / rect.width) * 100
    setSliderPosition(Math.max(10, Math.min(90, percentage)))
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.touches[0].clientX - rect.left
    const percentage = (x / rect.width) * 100
    setSliderPosition(Math.max(10, Math.min(90, percentage)))
  }

  return (
    <section
      ref={sectionRef}
      className="py-20 lg:py-32 bg-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="comparison-heading text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 font-['Open_Sans']">
            Digital vs Traditional Cards
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            See why digital cards are better for you and the planet
          </p>
        </div>

        {/* Interactive Comparison Slider */}
        <div 
          className="comparison-container relative h-[500px] lg:h-[400px] rounded-3xl overflow-hidden cursor-ew-resize select-none"
          onMouseMove={handleMouseMove}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchMove={handleTouchMove}
          onTouchStart={() => setIsDragging(true)}
          onTouchEnd={() => setIsDragging(false)}
        >
          {/* Traditional Side (Left) */}
          <div className="absolute inset-0 bg-gray-100">
            <div className="h-full flex flex-col justify-center px-8 lg:px-16">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
                  <X className="w-6 h-6 text-gray-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-700 font-['Open_Sans']">
                  Traditional Paper Cards
                </h3>
              </div>
              <ul className="space-y-4">
                {traditionalCons.map((item, index) => (
                  <li key={index} className="flex items-center gap-3 text-gray-600">
                    <X className="w-5 h-5 text-red-500 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* CardRoots Side (Right) */}
          <div 
            className="absolute inset-0 bg-gradient-to-br from-[#d8f3dc] to-[#b7e4c7] transition-all duration-75"
            style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
          >
            <div className="h-full flex flex-col justify-center px-8 lg:px-16">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-[#2d6a4f] flex items-center justify-center">
                  <Check className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-[#1b4332] font-['Open_Sans']">
                  CardRoots Digital Cards
                </h3>
              </div>
              <ul className="space-y-4">
                {cardRootsPros.map((item, index) => (
                  <li key={index} className="flex items-center gap-3 text-[#1b4332]">
                    <Check className="w-5 h-5 text-[#2d6a4f] flex-shrink-0" />
                    <span className="font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Slider Handle */}
          <div 
            className="absolute top-0 bottom-0 w-1 bg-white shadow-lg cursor-ew-resize z-10"
            style={{ left: `${sliderPosition}%` }}
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center">
              <ArrowRight className="w-5 h-5 text-gray-600 rotate-0" />
            </div>
          </div>

          {/* Labels */}
          <div className="absolute bottom-4 left-4 px-4 py-2 bg-gray-200 rounded-full text-sm font-semibold text-gray-600">
            Drag to compare
          </div>
        </div>

        {/* Alternative: Side-by-side cards for mobile */}
        <div className="lg:hidden mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Traditional Card */}
          <div className="comparison-card p-6 bg-gray-100 rounded-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                <X className="w-5 h-5 text-gray-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-700">Traditional</h3>
            </div>
            <ul className="space-y-2">
              {traditionalCons.slice(0, 3).map((item, index) => (
                <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                  <X className="w-4 h-4 text-red-500" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* CardRoots Card */}
          <div className="comparison-card p-6 bg-gradient-to-br from-[#d8f3dc] to-[#b7e4c7] rounded-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#2d6a4f] flex items-center justify-center">
                <Check className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-[#1b4332]">CardRoots</h3>
            </div>
            <ul className="space-y-2">
              {cardRootsPros.slice(0, 3).map((item, index) => (
                <li key={index} className="flex items-center gap-2 text-sm text-[#1b4332]">
                  <Check className="w-4 h-4 text-[#2d6a4f]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Comparison
