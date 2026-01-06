import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import GenderToggle from '@/components/ui/GenderToggle';
import { Button } from '@/components/ui/button';
import { Clock, ArrowRight } from 'lucide-react';
import { formatPrice } from '@/components/ui/CurrencySelector';

export default function ServicePreview() {
  const [gender, setGender] = useState('male');

  const { data: services = [] } = useQuery({
    queryKey: ['services'],
    queryFn: () => base44.entities.Service.filter({ is_active: true })
  });

  const filteredServices = services
    .filter(s => s.gender === gender || s.gender === 'unisex')
    .slice(0, 6);

  return (
    <section className="py-32 px-6 bg-stone-50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-light text-stone-900 mb-4 tracking-tight">
            Our Services
          </h2>
          <p className="text-stone-500 text-lg max-w-xl mx-auto mb-8">
            Curated experiences tailored to your unique style
          </p>
          <GenderToggle value={gender} onChange={setGender} />
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={gender}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredServices.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-500"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={service.image_url || `https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=800&auto=format`}
                    alt={service.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-stone-800 capitalize">
                      {service.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-medium text-stone-900 mb-2">{service.name}</h3>
                  <p className="text-stone-500 text-sm mb-4 line-clamp-2">{service.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-lg font-medium text-stone-900">
                        {formatPrice(service.price_usd)}
                      </span>
                      <span className="flex items-center text-stone-400 text-sm">
                        <Clock className="w-4 h-4 mr-1" />
                        {service.duration} min
                      </span>
                    </div>
                    <Link to={`${createPageUrl('Booking')}?service=${service.id}&gender=${gender}`}>
                      <Button size="sm" variant="ghost" className="text-amber-600 hover:text-amber-700 hover:bg-amber-50 group/btn">
                        Book
                        <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover/btn:translate-x-1" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link to={createPageUrl('Services')}>
            <Button variant="outline" className="rounded-full px-8 py-6 text-base border-stone-300 hover:bg-stone-900 hover:text-white hover:border-stone-900 transition-all duration-300">
              View All Services
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}