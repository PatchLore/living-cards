import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Navigation from './sections/Navigation'
import Hero from './sections/Hero'
import CardCollection from './sections/CardCollection'
import WhyChoose from './sections/WhyChoose'
import Comparison from './sections/Comparison'
import HowItWorks from './sections/HowItWorks'
import Testimonials from './sections/Testimonials'
import Pricing from './sections/Pricing'
import FAQ from './sections/FAQ'
import Impact from './sections/Impact'
import Footer from './sections/Footer'
import './App.css'

gsap.registerPlugin(ScrollTrigger)

function App() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const mainRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Smooth scroll progress indicator
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = (scrollTop / docHeight) * 100
      setScrollProgress(progress)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    // Initialize scroll animations
    const ctx = gsap.context(() => {
      // Animate sections on scroll
      gsap.utils.toArray<HTMLElement>('.animate-section').forEach((section) => {
        gsap.fromTo(
          section,
          { opacity: 0.9, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        )
      })
    }, mainRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={mainRef} className="relative min-h-screen bg-[#fafafa]">
      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 h-1 bg-gradient-to-r from-[#e7000a] to-[#2d6a4f] z-[1001] transition-all duration-100" style={{ width: `${scrollProgress}%` }} />
      
      {/* Navigation */}
      <Navigation />
      
      {/* Main Content */}
      <main>
        <Hero />
        <CardCollection />
        <WhyChoose />
        <Comparison />
        <HowItWorks />
        <Testimonials />
        <Pricing />
        <FAQ />
        <Impact />
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  )
}

export default App
