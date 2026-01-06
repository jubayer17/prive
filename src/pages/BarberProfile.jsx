import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Calendar, Award, MapPin, Clock, ArrowLeft, Heart } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function BarberProfile() {
  const params = new URLSearchParams(window.location.search);
  const barberId = params.get('id');

  const { data: barber, isLoading } = useQuery({
    queryKey: ['barber', barberId],
    queryFn: async () => {
      const barbers = await base44.entities.Barber.filter({ id: barberId });
      return barbers[0] || null;
    },
    enabled: !!barberId
  });

  const { data: services = [] } = useQuery({
    queryKey: ['barberServices'],
    queryFn: () => base44.entities.Service.filter({ is_active: true })
  });

  const { data: reviews = [] } = useQuery({
    queryKey: ['barberReviews', barberId],
    queryFn: () => base44.entities.Review.filter({ barber_id: barberId, is_approved: true }),
    enabled: !!barberId
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-50 pt-32 px-6">
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-64 rounded-3xl mb-8" />
          <Skeleton className="h-32 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!barber) {
    return (
      <div className="min-h-screen bg-stone-50 pt-32 px-6 flex items-center justify-center">
        <div className="text-center">
          <p className="text-stone-500 mb-4">Stylist not found</p>
          <Link to={createPageUrl('Barbers')}>
            <Button className="rounded-full">View All Stylists</Button>
          </Link>
        </div>
      </div>
    );
  }

  const barberServices = services.filter(s => 
    (barber.serves_gender === 'both' || s.gender === barber.serves_gender || s.gender === 'unisex') &&
    (!barber.services || barber.services.length === 0 || barber.services.includes(s.id))
  );

  return (
    <div className="min-h-screen bg-stone-50 pt-24 pb-16">
      {/* Back Button */}
      <div className="max-w-4xl mx-auto px-6 mb-6">
        <Link to={createPageUrl('Barbers')}>
          <Button variant="ghost" className="rounded-full">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Team
          </Button>
        </Link>
      </div>

      {/* Profile Header */}
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-lg overflow-hidden mb-8"
        >
          <div className="relative h-48 bg-gradient-to-br from-stone-800 to-stone-900">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=1200')] bg-cover bg-center opacity-30" />
          </div>

          <div className="relative px-8 pb-8">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-6 -mt-16">
              <img
                src={barber.photo_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300'}
                alt={barber.name}
                className="w-32 h-32 rounded-2xl object-cover border-4 border-white shadow-lg"
              />
              <div className="flex-1 text-center md:text-left md:mb-2">
                <h1 className="text-2xl font-medium text-stone-900 mb-1">{barber.name}</h1>
                <div className="flex items-center justify-center md:justify-start gap-4 text-stone-500 text-sm">
                  <span className="flex items-center gap-1">
                    <Award className="w-4 h-4" />
                    {barber.experience_years || 5}+ years
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    {barber.rating?.toFixed(1) || '5.0'}
                  </span>
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="rounded-full">
                  <Heart className="w-4 h-4 mr-2" />
                  Save
                </Button>
                <Link to={`${createPageUrl('Booking')}?barber=${barber.id}`}>
                  <Button className="bg-stone-900 hover:bg-stone-800 text-white rounded-full">
                    <Calendar className="w-4 h-4 mr-2" />
                    Book Now
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <h2 className="text-lg font-medium text-stone-900 mb-4">About</h2>
                <p className="text-stone-600 leading-relaxed">
                  {barber.bio || `${barber.name} is a skilled stylist with ${barber.experience_years || 5}+ years of experience in the industry. Passionate about creating the perfect look for every client, they specialize in modern cuts and classic styles.`}
                </p>
              </CardContent>
            </Card>

            {/* Specialties */}
            {barber.specialty && barber.specialty.length > 0 && (
              <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <h2 className="text-lg font-medium text-stone-900 mb-4">Specialties</h2>
                  <div className="flex flex-wrap gap-2">
                    {barber.specialty.map((spec, i) => (
                      <span 
                        key={i}
                        className="px-4 py-2 bg-stone-100 rounded-full text-sm text-stone-700"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Services */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <h2 className="text-lg font-medium text-stone-900 mb-4">Services Offered</h2>
                <div className="space-y-3">
                  {barberServices.slice(0, 6).map(service => (
                    <div key={service.id} className="flex items-center justify-between p-4 bg-stone-50 rounded-xl">
                      <div>
                        <h4 className="font-medium text-stone-900">{service.name}</h4>
                        <span className="text-sm text-stone-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {service.duration} min
                        </span>
                      </div>
                      <span className="font-medium text-stone-900">${service.price_usd}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Reviews */}
            {reviews.length > 0 && (
              <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <h2 className="text-lg font-medium text-stone-900 mb-4">Client Reviews</h2>
                  <div className="space-y-4">
                    {reviews.map(review => (
                      <div key={review.id} className="pb-4 border-b border-stone-100 last:border-0">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating 
                                    ? 'fill-amber-400 text-amber-400' 
                                    : 'text-stone-200'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-stone-500">
                            {review.customer_name}
                          </span>
                        </div>
                        <p className="text-stone-600 text-sm">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="border-0 shadow-sm bg-stone-900 text-white">
              <CardContent className="p-6">
                <h3 className="font-medium mb-4">Book with {barber.name.split(' ')[0]}</h3>
                <p className="text-stone-400 text-sm mb-6">
                  Ready to transform your look? Book your appointment now.
                </p>
                <Link to={`${createPageUrl('Booking')}?barber=${barber.id}`}>
                  <Button className="w-full bg-amber-500 hover:bg-amber-400 text-stone-900 rounded-xl">
                    Book Appointment
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <h3 className="font-medium text-stone-900 mb-4">Quick Info</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3">
                    <Star className="w-5 h-5 text-amber-400" />
                    <span className="text-stone-600">
                      {barber.rating?.toFixed(1) || '5.0'} rating
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Award className="w-5 h-5 text-stone-400" />
                    <span className="text-stone-600">
                      {barber.experience_years || 5}+ years experience
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-stone-400" />
                    <span className="text-stone-600">
                      Serves {barber.serves_gender === 'both' ? 'all clients' : barber.serves_gender + ' clients'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}