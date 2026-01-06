import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Lock, Eye, UserCheck, Mail, ChevronRight } from 'lucide-react';

const sections = [
  { id: 'collection', title: 'Information We Collect', icon: Eye },
  { id: 'usage', title: 'How We Use Your Information', icon: UserCheck },
  { id: 'sharing', title: 'Information Sharing', icon: Lock },
  { id: 'security', title: 'Data Security', icon: Shield },
  { id: 'rights', title: 'Your Rights', icon: UserCheck },
  { id: 'contact', title: 'Contact Us', icon: Mail }
];

export default function Privacy() {
  const [activeSection, setActiveSection] = useState('collection');

  return (
    <div className="min-h-screen bg-stone-50 pt-24">
      {/* Hero */}
      <section className="bg-stone-900 py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Shield className="w-12 h-12 text-amber-400 mx-auto mb-4" />
            <h1 className="text-3xl md:text-4xl font-light text-white mb-2">Privacy Policy</h1>
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
                <h3 className="text-sm font-medium text-stone-500 px-3 mb-3 uppercase tracking-wider">Contents</h3>
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
              <h2>1. Information We Collect</h2>
              <p>
                We collect information you provide directly, including name, email address, 
                phone number, and payment information when you book appointments or purchase 
                services through our platform.
              </p>

              <h2>2. How We Use Your Information</h2>
              <p>We use your information to:</p>
              <ul>
                <li>Process and manage your bookings</li>
                <li>Send appointment reminders and confirmations</li>
                <li>Process payments securely</li>
                <li>Improve our services and customer experience</li>
                <li>Send promotional communications (with your consent)</li>
              </ul>

              <h2>3. Information Sharing</h2>
              <p>
                We do not sell your personal information. We may share information with 
                service providers who assist in our operations, always under strict 
                confidentiality agreements.
              </p>

              <h2>4. Data Security</h2>
              <p>
                We implement industry-standard security measures to protect your personal 
                information from unauthorized access, alteration, or disclosure.
              </p>

              <h2>5. Your Rights</h2>
              <p>You have the right to:</p>
              <ul>
                <li>Access your personal data</li>
                <li>Request correction of inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Opt-out of marketing communications</li>
              </ul>

              <h2>6. Cookies</h2>
              <p>
                We use cookies to enhance your browsing experience and analyze site traffic. 
                You can control cookie preferences through your browser settings.
              </p>

              <h2>7. Contact Us</h2>
              <p>
                For privacy-related inquiries, please contact us at privacy@hairy.com 
                or call +1 (555) 123-4567.
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