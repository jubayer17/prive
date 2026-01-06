import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import GenderToggle from '@/components/ui/GenderToggle';
import { Button } from '@/components/ui/button';
import { Star, Calendar, Award, ArrowRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function Barbers() {
  const [gender, setGender] = useState('male');

  const { data: barbers = [], isLoading } = useQuery({
    queryKey: ['barbers'],
    queryFn: () => base44.entities.Barber.filter({ is_active: true })
  });

  const filteredBarbers = barbers.filter(b => {
    if (gender === 'male') {
      return b.serves_gender === 'male' || b.serves_gender === 'both';
    } else if (gender === 'female') {
      return b.serves_gender === 'female' || b.serves_gender === 'both';
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-white pt-24">
      {/* Hero */}
      <section className="bg-stone-900 py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-5xl font-light text-white mb-4">Our Team</h1>
            <p className="text-stone-400 text-lg max-w-xl mx-auto">
              Master stylists dedicated to perfecting your look
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter */}
      <section className="py-8 px-6 border-b border-stone-100">
        <div className="max-w-7xl mx-auto flex justify-center">
          <GenderToggle value={gender} onChange={setGender} />
        </div>
      </section>

      {/* Team Grid */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="text-center">
                  <Skeleton className="w-48 h-48 rounded-full mx-auto mb-6" />
                  <Skeleton className="h-6 w-32 mx-auto mb-2" />
                  <Skeleton className="h-4 w-24 mx-auto" />
                </div>
              ))}
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={gender}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {filteredBarbers.map((barber, index) => (
                  <motion.div
                    key={barber.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group"
                  >
                    <div className="relative mb-6">
                      <motion.div 
                        whileHover={{ scale: 1.02 }}
                        className="relative w-64 h-64 mx-auto rounded-full overflow-hidden"
                      >
                        <img
                          src={barber.photo_url || `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400`}
                          alt={barber.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-stone-900/0 group-hover:bg-stone-900/20 transition-colors duration-300" />
                      </motion.div>

                      {/* Rating badge */}
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                        <div className="flex items-center gap-1 px-3 py-1.5 bg-white rounded-full shadow-lg">
                          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                          <span className="font-medium text-sm">{barber.rating?.toFixed(1) || '5.0'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-center">
                      <h3 className="text-xl font-medium text-stone-900 mb-1">{barber.name}</h3>
                      
                      <div className="flex items-center justify-center gap-2 text-stone-500 text-sm mb-3">
                        <Award className="w-4 h-4" />
                        <span>{barber.experience_years || 5}+ years experience</span>
                      </div>

                      {barber.specialty && barber.specialty.length > 0 && (
                        <div className="flex flex-wrap justify-center gap-2 mb-4">
                          {barber.specialty.slice(0, 3).map((spec, i) => (
                            <span 
                              key={i}
                              className="px-3 py-1 bg-stone-100 rounded-full text-xs text-stone-600"
                            >
                              {spec}
                            </span>
                          ))}
                        </div>
                      )}

                      <p className="text-stone-500 text-sm mb-6 line-clamp-2 px-4">
                        {barber.bio || 'Passionate about creating the perfect look for every client.'}
                      </p>

                      <div className="flex flex-col gap-2">
                        <Link to={`${createPageUrl('BarberCalendar')}?barber=${barber.id}`} className="w-full">
                          <Button className="w-full bg-amber-500 hover:bg-amber-400 text-stone-900 rounded-full">
                            <Calendar className="w-4 h-4 mr-2" />
                            View Calendar
                          </Button>
                        </Link>
                        <div className="flex gap-2">
                          <Link to={`${createPageUrl('BarberProfile')}?id=${barber.id}`} className="flex-1">
                            <Button variant="outline" className="w-full rounded-full border-stone-200 text-sm">
                              Profile
                            </Button>
                          </Link>
                          <Link to={`${createPageUrl('Booking')}?barber=${barber.id}&gender=${gender}`} className="flex-1">
                            <Button className="w-full bg-stone-900 hover:bg-stone-800 text-white rounded-full text-sm">
                              Quick Book
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          )}

          {!isLoading && filteredBarbers.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <p className="text-stone-500 text-lg">No stylists found for this category</p>
            </motion.div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-stone-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-light text-stone-900 mb-4">
            Join Our Team of Experts
          </h2>
          <p className="text-stone-500 mb-8">
            Are you a passionate stylist looking for a new opportunity?
          </p>
          <Button variant="outline" className="rounded-full px-8 py-6 text-base border-stone-300">
            View Careers
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>
    </div>
  );
}