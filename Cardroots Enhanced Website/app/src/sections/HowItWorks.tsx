import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Mail, PenLine, TreePine } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const steps = [
  {
    icon: Mail,
    title: 'Choose Your Card',
    description: 'Browse our collection of beautiful animated cards. Find the perfect design for your special someone.',
    color: '#e7000a',
    bgColor: '#fff0f3',
  },
  {
    icon: PenLine,
    title: 'Personalize Your Message',
    description: 'Add your heartfelt message and recipient details. Make it truly personal and meaningful.',
    color: '#2d6a4f',
    bgColor: '#d8f3dc',
  },
  {
    icon: TreePine,
    title: 'Tree Gets Planted',
    description: 'We plant a real tree and send your card instantly. Track your impact and watch forests grow.',
    color: '#1b4332',
    bgColor: '#b7e4c7',
  },
]

const HowItWorks = () => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const pathRef = useRef<SVGPathElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading animation
      gsap.fromTo(
        '.hiw-heading',
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

      // Path draw animation
      if (pathRef.current) {
        const pathLength = pathRef.current.getTotalLength()
        gsap.set(pathRef.current, {
          strokeDasharray: pathLength,
          strokeDashoffset: pathLength,
        })

        gsap.to(pathRef.current, {
          strokeDashoffset: 0,
          duration: 2,
          ease: 'power2.inOut',
          scrollTrigger: {
            trigger: '.steps-container',
            start: 'top 80%',
            end: 'bottom 60%',
            scrub: 1,
          },
        })
      }

      // Step cards animation
      gsap.fromTo(
        '.step-card',
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.steps-container',
            start: 'top 80%',
          },
        }
      )

      // Icon pulse animation
      gsap.to('.step-icon', {
        scale: 1.1,
        duration: 1,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: 0.3,
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="py-20 lg:py-32 bg-gradient-to-b from-[#f8fdf9] to-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="hiw-heading text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 font-['Open_Sans']">
            How It Works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Three simple steps to send a card and plant a tree. It's that easy!
          </p>
        </div>

        {/* Steps Container */}
        <div className="steps-container relative">
          {/* Connecting Path - Desktop */}
          <svg
            className="absolute top-1/2 left-0 w-full h-4 -translate-y-1/2 hidden lg:block"
            viewBox="0 0 1200 20"
            fill="none"
            preserveAspectRatio="none"
          >
            <path
              ref={pathRef}
              d="M 0 10 Q 200 10, 300 10 T 600 10 T 900 10 T 1200 10"
              stroke="#2d6a4f"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
              strokeDasharray="8 8"
            />
          </svg>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 relative z-10">
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <div
                  key={index}
                  className="step-card relative"
                >
                  {/* Step Number */}
                  <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-[#e7000a] text-white font-bold flex items-center justify-center text-lg z-20">
                    {index + 1}
                  </div>

                  {/* Card */}
                  <div 
                    className="h-full p-8 rounded-2xl transition-all duration-500 hover:-translate-y-2"
                    style={{ backgroundColor: step.bgColor }}
                  >
                    {/* Icon */}
                    <div 
                      className="step-icon w-16 h-16 rounded-xl flex items-center justify-center mb-6"
                      style={{ backgroundColor: step.color }}
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </div>

                    {/* Content */}
                    <h3 
                      className="text-xl font-bold mb-3 font-['Open_Sans']"
                      style={{ color: step.color }}
                    >
                      {step.title}
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  {/* Arrow for mobile */}
                  {index < steps.length - 1 && (
                    <div className="flex justify-center my-4 lg:hidden">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                        <svg className="w-4 h-4 text-gray-500 rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <a
            href="#cards"
            onClick={(e) => {
              e.preventDefault()
              document.querySelector('#cards')?.scrollIntoView({ behavior: 'smooth' })
            }}
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#e7000a] text-white font-semibold rounded-full hover:bg-[#c60009] transition-all duration-300 hover:shadow-xl hover:shadow-red-500/30 hover:-translate-y-1"
          >
            Start Sending Cards
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
