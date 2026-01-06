import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import CurrencySelector, { getCurrencySymbol } from '@/components/ui/CurrencySelector';
import PaymentModal from '@/components/payment/PaymentModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Check, Plus, Minus, Crown, Sparkles, Star, ArrowRight, Loader2 } from 'lucide-react';

const plans = [
  {
    id: 'essential',
    name: 'Essential',
    priceUSD: 49,
    priceEUR: 45,
    priceGBP: 39,
    icon: Star,
    description: 'Perfect for regular grooming maintenance',
    features: [
      '2 Haircuts per month',
      'Basic styling consultation',
      '10% off all products',
      'Online booking priority',
      'Digital loyalty rewards'
    ],
    addonsAvailable: true
  },
  {
    id: 'premium',
    name: 'Premium',
    priceUSD: 99,
    priceEUR: 92,
    priceGBP: 79,
    icon: Sparkles,
    description: 'For the style-conscious individual',
    features: [
      '4 Haircuts per month',
      'Beard grooming included',
      '20% off all products',
      'Priority booking slots',
      'Free hair consultation',
      'Hot towel service',
      'Scalp massage with cuts'
    ],
    addonsAvailable: true,
    popular: true
  },
  {
    id: 'elite',
    name: 'Elite',
    priceUSD: 199,
    priceEUR: 185,
    priceGBP: 159,
    icon: Crown,
    description: 'The complete luxury experience',
    features: [
      'Unlimited haircuts',
      'All treatments included',
      '30% off all products',
      'VIP booking anytime',
      'Monthly spa treatment',
      'Exclusive member events',
      'Personal style consultant',
      'Premium beverages',
      'Complimentary parking'
    ],
    addonsAvailable: false
  }
];

const addons = [
  { id: 'beard', name: 'Beard Care Package', priceUSD: 25, priceEUR: 23, priceGBP: 20, description: 'Monthly beard treatment & trim' },
  { id: 'spa', name: 'Hair Spa Treatment', priceUSD: 35, priceEUR: 32, priceGBP: 28, description: 'Deep conditioning & scalp therapy' },
  { id: 'priority', name: 'Priority Booking', priceUSD: 15, priceEUR: 14, priceGBP: 12, description: 'Same-day booking guarantee' },
  { id: 'consultation', name: 'Style Consultation', priceUSD: 20, priceEUR: 18, priceGBP: 16, description: 'Monthly style advisory session' }
];

export default function Memberships() {
  const [currency, setCurrency] = useState('USD');
  const [selectedPlan, setSelectedPlan] = useState('premium');
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [email, setEmail] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [pendingMembershipData, setPendingMembershipData] = useState(null);

  const queryClient = useQueryClient();
  const currentPlan = plans.find(p => p.id === selectedPlan);

  const getPrice = (item) => {
    switch (currency) {
      case 'EUR': return item.priceEUR;
      case 'GBP': return item.priceGBP;
      default: return item.priceUSD;
    }
  };

  const totalPrice = () => {
    const planPrice = getPrice(currentPlan);
    const addonsPrice = currentPlan.addonsAvailable 
      ? selectedAddons.reduce((sum, id) => {
          const addon = addons.find(a => a.id === id);
          return sum + (addon ? getPrice(addon) : 0);
        }, 0)
      : 0;
    return planPrice + addonsPrice;
  };

  const toggleAddon = (addonId) => {
    if (!currentPlan.addonsAvailable) return;
    setSelectedAddons(prev =>
      prev.includes(addonId)
        ? prev.filter(id => id !== addonId)
        : [...prev, addonId]
    );
  };

  const handleCheckout = () => {
    if (!email) return;

    const membershipData = {
      user_email: email,
      plan: selectedPlan,
      addons: currentPlan.addonsAvailable ? selectedAddons : [],
      price_monthly: totalPrice(),
      currency,
      start_date: new Date().toISOString().split('T')[0],
      status: 'pending'
    };

    setPendingMembershipData(membershipData);
    setShowCheckout(false);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = async () => {
    if (!pendingMembershipData) return;

    await base44.entities.Membership.create({
      ...pendingMembershipData,
      status: 'active'
    });

    queryClient.invalidateQueries(['memberships']);
    setSelectedPlan('premium');
    setSelectedAddons([]);
    setEmail('');
    setPendingMembershipData(null);
  };

  return (
    <div className="min-h-screen bg-stone-50 pt-24">
      {/* Hero */}
      <section className="bg-stone-900 py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-5xl font-light text-white mb-4">Membership Plans</h1>
            <p className="text-stone-400 text-lg max-w-xl mx-auto">
              Elevate your grooming routine with exclusive benefits
            </p>
          </motion.div>
        </div>
      </section>

      {/* Currency */}
      <div className="max-w-7xl mx-auto px-6 py-6 flex justify-end">
        <CurrencySelector value={currency} onChange={setCurrency} className="w-28" />
      </div>

      {/* Plans */}
      <section className="px-6 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {plans.map((plan, index) => {
              const Icon = plan.icon;
              const isSelected = selectedPlan === plan.id;

              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => {
                    setSelectedPlan(plan.id);
                    if (!plan.addonsAvailable) setSelectedAddons([]);
                  }}
                  className={`relative rounded-3xl cursor-pointer transition-all duration-500 ${
                    isSelected
                      ? 'bg-stone-900 text-white shadow-2xl scale-[1.02]'
                      : 'bg-white hover:shadow-xl'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                      <span className="px-4 py-1.5 bg-amber-500 text-stone-900 text-xs font-semibold rounded-full">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="p-8">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${
                      isSelected ? 'bg-amber-500' : 'bg-stone-100'
                    }`}>
                      <Icon className={`w-7 h-7 ${isSelected ? 'text-stone-900' : 'text-stone-600'}`} />
                    </div>

                    <h3 className="text-2xl font-medium mb-2">{plan.name}</h3>
                    <p className={`text-sm mb-6 ${isSelected ? 'text-stone-400' : 'text-stone-500'}`}>
                      {plan.description}
                    </p>

                    <div className="flex items-baseline gap-1 mb-8">
                      <span className="text-5xl font-light">{getCurrencySymbol(currency)}{getPrice(plan)}</span>
                      <span className={`text-base ${isSelected ? 'text-stone-400' : 'text-stone-500'}`}>/month</span>
                    </div>

                    <div className="space-y-4 mb-8">
                      {plan.features.map((feature, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                            isSelected ? 'bg-amber-500/20' : 'bg-stone-100'
                          }`}>
                            <Check className={`w-3 h-3 ${isSelected ? 'text-amber-400' : 'text-stone-600'}`} />
                          </div>
                          <span className={`text-sm ${isSelected ? 'text-stone-300' : 'text-stone-600'}`}>
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>

                    {isSelected && (
                      <Button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowCheckout(true);
                        }}
                        className="w-full bg-amber-500 hover:bg-amber-400 text-stone-900 rounded-xl py-6"
                      >
                        Get Started
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Add-ons Section */}
          <AnimatePresence>
            {currentPlan?.addonsAvailable && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-16"
              >
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-light text-stone-900 mb-2">Enhance Your Plan</h2>
                  <p className="text-stone-500">Add premium services to your membership</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {addons.map(addon => {
                    const isAdded = selectedAddons.includes(addon.id);
                    return (
                      <motion.div
                        key={addon.id}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => toggleAddon(addon.id)}
                        className={`p-6 rounded-2xl cursor-pointer transition-all ${
                          isAdded 
                            ? 'bg-stone-900 text-white' 
                            : 'bg-white hover:shadow-lg'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <h4 className="font-medium">{addon.name}</h4>
                          <button className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            isAdded ? 'bg-amber-500' : 'bg-stone-100'
                          }`}>
                            {isAdded ? (
                              <Minus className="w-4 h-4 text-stone-900" />
                            ) : (
                              <Plus className="w-4 h-4 text-stone-600" />
                            )}
                          </button>
                        </div>
                        <p className={`text-sm mb-3 ${isAdded ? 'text-stone-400' : 'text-stone-500'}`}>
                          {addon.description}
                        </p>
                        <p className={`text-lg font-light ${isAdded ? 'text-amber-400' : 'text-stone-900'}`}>
                          +{getCurrencySymbol(currency)}{getPrice(addon)}/mo
                        </p>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Total */}
          {selectedAddons.length > 0 && currentPlan?.addonsAvailable && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-12 p-8 bg-stone-900 rounded-3xl text-white text-center"
            >
              <p className="text-stone-400 mb-2">Your monthly total</p>
              <p className="text-5xl font-light mb-4">
                {getCurrencySymbol(currency)}{totalPrice()}
                <span className="text-lg text-stone-400">/month</span>
              </p>
              <Button 
                onClick={() => setShowCheckout(true)}
                className="bg-amber-500 hover:bg-amber-400 text-stone-900 rounded-full px-8 py-6"
              >
                Start Membership
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
          )}

          {!currentPlan?.addonsAvailable && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-12 text-center"
            >
              <p className="text-stone-500 mb-4">
                ✨ Elite plan includes all add-ons at no extra cost
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Checkout Modal */}
      <AnimatePresence>
        {showCheckout && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            onClick={() => setShowCheckout(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-8 max-w-md w-full"
            >
              <h3 className="text-2xl font-medium text-stone-900 mb-6">Start Your Membership</h3>

              <div className="bg-stone-50 rounded-2xl p-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-stone-600">{currentPlan?.name} Plan</span>
                  <span className="font-medium">{getCurrencySymbol(currency)}{getPrice(currentPlan)}</span>
                </div>
                {selectedAddons.map(id => {
                  const addon = addons.find(a => a.id === id);
                  return addon && (
                    <div key={id} className="flex justify-between items-center text-sm text-stone-500">
                      <span>+ {addon.name}</span>
                      <span>{getCurrencySymbol(currency)}{getPrice(addon)}</span>
                    </div>
                  );
                })}
                <div className="border-t border-stone-200 mt-3 pt-3 flex justify-between items-center">
                  <span className="font-medium text-stone-900">Monthly Total</span>
                  <span className="text-xl font-medium text-stone-900">{getCurrencySymbol(currency)}{totalPrice()}</span>
                </div>
              </div>

              <div className="mb-6">
                <Label htmlFor="email" className="text-stone-600">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 h-12 rounded-xl"
                />
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowCheckout(false)}
                  className="flex-1 rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCheckout}
                  disabled={!email}
                  className="flex-1 bg-stone-900 hover:bg-stone-800 text-white rounded-xl"
                >
                  Continue to Payment
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <PaymentModal
        open={showPaymentModal}
        onClose={() => {
          setShowPaymentModal(false);
          setPendingMembershipData(null);
        }}
        amount={totalPrice()}
        currency={currency}
        type="membership"
        referenceId={null}
        allowPartial={false}
        onSuccess={handlePaymentSuccess}
        metadata={{
          plan: currentPlan?.name,
          addons: selectedAddons
        }}
      />
    </div>
  );
}