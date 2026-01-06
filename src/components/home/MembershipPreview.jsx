import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { createPageUrl } from '@/utils';
import { Check, Plus, Sparkles, Crown, Star } from 'lucide-react';

const plans = [
  {
    id: 'essential',
    name: 'Essential',
    price: 49,
    icon: Star,
    description: 'Perfect for regular grooming',
    features: [
      '2 Haircuts per month',
      'Basic styling',
      '10% off products',
      'Online booking priority'
    ],
    addonsAvailable: true,
    color: 'stone'
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 99,
    icon: Sparkles,
    description: 'For the style-conscious',
    features: [
      '4 Haircuts per month',
      'Beard grooming included',
      '20% off products',
      'Priority booking',
      'Free hair consultation'
    ],
    addonsAvailable: true,
    popular: true,
    color: 'amber'
  },
  {
    id: 'elite',
    name: 'Elite',
    price: 199,
    icon: Crown,
    description: 'The complete luxury experience',
    features: [
      'Unlimited haircuts',
      'All treatments included',
      '30% off products',
      'VIP booking',
      'Monthly spa treatment',
      'Exclusive member events',
      'Personal stylist'
    ],
    addonsAvailable: false,
    color: 'stone'
  }
];

const addons = [
  { id: 'beard', name: 'Beard Care Package', price: 25 },
  { id: 'spa', name: 'Hair Spa Treatment', price: 35 },
  { id: 'priority', name: 'Priority Booking', price: 15 },
  { id: 'consultation', name: 'Free Consultation', price: 20 }
];

export default function MembershipPreview() {
  const [selectedPlan, setSelectedPlan] = useState('premium');
  const [selectedAddons, setSelectedAddons] = useState([]);

  const currentPlan = plans.find(p => p.id === selectedPlan);
  const totalAddonsPrice = selectedAddons.reduce((sum, id) => {
    const addon = addons.find(a => a.id === id);
    return sum + (addon?.price || 0);
  }, 0);

  const toggleAddon = (addonId) => {
    setSelectedAddons(prev =>
      prev.includes(addonId)
        ? prev.filter(id => id !== addonId)
        : [...prev, addonId]
    );
  };

  return (
    <section className="py-32 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-light text-stone-900 mb-4 tracking-tight">
            Membership Plans
          </h2>
          <p className="text-stone-500 text-lg max-w-xl mx-auto">
            Elevate your grooming routine with exclusive benefits
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            const isSelected = selectedPlan === plan.id;

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onClick={() => {
                  setSelectedPlan(plan.id);
                  if (!plan.addonsAvailable) setSelectedAddons([]);
                }}
                className={`relative rounded-3xl p-8 cursor-pointer transition-all duration-500 ${
                  isSelected
                    ? 'bg-stone-900 text-white shadow-2xl scale-[1.02]'
                    : 'bg-stone-50 text-stone-900 hover:bg-stone-100'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1.5 bg-amber-500 text-stone-900 text-xs font-semibold rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${
                  isSelected ? 'bg-amber-500' : 'bg-stone-200'
                }`}>
                  <Icon className={`w-6 h-6 ${isSelected ? 'text-stone-900' : 'text-stone-600'}`} />
                </div>

                <h3 className="text-2xl font-medium mb-2">{plan.name}</h3>
                <p className={`text-sm mb-6 ${isSelected ? 'text-stone-400' : 'text-stone-500'}`}>
                  {plan.description}
                </p>

                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-4xl font-light">${plan.price}</span>
                  <span className={`text-sm ${isSelected ? 'text-stone-400' : 'text-stone-500'}`}>/month</span>
                </div>

                <div className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                        isSelected ? 'bg-amber-500/20' : 'bg-stone-200'
                      }`}>
                        <Check className={`w-3 h-3 ${isSelected ? 'text-amber-400' : 'text-stone-600'}`} />
                      </div>
                      <span className={`text-sm ${isSelected ? 'text-stone-300' : 'text-stone-600'}`}>
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                {plan.addonsAvailable && isSelected && (
                  <div className={`pt-6 border-t ${isSelected ? 'border-stone-700' : 'border-stone-200'}`}>
                    <p className="text-xs uppercase tracking-wider text-stone-400 mb-4">Available Add-ons</p>
                    <div className="space-y-2">
                      {addons.map(addon => (
                        <button
                          key={addon.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleAddon(addon.id);
                          }}
                          className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors ${
                            selectedAddons.includes(addon.id)
                              ? 'bg-amber-500/20 border border-amber-500/30'
                              : 'bg-stone-800 hover:bg-stone-700'
                          }`}
                        >
                          <span className="text-sm">{addon.name}</span>
                          <span className="text-sm text-stone-400">+${addon.price}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {!plan.addonsAvailable && isSelected && (
                  <div className="pt-6 border-t border-stone-700">
                    <p className="text-sm text-amber-400">
                      ✨ All add-ons included
                    </p>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        <AnimatePresence>
          {selectedAddons.length > 0 && currentPlan?.addonsAvailable && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mt-8 p-6 bg-stone-900 rounded-2xl text-white text-center"
            >
              <p className="text-stone-400 mb-2">Your monthly total</p>
              <p className="text-3xl font-light">
                ${currentPlan.price + totalAddonsPrice}
                <span className="text-lg text-stone-400">/month</span>
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link to={createPageUrl('Memberships')}>
            <Button className="bg-stone-900 hover:bg-stone-800 text-white px-8 py-6 text-base rounded-full">
              Start Your Membership
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}