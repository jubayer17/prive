import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Star, Calendar, Award, User } from 'lucide-react';

export default function SavedBarbers() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await base44.auth.me();
        setUser(userData);
      } catch (error) {
        console.log('Not logged in');
      }
    };
    fetchUser();
  }, []);

  const { data: allBarbers = [] } = useQuery({
    queryKey: ['barbers'],
    queryFn: () => base44.entities.Barber.filter({ is_active: true })
  });

  // For now, show all barbers. In production, filter by user.saved_barbers
  const savedBarbers = allBarbers.slice(0, 3);

  if (!user) {
    return (
      <div className="min-h-screen bg-stone-50 pt-32 px-6 flex items-center justify-center">
        <Card className="max-w-md w-full border-0 shadow-lg">
          <CardContent className="p-12 text-center">
            <User className="w-16 h-16 text-stone-300 mx-auto mb-4" />
            <h2 className="text-2xl font-medium text-stone-900 mb-2">Sign In Required</h2>
            <p className="text-stone-500 mb-6">Please sign in to view your saved stylists</p>
            <Button 
              onClick={() => base44.auth.redirectToLogin()}
              className="bg-stone-900 hover:bg-stone-800 text-white rounded-full px-8"
            >
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 pt-32 pb-16 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-10 h-10 text-white fill-white" />
          </div>
          <h1 className="text-3xl font-light text-stone-900 mb-4">Saved Stylists</h1>
          <p className="text-stone-500">
            Your favorite stylists in one place
          </p>
        </div>

        {savedBarbers.length === 0 ? (
          <Card className="border-0 shadow-lg">
            <CardContent className="text-center py-16">
              <Heart className="w-16 h-16 text-stone-200 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-stone-900 mb-2">No Saved Stylists Yet</h3>
              <p className="text-stone-500 mb-6">Start saving your favorite stylists for quick booking</p>
              <Link to={createPageUrl('Barbers')}>
                <Button className="bg-stone-900 hover:bg-stone-800 text-white rounded-full">
                  Browse Stylists
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedBarbers.map((barber, index) => (
              <motion.div
                key={barber.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border-0 shadow-sm hover:shadow-lg transition-all group">
                  <CardContent className="p-6">
                    <div className="relative mb-4">
                      <img
                        src={barber.photo_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300'}
                        alt={barber.name}
                        className="w-full h-48 object-cover rounded-xl"
                      />
                      <button className="absolute top-3 right-3 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                        <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                      </button>
                    </div>

                    <h3 className="text-lg font-medium text-stone-900 mb-2">{barber.name}</h3>
                    
                    <div className="flex items-center gap-4 mb-4 text-sm text-stone-500">
                      <span className="flex items-center gap-1">
                        <Award className="w-4 h-4" />
                        {barber.experience_years || 5}+ years
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        {barber.rating?.toFixed(1) || '5.0'}
                      </span>
                    </div>

                    {barber.specialty && barber.specialty.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {barber.specialty.slice(0, 2).map((spec, i) => (
                          <span 
                            key={i}
                            className="px-3 py-1 bg-stone-100 rounded-full text-xs text-stone-600"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Link to={`${createPageUrl('BarberProfile')}?id=${barber.id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full rounded-lg">
                          View Profile
                        </Button>
                      </Link>
                      <Link to={`${createPageUrl('Booking')}?barber=${barber.id}`} className="flex-1">
                        <Button size="sm" className="w-full bg-stone-900 hover:bg-stone-800 text-white rounded-lg">
                          <Calendar className="w-4 h-4 mr-1" />
                          Book
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}