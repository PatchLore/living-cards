import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Plus, Minus, Search, HelpCircle } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const faqs = [
  {
    question: 'What are digital Valentine cards?',
    answer: 'Digital Valentine cards are animated greeting cards delivered instantly via email. Unlike traditional paper cards, they\'re eco-friendly and plant real trees. CardRoots digital cards feature beautiful animations, personalized messages, and verified tree planting through our reforestation partners.',
  },
  {
    question: 'How quickly are digital Valentine cards delivered?',
    answer: 'CardRoots digital Valentine cards are delivered instantly via email - perfect for last-minute gifts or when you\'re separated by distance. You can send cards right up until midnight on Valentine\'s Day with no shipping delays or cutoff dates.',
  },
  {
    question: 'What makes CardRoots cards eco-friendly?',
    answer: 'Every CardRoots card plants one verified tree through our reforestation partners. You can track your tree\'s planting location and environmental impact. Unlike paper cards that end up in landfill, our digital cards create zero waste while actively restoring forests worldwide.',
  },
  {
    question: 'Can I send a Valentine card on Valentine\'s Day itself?',
    answer: 'Yes! Our instant email delivery means you can send cards right up until midnight on Valentine\'s Day. No shipping delays or cutoff dates. Perfect for last-minute Valentine shoppers or when you realize you forgot to send a card.',
  },
  {
    question: 'Can I personalize my card with photos or custom designs?',
    answer: 'Absolutely! You can add your own personalized message to any card. While our cards come with beautiful pre-designed animations, you can make them truly unique with your heartfelt message, recipient name, and special details.',
  },
  {
    question: 'When will my card be delivered?',
    answer: 'Cards are delivered instantly via email as soon as you complete your purchase. You can also schedule delivery for a future date and time if you want your Valentine to receive it at a specific moment.',
  },
  {
    question: 'Can I schedule delivery for a future date?',
    answer: 'Yes! You can schedule your card to be delivered at any future date and time. Perfect for planning ahead or making sure your Valentine wakes up to a special surprise on Valentine\'s morning.',
  },
  {
    question: 'What happens after I send a card?',
    answer: 'After sending, your recipient receives a beautiful email with your personalized message and the animated card. Meanwhile, we plant a real tree on your behalf and send you a certificate and tracking information so you can see the impact of your gift.',
  },
]

const FAQ = () => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.faq-heading',
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
        '.faq-item',
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.faq-list',
            start: 'top 85%',
          },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <section
      ref={sectionRef}
      className="py-20 lg:py-32 bg-gradient-to-b from-[#fff0f3] to-white"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="faq-heading text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full mb-4 shadow-sm">
            <HelpCircle className="w-4 h-4 text-[#e7000a]" />
            <span className="text-sm font-semibold text-[#e7000a]">Got Questions?</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 font-['Open_Sans']">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600">
            Everything you need to know about digital Valentine cards
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search FAQs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white rounded-xl border border-gray-200 focus:border-[#e7000a] focus:ring-2 focus:ring-[#e7000a]/20 outline-none transition-all duration-300"
          />
        </div>

        {/* FAQ List */}
        <div className="faq-list space-y-4">
          {filteredFaqs.map((faq, index) => (
            <div
              key={index}
              className="faq-item bg-white rounded-xl overflow-hidden card-shadow hover:card-shadow-hover transition-shadow duration-300"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between p-5 lg:p-6 text-left"
              >
                <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                    openIndex === index
                      ? 'bg-[#e7000a] text-white rotate-180'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {openIndex === index ? (
                    <Minus className="w-4 h-4" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                </div>
              </button>
              <div
                className={`overflow-hidden transition-all duration-500 ease-out ${
                  openIndex === index ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <div className="px-5 lg:px-6 pb-5 lg:pb-6">
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No results */}
        {filteredFaqs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No questions found matching your search.</p>
          </div>
        )}

        {/* Contact CTA */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">Still have questions?</p>
          <a
            href="#"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-full hover:bg-gray-200 transition-colors duration-300"
          >
            Contact Support
          </a>
        </div>
      </div>
    </section>
  )
}

export default FAQ
