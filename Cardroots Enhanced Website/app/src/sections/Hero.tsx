import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ArrowRight, Sparkles } from 'lucide-react'

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Headline animation - word by word reveal
      gsap.fromTo(
        '.hero-eyebrow',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, delay: 0.3, ease: 'power2.out' }
      )

      gsap.fromTo(
        '.hero-headline span',
        { opacity: 0, y: 60, rotateX: 45 },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 0.8,
          stagger: 0.08,
          delay: 0.5,
          ease: 'power3.out',
        }
      )

      gsap.fromTo(
        '.hero-subheadline',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, delay: 1, ease: 'power2.out' }
      )

      gsap.fromTo(
        '.hero-cta',
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.6, delay: 1.2, ease: 'back.out(1.7)' }
      )

      gsap.fromTo(
        '.hero-social-proof',
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.5, delay: 1.4, ease: 'power2.out' }
      )

      // Card cluster animation
      gsap.fromTo(
        '.hero-card',
        { opacity: 0, z: -200, rotateY: 90 },
        {
          opacity: 1,
          z: 0,
          rotateY: 0,
          duration: 1,
          stagger: 0.15,
          delay: 0.8,
          ease: 'power3.out',
        }
      )

      // Floating animation for cards
      gsap.to('.hero-card-1', {
        y: -15,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      })
      gsap.to('.hero-card-2', {
        y: -12,
        duration: 3.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 0.5,
      })
      gsap.to('.hero-card-3', {
        y: -10,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 1,
      })
    }, heroRef)

    return () => ctx.revert()
  }, [])

  // Mouse parallax effect for cards
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!cardsRef.current) return
      const { clientX, clientY } = e
      const { innerWidth, innerHeight } = window
      const x = (clientX / innerWidth - 0.5) * 20
      const y = (clientY / innerHeight - 0.5) * 20

      gsap.to(cardsRef.current, {
        rotateY: x,
        rotateX: -y,
        duration: 0.5,
        ease: 'power2.out',
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const scrollToCards = () => {
    const element = document.querySelector('#cards')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center overflow-hidden pt-20"
    >
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#fff0f3] via-[#fafafa] to-[#d8f3dc] animate-gradient" />
      
      {/* Floating decorative elements */}
      <div className="absolute top-1/4 left-10 w-20 h-20 bg-[#ffccd5]/30 rounded-full blur-xl animate-float" />
      <div className="absolute bottom-1/4 right-20 w-32 h-32 bg-[#d8f3dc]/40 rounded-full blur-2xl animate-float-delayed" />
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-[#e7000a]/10 rounded-full blur-lg animate-float" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            {/* Eyebrow */}
            <div className="hero-eyebrow inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm mb-6">
              <Sparkles className="w-4 h-4 text-[#e7000a]" />
              <span className="text-sm font-semibold text-[#e7000a] uppercase tracking-wider">
                Eco-Friendly Digital Greetings
              </span>
            </div>

            {/* Headline */}
            <h1 className="hero-headline text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6 font-['Open_Sans']" style={{ perspective: '1000px' }}>
              <span className="inline-block">Send</span>{' '}
              <span className="inline-block">Digital</span>{' '}
              <span className="inline-block text-[#e7000a]">Valentine</span>{' '}
              <span className="inline-block">Cards</span>
              <br />
              <span className="inline-block">That</span>{' '}
              <span className="inline-block text-[#2d6a4f]">Plant</span>{' '}
              <span className="inline-block text-[#2d6a4f]">Trees</span>
              <span className="inline-block ml-2">🌱</span>
            </h1>

            {/* Subheadline */}
            <p className="hero-subheadline text-lg sm:text-xl text-gray-600 mb-8 max-w-xl mx-auto lg:mx-0">
              Valentine's Day is just around the corner — Send a living card that{' '}
              <span className="font-semibold text-[#2d6a4f]">grows</span> instead of dies.
              Instant delivery with real environmental impact.
            </p>

            {/* CTA Buttons */}
            <div className="hero-cta flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
              <button
                onClick={scrollToCards}
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#e7000a] text-white font-semibold rounded-full hover:bg-[#c60009] transition-all duration-300 hover:shadow-xl hover:shadow-red-500/30 hover:-translate-y-1"
              >
                Browse Valentine Cards
                <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
              <a
                href="#pricing"
                onClick={(e) => {
                  e.preventDefault()
                  document.querySelector('#pricing')?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-gray-700 font-semibold rounded-full border-2 border-gray-200 hover:border-[#2d6a4f] hover:text-[#2d6a4f] transition-all duration-300 hover:-translate-y-1"
              >
                For Business
              </a>
            </div>

            {/* Social Proof */}
            <div className="hero-social-proof flex items-center gap-4 justify-center lg:justify-start">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-[#ffccd5] to-[#d8f3dc] border-2 border-white flex items-center justify-center text-xs font-bold text-gray-700"
                  >
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-600">
                <span className="font-semibold text-[#2d6a4f]">Join thousands</span> planting trees, one card at a time
              </p>
            </div>
          </div>

          {/* Right Content - 3D Card Cluster */}
          <div
            ref={cardsRef}
            className="relative hidden lg:block"
            style={{ perspective: '1000px', transformStyle: 'preserve-3d' }}
          >
            <div className="relative w-full h-[500px]">
              {/* Card 1 */}
              <div
                className="hero-card hero-card-1 absolute top-10 left-0 w-56 h-72 rounded-2xl overflow-hidden shadow-2xl transform rotate-[-8deg] hover:rotate-0 hover:scale-105 transition-all duration-500 cursor-pointer"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <img
                  src="/valentine-blossom.jpg"
                  alt="Valentine Blossom Card"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>

              {/* Card 2 - Center */}
              <div
                className="hero-card hero-card-2 absolute top-0 left-1/2 -translate-x-1/2 w-60 h-80 rounded-2xl overflow-hidden shadow-2xl z-10 transform hover:scale-105 transition-all duration-500 cursor-pointer"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <img
                  src="/valentine-rose.jpg"
                  alt="Valentine Rose Card"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="inline-block px-3 py-1 bg-[#e7000a] text-white text-xs font-bold rounded-full">
                    Most Popular
                  </span>
                </div>
              </div>

              {/* Card 3 */}
              <div
                className="hero-card hero-card-3 absolute top-16 right-0 w-56 h-72 rounded-2xl overflow-hidden shadow-2xl transform rotate-[8deg] hover:rotate-0 hover:scale-105 transition-all duration-500 cursor-pointer"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <img
                  src="/valentine-love-light.jpg"
                  alt="Valentine Love Light Card"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>

              {/* Decorative elements */}
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg">
                <span className="text-2xl">🌳</span>
                <span className="text-sm font-semibold text-gray-700">1 Card = 1 Tree</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
