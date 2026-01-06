import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, User, CheckCircle2, XCircle, History as HistoryIcon } from 'lucide-react';
import { format } from 'date-fns';

export default function BookingHistory() {
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

  const { data: bookings = [] } = useQuery({
    queryKey: ['userBookings', user?.email],
    queryFn: () => base44.entities.Booking.filter({ customer_email: user?.email }, '-created_date'),
    enabled: !!user?.email
  });

  const upcomingBookings = bookings.filter(b => 
    b.status !== 'cancelled' && new Date(b.date) >= new Date()
  );
  
  const pastBookings = bookings.filter(b => 
    b.status === 'completed' || new Date(b.date) < new Date()
  );

  if (!user) {
    return (
      <div className="min-h-screen bg-stone-50 pt-32 px-6 flex items-center justify-center">
        <Card className="max-w-md w-full border-0 shadow-lg">
          <CardContent className="p-12 text-center">
            <User className="w-16 h-16 text-stone-300 mx-auto mb-4" />
            <h2 className="text-2xl font-medium text-stone-900 mb-2">Sign In Required</h2>
            <p className="text-stone-500 mb-6">Please sign in to view your booking history</p>
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
          <div className="w-20 h-20 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <HistoryIcon className="w-10 h-10 text-stone-900" />
          </div>
          <h1 className="text-3xl font-light text-stone-900 mb-4">Booking History</h1>
          <p className="text-stone-500">
            View your past and upcoming appointments
          </p>
        </div>

        <Tabs defaultValue="upcoming">
          <TabsList className="bg-white p-1 rounded-xl shadow-sm mb-8 w-full md:w-auto">
            <TabsTrigger value="upcoming" className="rounded-lg px-6 flex-1 md:flex-none">
              Upcoming ({upcomingBookings.length})
            </TabsTrigger>
            <TabsTrigger value="past" className="rounded-lg px-6 flex-1 md:flex-none">
              Past ({pastBookings.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming">
            {upcomingBookings.length === 0 ? (
              <Card className="border-0 shadow-lg">
                <CardContent className="text-center py-16">
                  <Calendar className="w-16 h-16 text-stone-200 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-stone-900 mb-2">No Upcoming Appointments</h3>
                  <p className="text-stone-500 mb-6">Book your next grooming session</p>
                  <Link to={createPageUrl('Booking')}>
                    <Button className="bg-stone-900 hover:bg-stone-800 text-white rounded-full">
                      Book Now
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {upcomingBookings.map((booking, index) => (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="border-0 shadow-sm hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-medium text-stone-900 mb-1">{booking.service_name}</h3>
                            <p className="text-stone-500">with {booking.barber_name}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            booking.status === 'confirmed' 
                              ? 'bg-green-100 text-green-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1)}
                          </span>
                        </div>
                        <div className="grid md:grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center gap-2 text-stone-600">
                            <Calendar className="w-4 h-4" />
                            {format(new Date(booking.date), 'EEEE, MMMM d, yyyy')}
                          </div>
                          <div className="flex items-center gap-2 text-stone-600">
                            <Clock className="w-4 h-4" />
                            {booking.time} ({booking.duration} min)
                          </div>
                          <div className="flex items-center gap-2 text-stone-600 font-medium">
                            ${booking.price?.toFixed(2)}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="past">
            {pastBookings.length === 0 ? (
              <Card className="border-0 shadow-lg">
                <CardContent className="text-center py-16">
                  <HistoryIcon className="w-16 h-16 text-stone-200 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-stone-900 mb-2">No Past Bookings</h3>
                  <p className="text-stone-500">Your booking history will appear here</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {pastBookings.map((booking, index) => (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="border-0 shadow-sm">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-start gap-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                              booking.status === 'completed' ? 'bg-green-100' : 'bg-stone-100'
                            }`}>
                              {booking.status === 'completed' ? (
                                <CheckCircle2 className="w-6 h-6 text-green-600" />
                              ) : (
                                <XCircle className="w-6 h-6 text-stone-400" />
                              )}
                            </div>
                            <div>
                              <h3 className="text-lg font-medium text-stone-900 mb-1">{booking.service_name}</h3>
                              <p className="text-stone-500">with {booking.barber_name}</p>
                            </div>
                          </div>
                        </div>
                        <div className="grid md:grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center gap-2 text-stone-600">
                            <Calendar className="w-4 h-4" />
                            {format(new Date(booking.date), 'MMM d, yyyy')}
                          </div>
                          <div className="flex items-center gap-2 text-stone-600">
                            <Clock className="w-4 h-4" />
                            {booking.time}
                          </div>
                          <div className="flex items-center gap-2 text-stone-600 font-medium">
                            ${booking.price?.toFixed(2)}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}