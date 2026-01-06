import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { createPageUrl } from '@/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Instagram, Facebook, Twitter, Youtube, MapPin, Phone, Mail, ArrowRight, Loader2 } from 'lucide-react';

const footerLinks = {
  services: [
    { name: 'Haircuts', page: 'Services' },
    { name: 'Beard Grooming', page: 'Services' },
    { name: 'Hair Coloring', page: 'Services' },
    { name: 'Spa Treatments', page: 'Services' }
  ],
  company: [
    { name: 'About Us', page: 'About' },
    { name: 'Our Team', page: 'Barbers' },
    { name: 'Blog', page: 'Blog' },
    { name: 'Contact', page: 'Contact' }
  ],
  support: [
    { name: 'FAQ', page: 'FAQ' },
    { name: 'Privacy Policy', page: 'Privacy' },
    { name: 'Terms of Service', page: 'Terms' },
    { name: 'Reviews', page: 'Reviews' }
  ]
};

const socials = [
  { icon: Instagram, href: '#' },
  { icon: Facebook, href: '#' },
  { icon: Twitter, href: '#' },
  { icon: Youtube, href: '#' }
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubscribed(true);
      setEmail('');
    }, 1000);
  };

  return (
    <footer className="bg-stone-950 text-white">
      {/* Newsletter Section */}
      <div className="border-b border-stone-800">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl md:text-3xl font-light mb-3">Stay in the Loop</h3>
              <p className="text-stone-400">
                Get exclusive offers, style tips, and updates delivered to your inbox.
              </p>
            </div>
            <form onSubmit={handleSubscribe} className="flex gap-3">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-stone-900 border-stone-700 text-white placeholder:text-stone-500 h-12 rounded-full px-6 flex-1"
                required
              />
              <Button
                type="submit"
                disabled={loading || subscribed}
                className="bg-amber-500 hover:bg-amber-400 text-stone-900 px-8 h-12 rounded-full"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : subscribed ? (
                  'Subscribed!'
                ) : (
                  <>
                    Subscribe
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <Link to={createPageUrl('Home')}>
              <h2 className="text-2xl font-medium mb-4">Prive</h2>
            </Link>
            <p className="text-stone-400 text-sm mb-6 leading-relaxed">
              Premium grooming experience since 2020. Where precision meets luxury.
            </p>
            <div className="flex gap-3">
              {socials.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    className="w-10 h-10 bg-stone-900 rounded-full flex items-center justify-center hover:bg-amber-500 hover:text-stone-900 transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-medium mb-4 text-sm uppercase tracking-wider">Services</h4>
            <ul className="space-y-3">
              {footerLinks.services.map(link => (
                <li key={link.name}>
                  <Link
                    to={createPageUrl(link.page)}
                    className="text-stone-400 hover:text-white text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-medium mb-4 text-sm uppercase tracking-wider">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map(link => (
                <li key={link.name}>
                  <Link
                    to={createPageUrl(link.page)}
                    className="text-stone-400 hover:text-white text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-medium mb-4 text-sm uppercase tracking-wider">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map(link => (
                <li key={link.name}>
                  <Link
                    to={createPageUrl(link.page)}
                    className="text-stone-400 hover:text-white text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-medium mb-4 text-sm uppercase tracking-wider">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-stone-400 text-sm">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>123 Style Street, Fashion District, NY 10001</span>
              </li>
              <li className="flex items-center gap-3 text-stone-400 text-sm">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3 text-stone-400 text-sm">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span>hello@prive.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-stone-800">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 text-stone-500 text-sm">
              <p>© 2026 Prive. All rights reserved.</p>
              <span className="hidden md:inline">•</span>
              <p>
                Developed by{' '}
                <a 
                  href="https://geekssort.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-amber-400 hover:text-amber-300 transition-colors font-medium"
                >
                  GeekSSort
                </a>
              </p>
            </div>
            <div className="flex gap-6">
              <Link to={createPageUrl('Privacy')} className="text-stone-500 hover:text-white text-sm transition-colors">
                Privacy
              </Link>
              <Link to={createPageUrl('Terms')} className="text-stone-500 hover:text-white text-sm transition-colors">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}