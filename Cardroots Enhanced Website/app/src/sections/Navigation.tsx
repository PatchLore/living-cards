import { useState, useEffect } from 'react'
import { gsap } from 'gsap'
import { Menu, X, Leaf } from 'lucide-react'

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    // Entrance animation
    gsap.fromTo(
      '.nav-container',
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, delay: 0.2, ease: 'power3.out' }
    )
    gsap.fromTo(
      '.nav-link',
      { opacity: 0 },
      { opacity: 1, duration: 0.4, stagger: 0.1, delay: 0.5 }
    )
  }, [])

  const navLinks = [
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Browse Cards', href: '#cards' },
    { name: 'For Business', href: '#pricing' },
  ]

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setIsMobileMenuOpen(false)
  }

  return (
    <>
      <nav
        className={`nav-container fixed top-0 left-0 right-0 z-[1000] transition-all duration-500 ${
          isScrolled
            ? 'py-3'
            : 'py-5'
        }`}
      >
        <div
          className={`mx-auto transition-all duration-500 ${
            isScrolled
              ? 'max-w-3xl mx-4 sm:mx-auto rounded-full glass-effect shadow-lg px-6'
              : 'max-w-7xl px-4 sm:px-6 lg:px-8'
          }`}
        >
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <a
              href="#"
              className="flex items-center gap-2 group"
              onClick={(e) => {
                e.preventDefault()
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
            >
              <div className="relative">
                <Leaf className="w-7 h-7 text-[#2d6a4f] transition-transform duration-300 group-hover:rotate-12" />
              </div>
              <span className="text-xl font-bold text-gray-900 font-['Open_Sans']">
                CardRoots
              </span>
            </a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault()
                    scrollToSection(link.href)
                  }}
                  className="nav-link relative text-gray-700 hover:text-[#e7000a] font-medium transition-colors duration-300 group"
                >
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#e7000a] transition-all duration-300 group-hover:w-full" />
                </a>
              ))}
            </div>

            {/* CTA Button */}
            <div className="hidden md:block">
              <a
                href="#cards"
                onClick={(e) => {
                  e.preventDefault()
                  scrollToSection('#cards')
                }}
                className="nav-link inline-flex items-center gap-2 px-5 py-2.5 bg-[#e7000a] text-white font-semibold rounded-full hover:bg-[#c60009] transition-all duration-300 hover:shadow-lg hover:shadow-red-500/25 hover:-translate-y-0.5"
              >
                Get Started
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-[999] md:hidden transition-all duration-500 ${
          isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        <div
          className="absolute inset-0 bg-black/20 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
        <div
          className={`absolute top-20 left-4 right-4 bg-white rounded-2xl shadow-2xl p-6 transition-all duration-500 ${
            isMobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
          }`}
        >
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault()
                  scrollToSection(link.href)
                }}
                className="text-lg font-medium text-gray-700 hover:text-[#e7000a] py-2 transition-colors"
              >
                {link.name}
              </a>
            ))}
            <hr className="my-2" />
            <a
              href="#cards"
              onClick={(e) => {
                e.preventDefault()
                scrollToSection('#cards')
              }}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#e7000a] text-white font-semibold rounded-full hover:bg-[#c60009] transition-colors"
            >
              Get Started
            </a>
          </div>
        </div>
      </div>
    </>
  )
}

export default Navigation
