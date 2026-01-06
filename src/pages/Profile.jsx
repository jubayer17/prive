import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  Calendar, 
  Crown, 
  Heart, 
  History, 
  Settings, 
  LogOut,
  Mail,
  Phone,
  Edit,
  ArrowRight,
  Clock,
  CheckCircle2,
  XCircle,
  Gift
} from 'lucide-react';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await base44.auth.me();
        setUser(userData);
      } catch (error) {
        console.log('Not logged in');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const { data: bookings = [] } = useQuery({
    queryKey: ['userBookings', user?.email],
    queryFn: () => base44.entities.Booking.filter({ customer_email: user?.email }, '-created_date'),
    enabled: !!user?.email
  });

  const { data: membership } = useQuery({
    queryKey: ['userMembership', user?.email],
    queryFn: async () => {
      const memberships = await base44.entities.Membership.filter({ 
        user_email: user?.email,
        status: 'active'
      });
      return memberships[0] || null;
    },
    enabled: !!user?.email
  });

  const handleLogout = async () => {
    await base44.auth.logout('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 pt-32 px-6">
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-32 rounded-2xl mb-6" />
          <Skeleton className="h-64 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-stone-50 pt-32 px-6 flex items-center justify-center">
        <div className="text-center">
          <User className="w-16 h-16 text-stone-300 mx-auto mb-4" />
          <h2 className="text-2xl font-medium text-stone-900 mb-2">Sign In Required</h2>
          <p className="text-stone-500 mb-6">Please sign in to view your profile</p>
          <Button 
            onClick={() => base44.auth.redirectToLogin()}
            className="bg-stone-900 hover:bg-stone-800 text-white rounded-full px-8"
          >
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  const upcomingBookings = bookings.filter(b => 
    b.status !== 'cancelled' && new Date(b.date) >= new Date()
  );
  const pastBookings = bookings.filter(b => 
    b.status === 'completed' || new Date(b.date) < new Date()
  );

  return (
    <div className="min-h-screen bg-stone-50 pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-6">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-8 shadow-sm mb-8"
        >
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="w-24 h-24 bg-stone-200 rounded-full flex items-center justify-center">
              <User className="w-12 h-12 text-stone-400" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl font-medium text-stone-900 mb-1">
                {user.full_name || 'Guest'}
              </h1>
              <p className="text-stone-500 mb-4">{user.email}</p>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                {membership && (
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-800 rounded-full text-sm">
                    <Crown className="w-4 h-4" />
                    {membership.plan.charAt(0).toUpperCase() + membership.plan.slice(1)} Member
                  </div>
                )}
                <span className="flex items-center gap-2 text-sm text-stone-500">
                  <Calendar className="w-4 h-4" />
                  {bookings.length} bookings
                </span>
              </div>
            </div>
            <Button variant="outline" className="rounded-full">
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </motion.div>

        {/* Main Content */}
        <Tabs defaultValue="upcoming" className="space-y-6">
          <TabsList className="bg-white p-1 rounded-xl shadow-sm">
            <TabsTrigger value="upcoming" className="rounded-lg px-6 data-[state=active]:bg-stone-900 data-[state=active]:text-white">
              Upcoming
            </TabsTrigger>
            <TabsTrigger value="history" className="rounded-lg px-6 data-[state=active]:bg-stone-900 data-[state=active]:text-white">
              History
            </TabsTrigger>
            <TabsTrigger value="membership" className="rounded-lg px-6 data-[state=active]:bg-stone-900 data-[state=active]:text-white">
              Membership
            </TabsTrigger>
          </TabsList>

          {/* Upcoming Bookings */}
          <TabsContent value="upcoming">
            {upcomingBookings.length === 0 ? (
              <Card className="border-0 shadow-sm">
                <CardContent className="text-center py-12">
                  <Calendar className="w-12 h-12 text-stone-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-stone-900 mb-2">No Upcoming Appointments</h3>
                  <p className="text-stone-500 mb-6">Book your next grooming session</p>
                  <Link to={createPageUrl('Booking')}>
                    <Button className="bg-stone-900 hover:bg-stone-800 text-white rounded-full">
                      Book Now
                      <ArrowRight className="w-4 h-4 ml-2" />
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
                    <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                              <Calendar className="w-6 h-6 text-amber-600" />
                            </div>
                            <div>
                              <h3 className="font-medium text-stone-900">{booking.service_name}</h3>
                              <p className="text-sm text-stone-500">with {booking.barber_name}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-stone-900">
                              {format(new Date(booking.date), 'MMM d, yyyy')}
                            </p>
                            <p className="text-sm text-stone-500 flex items-center justify-end gap-1">
                              <Clock className="w-4 h-4" />
                              {booking.time}
                            </p>
                          </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-stone-100 flex items-center justify-between">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            booking.status === 'confirmed' 
                              ? 'bg-green-100 text-green-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1)}
                          </span>
                          <Button variant="ghost" size="sm" className="text-stone-500">
                            View Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Booking History */}
          <TabsContent value="history">
            {pastBookings.length === 0 ? (
              <Card className="border-0 shadow-sm">
                <CardContent className="text-center py-12">
                  <History className="w-12 h-12 text-stone-300 mx-auto mb-4" />
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
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-stone-100 rounded-xl flex items-center justify-center">
                              {booking.status === 'completed' ? (
                                <CheckCircle2 className="w-6 h-6 text-green-600" />
                              ) : (
                                <XCircle className="w-6 h-6 text-stone-400" />
                              )}
                            </div>
                            <div>
                              <h3 className="font-medium text-stone-900">{booking.service_name}</h3>
                              <p className="text-sm text-stone-500">with {booking.barber_name}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-stone-900">
                              {format(new Date(booking.date), 'MMM d, yyyy')}
                            </p>
                            <p className="text-sm text-stone-500">${booking.price}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Membership */}
          <TabsContent value="membership">
            {!membership ? (
              <Card className="border-0 shadow-sm">
                <CardContent className="text-center py-12">
                  <Crown className="w-12 h-12 text-stone-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-stone-900 mb-2">No Active Membership</h3>
                  <p className="text-stone-500 mb-6">Join our membership program for exclusive benefits</p>
                  <Link to={createPageUrl('Memberships')}>
                    <Button className="bg-amber-500 hover:bg-amber-400 text-stone-900 rounded-full">
                      View Plans
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-0 shadow-sm bg-gradient-to-br from-stone-900 to-stone-800 text-white">
                <CardContent className="p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Crown className="w-6 h-6 text-amber-400" />
                        <span className="text-amber-400 text-sm font-medium uppercase tracking-wider">
                          {membership.plan} Member
                        </span>
                      </div>
                      <h3 className="text-2xl font-light">Your Membership</h3>
                    </div>
                    <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                      Active
                    </span>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <p className="text-stone-400 text-sm mb-1">Monthly Price</p>
                      <p className="text-2xl font-light">
                        ${membership.price_monthly}
                        <span className="text-sm text-stone-400">/month</span>
                      </p>
                    </div>
                    <div>
                      <p className="text-stone-400 text-sm mb-1">Renewal Date</p>
                      <p className="text-lg">
                        {membership.end_date && format(new Date(membership.end_date), 'MMM d, yyyy')}
                      </p>
                    </div>
                  </div>

                  {membership.addons && membership.addons.length > 0 && (
                    <div className="border-t border-stone-700 pt-6">
                      <p className="text-stone-400 text-sm mb-3">Active Add-ons</p>
                      <div className="flex flex-wrap gap-2">
                        {membership.addons.map(addon => (
                          <span key={addon} className="px-3 py-1 bg-stone-700 rounded-full text-sm capitalize">
                            {addon.replace('-', ' ')}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-6 flex gap-3">
                    <Button variant="outline" className="text-white border-stone-600 hover:bg-stone-700 rounded-xl flex-1">
                      Manage Plan
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Actions */}
        <div className="mt-8 pt-8 border-t border-stone-200">
          <Button 
            variant="ghost" 
            onClick={handleLogout}
            className="text-stone-500 hover:text-red-600 hover:bg-red-50"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}