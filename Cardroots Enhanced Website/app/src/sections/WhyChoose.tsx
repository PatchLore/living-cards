import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { 
  TreePine, 
  Mail, 
  Sparkles, 
  MapPin, 
  Globe, 
  Plane,
  Check
} from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const features = [
  {
    icon: TreePine,
    title: '100% Verified Tree Planting',
    description: 'Not carbon offsets - real trees planted through verified partners. Track your impact.',
    color: 'from-green-400 to-green-600',
  },
  {
    icon: Mail,
    title: 'Instant Email Delivery',
    description: 'No shipping required - perfect for last-minute gifts. Delivered in seconds.',
    color: 'from-blue-400 to-blue-600',
  },
  {
    icon: Sparkles,
    title: 'Beautiful Animated Cards',
    description: 'Not static images - engaging animations that bring your message to life.',
    color: 'from-purple-400 to-purple-600',
  },
  {
    icon: MapPin,
    title: 'Track Your Impact',
    description: 'See where your tree is planted and measure your environmental contribution.',
    color: 'from-orange-400 to-orange-600',
  },
  {
    icon: Globe,
    title: 'Support Global Reforestation',
    description: 'Help restore forests and support sustainable projects worldwide.',
    color: 'from-teal-400 to-teal-600',
  },
  {
    icon: Plane,
    title: 'Perfect for Long-Distance',
    description: 'Send instantly to anyone, anywhere - no postal delays or boundaries.',
    color: 'from-pink-400 to-pink-600',
  },
]

const WhyChoose = () => {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading animation
      gsap.fromTo(
        '.why-heading',
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

      // Feature cards animation
      gsap.fromTo(
        '.feature-card',
        { opacity: 0, scale: 0.8, rotate: -5 },
        {
          opacity: 1,
          scale: 1,
          rotate: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: '.features-grid',
            start: 'top 85%',
          },
        }
      )

      // Icon draw animation
      gsap.fromTo(
        '.feature-icon',
        { scale: 0, rotate: -180 },
        {
          scale: 1,
          rotate: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'back.out(2)',
          scrollTrigger: {
            trigger: '.features-grid',
            start: 'top 80%',
          },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="py-20 lg:py-32 bg-gradient-to-b from-white to-[#f8fdf9]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="why-heading text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#d8f3dc] rounded-full mb-4">
            <Check className="w-4 h-4 text-[#2d6a4f]" />
            <span className="text-sm font-semibold text-[#2d6a4f]">Why Choose Us</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 font-['Open_Sans']">
            Why Choose CardRoots?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            The eco-friendly alternative to traditional greeting cards. Make a difference with every card you send.
          </p>
        </div>

        {/* Features Grid */}
        <div className="features-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="feature-card group relative p-6 lg:p-8 bg-white rounded-2xl card-shadow hover:card-shadow-hover transition-all duration-500 hover:-translate-y-2"
              >
                {/* Icon */}
                <div
                  className={`feature-icon w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon className="w-7 h-7 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-3 font-['Open_Sans'] group-hover:text-[#2d6a4f] transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover decoration */}
                <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gradient-to-br from-[#d8f3dc] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            )
          })}
        </div>

        {/* Stats Row */}
        <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { value: '50K+', label: 'Trees Planted' },
            { value: '100K+', label: 'Cards Sent' },
            { value: '25+', label: 'Countries' },
            { value: '4.9', label: 'User Rating' },
          ].map((stat, index) => (
            <div
              key={index}
              className="text-center p-6 bg-white rounded-2xl card-shadow"
            >
              <div className="text-3xl lg:text-4xl font-bold text-[#2d6a4f] mb-1 font-['Open_Sans']">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default WhyChoose
