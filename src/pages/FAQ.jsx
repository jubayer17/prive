import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronDown, HelpCircle, Search, MessageCircle } from 'lucide-react';

const faqs = [
  {
    category: 'Booking',
    questions: [
      {
        q: 'How do I book an appointment?',
        a: 'You can book online through our website by clicking "Book Now" and following the simple steps to select your service, stylist, and preferred time. You can also call us directly or visit the salon.'
      },
      {
        q: 'Can I request a specific stylist?',
        a: 'Absolutely! When booking, you can choose your preferred stylist. We recommend booking in advance for popular stylists as their slots fill up quickly.'
      },
      {
        q: 'What is your cancellation policy?',
        a: 'We kindly ask for at least 24 hours notice for cancellations. Late cancellations or no-shows may be subject to a fee.'
      },
      {
        q: 'Do you accept walk-ins?',
        a: 'While we welcome walk-ins, we recommend booking in advance to ensure availability, especially during peak hours and weekends.'
      }
    ]
  },
  {
    category: 'Services',
    questions: [
      {
        q: 'What services do you offer?',
        a: 'We offer a full range of grooming services including haircuts, fades, beard grooming, hot towel shaves, hair coloring, balayage, keratin treatments, and spa treatments for both men and women.'
      },
      {
        q: 'How long does a typical appointment take?',
        a: 'Service times vary: haircuts typically take 45-60 minutes, color services 2-3 hours, and treatments 1-2 hours. Specific durations are shown when booking.'
      },
      {
        q: 'Do you offer consultations?',
        a: 'Yes! We offer complimentary consultations for color services and major style changes. This helps us understand your goals and provide accurate pricing.'
      }
    ]
  },
  {
    category: 'Memberships',
    questions: [
      {
        q: 'What are the membership benefits?',
        a: 'Members enjoy discounted services, priority booking, exclusive add-ons, product discounts, and more. Our Elite members get unlimited services and VIP perks.'
      },
      {
        q: 'Can I upgrade my membership?',
        a: 'Yes, you can upgrade your membership at any time. The difference will be prorated for the remaining billing period.'
      },
      {
        q: 'How do I cancel my membership?',
        a: 'You can cancel your membership anytime through your account dashboard or by contacting us. Cancellations take effect at the end of your billing cycle.'
      }
    ]
  },
  {
    category: 'Gift Cards',
    questions: [
      {
        q: 'Do gift cards expire?',
        a: 'Gift cards are valid for one year from the date of purchase and can be used for any service or product.'
      },
      {
        q: 'Can gift cards be used for memberships?',
        a: 'Gift cards can be applied toward membership fees or individual services - whatever the recipient prefers.'
      },
      {
        q: 'What if my service costs more than my gift card balance?',
        a: 'No problem! You can pay the difference using any of our accepted payment methods.'
      }
    ]
  }
];

export default function FAQ() {
  const [openItems, setOpenItems] = useState({});
  const [searchQuery, setSearchQuery] = useState('');

  const toggleItem = (categoryIndex, questionIndex) => {
    const key = `${categoryIndex}-${questionIndex}`;
    setOpenItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const filteredFaqs = faqs.map(category => ({
    ...category,
    questions: category.questions.filter(q =>
      q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <div className="min-h-screen bg-stone-50 pt-24">
      {/* Hero */}
      <section className="bg-stone-900 py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="w-16 h-16 bg-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <HelpCircle className="w-8 h-8 text-stone-900" />
            </div>
            <h1 className="text-4xl md:text-5xl font-light text-white mb-4">FAQ</h1>
            <p className="text-stone-400 text-lg">
              Find answers to common questions
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search */}
      <section className="py-8 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
            <Input
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 rounded-full border-stone-200 bg-white shadow-sm"
            />
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-8 px-6">
        <div className="max-w-3xl mx-auto">
          {filteredFaqs.length === 0 && searchQuery ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <p className="text-stone-500 mb-4">No questions found matching "{searchQuery}"</p>
              <Button onClick={() => setSearchQuery('')} variant="outline" className="rounded-full">
                Clear Search
              </Button>
            </motion.div>
          ) : (
            filteredFaqs.map((category, catIndex) => (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: catIndex * 0.1 }}
              className="mb-12"
            >
              <h2 className="text-xl font-medium text-stone-900 mb-6">{category.category}</h2>
              <div className="space-y-3">
                {category.questions.map((item, qIndex) => {
                  const key = `${catIndex}-${qIndex}`;
                  const isOpen = openItems[key];

                  return (
                    <div
                      key={qIndex}
                      className="bg-white rounded-2xl overflow-hidden shadow-sm"
                    >
                      <button
                        onClick={() => toggleItem(catIndex, qIndex)}
                        className="w-full flex items-center justify-between p-6 text-left hover:bg-stone-50 transition-colors rounded-2xl"
                      >
                        <span className="font-medium text-stone-900 pr-4">{item.q}</span>
                        <motion.div
                          animate={{ rotate: isOpen ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            isOpen ? 'bg-stone-900' : 'bg-stone-100'
                          }`}
                        >
                          <ChevronDown className={`w-5 h-5 flex-shrink-0 ${
                            isOpen ? 'text-white' : 'text-stone-400'
                          }`} />
                        </motion.div>
                      </button>
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <div className="px-6 pb-6">
                              <p className="text-stone-600 leading-relaxed">{item.a}</p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ))
          )}

          {/* Still Have Questions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16"
          >
            <div className="bg-white rounded-3xl shadow-lg p-8 text-center">
              <MessageCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-stone-900 mb-3">Still Have Questions?</h3>
              <p className="text-stone-500 mb-6">
                Our team is here to help. Contact us for personalized assistance.
              </p>
              <Link to={createPageUrl('Contact')}>
                <Button className="bg-stone-900 hover:bg-stone-800 text-white rounded-full px-8">
                  Contact Us
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}