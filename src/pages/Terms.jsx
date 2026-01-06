import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, BookOpen, CreditCard, Calendar, Gift, Scale, AlertCircle, Mail, ChevronRight } from 'lucide-react';

const sections = [
  { id: 'acceptance', title: 'Acceptance of Terms', icon: BookOpen },
  { id: 'booking', title: 'Booking & Appointments', icon: Calendar },
  { id: 'payment', title: 'Payment Terms', icon: CreditCard },
  { id: 'membership', title: 'Membership Terms', icon: Scale },
  { id: 'giftcards', title: 'Gift Cards', icon: Gift },
  { id: 'liability', title: 'Limitation of Liability', icon: AlertCircle },
  { id: 'contact', title: 'Contact', icon: Mail }
];

export default function Terms() {
  const [activeSection, setActiveSection] = useState('acceptance');

  return (
    <div className="min-h-screen bg-stone-50 pt-24">
      {/* Hero */}
      <section className="bg-stone-900 py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <FileText className="w-12 h-12 text-amber-400 mx-auto mb-4" />
            <h1 className="text-3xl md:text-4xl font-light text-white mb-2">Terms of Service</h1>
            <p className="text-stone-400">Last updated: January 2024</p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Navigation Sidebar */}
            <div className="lg:sticky lg:top-32 h-fit">
              <div className="bg-white rounded-2xl shadow-sm p-4">
                <h3 className="text-sm font-medium text-stone-500 px-3 mb-3 uppercase tracking-wider">Sections</h3>
                <nav className="space-y-1">
                  {sections.map((section) => {
                    const Icon = section.icon;
                    const isActive = activeSection === section.id;
                    return (
                      <button
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                        className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all ${
                          isActive 
                            ? 'bg-stone-900 text-white' 
                            : 'text-stone-600 hover:bg-stone-50'
                        }`}
                      >
                        <Icon className="w-4 h-4 flex-shrink-0" />
                        <span className="text-sm font-medium">{section.title}</span>
                        {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>

            {/* Content */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
                <div className="prose prose-stone max-w-none">
              <h2>1. Acceptance of Terms</h2>
              <p>
                By accessing or using Hairy's services, you agree to be bound by these Terms 
                of Service. If you do not agree to these terms, please do not use our services.
              </p>

              <h2>2. Booking and Appointments</h2>
              <p>
                All bookings are subject to availability. We reserve the right to refuse 
                service at our discretion. Cancellations must be made at least 24 hours 
                in advance to avoid fees.
              </p>

              <h2>3. Payment Terms</h2>
              <p>
                Payment is due at the time of service unless otherwise arranged. We accept 
                major credit cards, gift cards, and membership credits. Prices are subject 
                to change without notice.
              </p>

              <h2>4. Membership Terms</h2>
              <ul>
                <li>Memberships are non-transferable</li>
                <li>Monthly services do not roll over</li>
                <li>Cancellation requires 30 days notice</li>
                <li>Benefits are subject to the plan selected</li>
              </ul>

              <h2>5. Gift Cards</h2>
              <p>
                Gift cards are valid for one year from purchase date. Lost or stolen cards 
                cannot be replaced. Gift cards cannot be exchanged for cash.
              </p>

              <h2>6. Limitation of Liability</h2>
              <p>
                Hairy is not liable for any indirect, incidental, or consequential damages 
                arising from the use of our services. Our total liability shall not exceed 
                the amount paid for the specific service in question.
              </p>

              <h2>7. Intellectual Property</h2>
              <p>
                All content on our website and platforms is owned by Hairy and protected 
                by copyright laws. Unauthorized use is prohibited.
              </p>

              <h2>8. Changes to Terms</h2>
              <p>
                We reserve the right to modify these terms at any time. Continued use of 
                our services after changes constitutes acceptance of the new terms.
              </p>

              <h2>9. Contact</h2>
              <p>
                Questions about these terms should be directed to legal@hairy.com 
                or +1 (555) 123-4567.
              </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}