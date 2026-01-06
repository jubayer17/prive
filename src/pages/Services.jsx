import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import GenderToggle from '@/components/ui/GenderToggle';
import CurrencySelector, { formatPrice, getCurrencySymbol } from '@/components/ui/CurrencySelector';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, ArrowRight, Search, Sparkles } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const categories = [
  { id: 'all', name: 'All Services' },
  { id: 'haircut', name: 'Haircuts' },
  { id: 'styling', name: 'Styling' },
  { id: 'beard', name: 'Beard' },
  { id: 'color', name: 'Color' },
  { id: 'spa', name: 'Spa' },
  { id: 'treatment', name: 'Treatment' }
];

export default function Services() {
  const [gender, setGender] = useState('male');
  const [currency, setCurrency] = useState('USD');
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');

  const { data: services = [], isLoading } = useQuery({
    queryKey: ['services'],
    queryFn: () => base44.entities.Service.filter({ is_active: true })
  });

  const filteredServices = services.filter(s => {
    const genderMatch = s.gender === gender || s.gender === 'unisex';
    const categoryMatch = category === 'all' || s.category === category;
    const searchMatch = !search || s.name.toLowerCase().includes(search.toLowerCase()) || 
                       s.description?.toLowerCase().includes(search.toLowerCase());
    return genderMatch && categoryMatch && searchMatch;
  });

  const getPrice = (service) => {
    switch (currency) {
      case 'EUR': return service.price_eur || service.price_usd * 0.92;
      case 'GBP': return service.price_gbp || service.price_usd * 0.79;
      default: return service.price_usd;
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 pt-24">
      {/* Hero */}
      <section className="bg-stone-900 py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-light text-white mb-4">Our Services</h1>
            <p className="text-stone-400 text-lg max-w-xl mx-auto">
              Expert craftsmanship for your unique style
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="sticky top-20 z-30 bg-white/80 backdrop-blur-xl border-b border-stone-100 py-4 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <GenderToggle value={gender} onChange={setGender} />
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <Input
                  placeholder="Search services..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 w-48 md:w-64 h-10 rounded-full bg-stone-100 border-0"
                />
              </div>
            </div>
            <CurrencySelector value={currency} onChange={setCurrency} className="w-24" />
          </div>

          <div className="mt-4 overflow-x-auto scrollbar-hide">
            <Tabs value={category} onValueChange={setCategory}>
              <TabsList className="bg-stone-100 p-1 h-auto inline-flex">
                {categories.map(cat => (
                  <TabsTrigger 
                    key={cat.id} 
                    value={cat.id}
                    className="rounded-full px-4 py-2 text-sm data-[state=active]:bg-stone-900 data-[state=active]:text-white"
                  >
                    {cat.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-6">
                  <Skeleton className="h-48 rounded-xl mb-4" />
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-4" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={`${gender}-${category}-${search}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredServices.map((service, index) => (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -5 }}
                    className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 group"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={service.image_url || `https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=800`}
                        alt={service.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute top-4 right-4">
                        <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-stone-800 capitalize">
                          {service.category}
                        </span>
                      </div>
                      {service.gender === 'unisex' && (
                        <div className="absolute top-4 left-4">
                          <span className="px-2 py-1 bg-amber-500 rounded-full text-xs font-medium text-stone-900">
                            <Sparkles className="w-3 h-3 inline mr-1" />
                            Unisex
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-medium text-stone-900 mb-2">{service.name}</h3>
                      <p className="text-stone-500 text-sm mb-4 line-clamp-2">{service.description}</p>

                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <span className="text-2xl font-light text-stone-900">
                            {getCurrencySymbol(currency)}{getPrice(service).toFixed(0)}
                          </span>
                          <span className="flex items-center text-stone-400 text-sm">
                            <Clock className="w-4 h-4 mr-1" />
                            {service.duration} min
                          </span>
                        </div>
                      </div>

                      <Link to={`${createPageUrl('Booking')}?service=${service.id}&gender=${gender}`}>
                        <Button className="w-full bg-stone-900 hover:bg-stone-800 text-white rounded-xl group/btn">
                          Book Now
                          <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
                        </Button>
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          )}

          {!isLoading && filteredServices.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <p className="text-stone-500 text-lg">No services found matching your criteria</p>
              <Button 
                variant="outline" 
                onClick={() => { setCategory('all'); setSearch(''); }}
                className="mt-4 rounded-full"
              >
                Clear Filters
              </Button>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}