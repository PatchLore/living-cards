import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const testimonials = [
  {
    id: 1,
    name: 'Tom B.',
    avatar: 'T',
    rating: 5,
    text: 'Sent this to my wife instead of flowers - she loved that it plants a tree! Perfect last-minute gift. The animation was beautiful and the message felt so personal.',
    color: 'from-blue-400 to-blue-600',
  },
  {
    id: 2,
    name: 'Sarah M.',
    avatar: 'S',
    rating: 5,
    text: 'Such a meaningful way to send holiday greetings. Love knowing a tree gets planted with every card! My family was so impressed with the quality.',
    color: 'from-pink-400 to-pink-600',
  },
  {
    id: 3,
    name: 'James K.',
    avatar: 'J',
    rating: 5,
    text: 'Beautiful animations and guilt-free. No more paper waste. I\'ve switched all my greeting cards to CardRoots. The tracking feature is amazing!',
    color: 'from-green-400 to-green-600',
  },
  {
    id: 4,
    name: 'Emma L.',
    avatar: 'E',
    rating: 5,
    text: 'Sent 20 Christmas cards this year and planted 20 trees. Perfect! My clients loved the personal touch and the environmental impact.',
    color: 'from-purple-400 to-purple-600',
  },
  {
    id: 5,
    name: 'Michael R.',
    avatar: 'M',
    rating: 5,
    text: 'Best decision I made for Valentine\'s Day. My girlfriend was touched by the gesture and we even got to see where our tree was planted!',
    color: 'from-orange-400 to-orange-600',
  },
]

const Testimonials = () => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const carouselRef = useRef<HTMLDivElement>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.testimonials-heading',
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
        '.testimonial-card',
        { opacity: 0, scale: 0.9 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: carouselRef.current,
            start: 'top 85%',
          },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const goToSlide = (index: number) => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrentIndex(index)
    setTimeout(() => setIsAnimating(false), 500)
  }

  const nextSlide = () => {
    goToSlide((currentIndex + 1) % testimonials.length)
  }

  const prevSlide = () => {
    goToSlide((currentIndex - 1 + testimonials.length) % testimonials.length)
  }

  // Auto-play
  useEffect(() => {
    const interval = setInterval(nextSlide, 5000)
    return () => clearInterval(interval)
  }, [currentIndex])

  return (
    <section
      ref={sectionRef}
      className="py-20 lg:py-32 bg-gradient-to-b from-white to-[#fff0f3]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="testimonials-heading text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#fff0f3] rounded-full mb-4">
            <Star className="w-4 h-4 text-[#e7000a] fill-[#e7000a]" />
            <span className="text-sm font-semibold text-[#e7000a]">Trusted by Thousands</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 font-['Open_Sans']">
            Trusted by Thoughtful Senders
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Real people choosing eco-friendly greetings and making a difference.
          </p>
        </div>

        {/* Carousel */}
        <div ref={carouselRef} className="relative">
          {/* Main Carousel */}
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="testimonial-card w-full flex-shrink-0 px-4"
                >
                  <div className="max-w-3xl mx-auto">
                    <div className="bg-white rounded-3xl p-8 lg:p-12 card-shadow relative">
                      {/* Quote Icon */}
                      <div className="absolute -top-6 left-8 w-12 h-12 bg-[#e7000a] rounded-full flex items-center justify-center">
                        <Quote className="w-6 h-6 text-white" />
                      </div>

                      {/* Stars */}
                      <div className="flex gap-1 mb-6">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                        ))}
                      </div>

                      {/* Text */}
                      <p className="text-lg lg:text-xl text-gray-700 leading-relaxed mb-8">
                        "{testimonial.text}"
                      </p>

                      {/* Author */}
                      <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${testimonial.color} flex items-center justify-center text-white font-bold text-xl`}>
                          {testimonial.avatar}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900">{testimonial.name}</div>
                          <div className="text-sm text-gray-500">Verified Customer</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 lg:-translate-x-6 w-12 h-12 bg-white rounded-full card-shadow flex items-center justify-center hover:bg-gray-50 transition-colors z-10"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 lg:translate-x-6 w-12 h-12 bg-white rounded-full card-shadow flex items-center justify-center hover:bg-gray-50 transition-colors z-10"
          >
            <ChevronRight className="w-6 h-6 text-gray-700" />
          </button>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'w-8 bg-[#e7000a]'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-16 flex flex-wrap justify-center gap-8">
          {[
            { value: '4.9/5', label: 'Average Rating' },
            { value: '50K+', label: 'Happy Customers' },
            { value: '100K+', label: 'Cards Delivered' },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials
