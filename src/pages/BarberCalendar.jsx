import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Star, Clock } from 'lucide-react';
import BarberCalendarView from '@/components/barber/BarberCalendarView';

export default function BarberCalendar() {
  const params = new URLSearchParams(window.location.search);
  const barberId = params.get('barber');

  const { data: barber, isLoading } = useQuery({
    queryKey: ['barber', barberId],
    queryFn: async () => {
      const barbers = await base44.entities.Barber.filter({ id: barberId });
      return barbers[0];
    },
    enabled: !!barberId
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-50 pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="animate-pulse space-y-8">
            <div className="h-12 bg-stone-200 rounded-xl w-64" />
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="h-96 bg-stone-200 rounded-2xl" />
              <div className="h-96 bg-stone-200 rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!barber) {
    return (
      <div className="min-h-screen bg-stone-50 pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-stone-500 mb-6">Stylist not found</p>
          <Link to={createPageUrl('Barbers')}>
            <Button variant="outline">Back to Our Team</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-6">
        {/* Back Button */}
        <Link to={createPageUrl('Barbers')}>
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Our Team
          </Button>
        </Link>

        {/* Barber Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-8 mb-8 shadow-lg"
        >
          <div className="flex items-center gap-6">
            <img
              src={barber.photo_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200'}
              alt={barber.name}
              className="w-24 h-24 rounded-2xl object-cover"
            />
            <div className="flex-1">
              <h1 className="text-3xl font-medium text-stone-900 mb-2">{barber.name}</h1>
              <div className="flex items-center gap-4 text-sm text-stone-600">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{barber.rating?.toFixed(1) || '5.0'} Rating</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{barber.experience_years || 5}+ Years Experience</span>
                </div>
              </div>
              {barber.specialty && barber.specialty.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {barber.specialty.map((spec, i) => (
                    <span key={i} className="px-3 py-1 bg-stone-100 text-stone-700 text-xs rounded-full">
                      {spec}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Calendar Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="w-6 h-6 text-stone-600" />
            <h2 className="text-2xl font-medium text-stone-900">Book an Appointment</h2>
          </div>
          <p className="text-stone-500">
            Select a date and time to book with {barber.name}
          </p>
        </motion.div>

        {/* Calendar Component */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <BarberCalendarView barber={barber} />
        </motion.div>
      </div>
    </div>
  );
}