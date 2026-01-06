import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Calendar,
  Scissors,
  Users,
  Gift,
  Crown,
  Search,
  Plus,
  Edit,
  Trash2,
  Check,
  X,
  Clock,
  DollarSign,
  Eye,
  Shield,
  Loader2
} from 'lucide-react';
import { format } from 'date-fns';

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await base44.auth.me();
        setUser(userData);
      } catch (e) {
        window.location.href = '/';
      }
    };
    checkAuth();
  }, []);

  const { data: bookings = [] } = useQuery({
    queryKey: ['adminBookings'],
    queryFn: () => base44.entities.Booking.list('-created_date', 50)
  });

  const { data: services = [] } = useQuery({
    queryKey: ['adminServices'],
    queryFn: () => base44.entities.Service.list()
  });

  const { data: barbers = [] } = useQuery({
    queryKey: ['adminBarbers'],
    queryFn: () => base44.entities.Barber.list()
  });

  const { data: memberships = [] } = useQuery({
    queryKey: ['adminMemberships'],
    queryFn: () => base44.entities.Membership.list()
  });

  const { data: giftCards = [] } = useQuery({
    queryKey: ['adminGiftCards'],
    queryFn: () => base44.entities.GiftCard.list()
  });

  const updateBookingMutation = useMutation({
    mutationFn: ({ id, status }) => base44.entities.Booking.update(id, { status }),
    onSuccess: () => queryClient.invalidateQueries(['adminBookings'])
  });

  const todayBookings = bookings.filter(b => 
    b.date === format(new Date(), 'yyyy-MM-dd')
  );

  const pendingBookings = bookings.filter(b => b.status === 'pending');

  if (!user) return null;

  // Check admin role
  if (!['super_admin', 'admin'].includes(user.admin_role) && user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-stone-100 flex items-center justify-center p-6">
        <Card className="max-w-md w-full">
          <CardContent className="text-center py-12">
            <Shield className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-medium text-stone-900 mb-2">Access Denied</h2>
            <p className="text-stone-500 mb-6">You don't have permission to access this area.</p>
            <Link to={createPageUrl('Home')}>
              <Button className="rounded-full">Back to Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-100">
      {/* Header */}
      <header className="bg-stone-900 text-white px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to={createPageUrl('Home')} className="text-xl font-medium">Hairy</Link>
            <span className="px-3 py-1 bg-blue-500 rounded-full text-xs font-semibold">Admin</span>
          </div>
          <div className="flex items-center gap-4">
            {user.admin_role === 'super_admin' && (
              <Link to={createPageUrl('SuperAdminDashboard')}>
                <Button variant="ghost" size="sm" className="text-stone-300 hover:text-white">
                  Super Admin
                </Button>
              </Link>
            )}
            <span className="text-stone-400 text-sm">{user.email}</span>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-light">{todayBookings.length}</p>
                  <p className="text-stone-500 text-sm">Today's Bookings</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-light">{pendingBookings.length}</p>
                  <p className="text-stone-500 text-sm">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <Crown className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-light">{memberships.filter(m => m.status === 'active').length}</p>
                  <p className="text-stone-500 text-sm">Active Members</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-pink-100 rounded-lg">
                  <Gift className="w-5 h-5 text-pink-600" />
                </div>
                <div>
                  <p className="text-2xl font-light">{giftCards.filter(g => g.status === 'active').length}</p>
                  <p className="text-stone-500 text-sm">Gift Cards</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="bookings">
          <TabsList className="bg-white p-1 rounded-xl shadow-sm mb-6">
            <TabsTrigger value="bookings" className="rounded-lg">Bookings</TabsTrigger>
            <TabsTrigger value="services" className="rounded-lg">Services</TabsTrigger>
            <TabsTrigger value="team" className="rounded-lg">Team</TabsTrigger>
            <TabsTrigger value="memberships" className="rounded-lg">Memberships</TabsTrigger>
            <TabsTrigger value="giftcards" className="rounded-lg">Gift Cards</TabsTrigger>
          </TabsList>

          {/* Bookings */}
          <TabsContent value="bookings">
            <Card className="border-0 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Manage Bookings</CardTitle>
                <div className="flex gap-3">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {bookings.map(booking => (
                    <div key={booking.id} className="flex items-center justify-between p-4 bg-stone-50 rounded-xl">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                          <Scissors className="w-5 h-5 text-stone-600" />
                        </div>
                        <div>
                          <p className="font-medium">{booking.customer_name}</p>
                          <p className="text-sm text-stone-500">
                            {booking.service_name} • {booking.barber_name}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            {booking.date && format(new Date(booking.date), 'MMM d, yyyy')}
                          </p>
                          <p className="text-xs text-stone-500">{booking.time}</p>
                        </div>

                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                          booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          booking.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                          'bg-stone-100 text-stone-700'
                        }`}>
                          {booking.status}
                        </span>

                        {booking.status === 'pending' && (
                          <div className="flex gap-2">
                            <Button
                              size="icon"
                              className="h-8 w-8 bg-green-500 hover:bg-green-600"
                              onClick={() => updateBookingMutation.mutate({ id: booking.id, status: 'confirmed' })}
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-8 w-8 border-red-200 text-red-500 hover:bg-red-50"
                              onClick={() => updateBookingMutation.mutate({ id: booking.id, status: 'cancelled' })}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Services */}
          <TabsContent value="services">
            <Card className="border-0 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Services</CardTitle>
                <Button className="bg-stone-900 hover:bg-stone-800 text-white rounded-lg">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Service
                </Button>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-stone-200">
                        <th className="text-left py-3 px-4 text-sm font-medium text-stone-500">Service</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-stone-500">Category</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-stone-500">Gender</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-stone-500">Duration</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-stone-500">Price</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-stone-500">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {services.map(service => (
                        <tr key={service.id} className="border-b border-stone-100">
                          <td className="py-3 px-4">
                            <p className="font-medium">{service.name}</p>
                          </td>
                          <td className="py-3 px-4 text-sm capitalize">{service.category}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              service.gender === 'male' ? 'bg-blue-100 text-blue-700' :
                              service.gender === 'female' ? 'bg-pink-100 text-pink-700' :
                              'bg-purple-100 text-purple-700'
                            }`}>
                              {service.gender}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-sm">{service.duration} min</td>
                          <td className="py-3 px-4 text-sm font-medium">${service.price_usd}</td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Team */}
          <TabsContent value="team">
            <Card className="border-0 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Team Members</CardTitle>
                <Button className="bg-stone-900 hover:bg-stone-800 text-white rounded-lg">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Stylist
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {barbers.map(barber => (
                    <div key={barber.id} className="p-4 bg-stone-50 rounded-xl">
                      <div className="flex items-center gap-4 mb-4">
                        <img
                          src={barber.photo_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'}
                          alt={barber.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                          <h4 className="font-medium">{barber.name}</h4>
                          <p className="text-sm text-stone-500">{barber.experience_years || 0}+ years</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          barber.serves_gender === 'male' ? 'bg-blue-100 text-blue-700' :
                          barber.serves_gender === 'female' ? 'bg-pink-100 text-pink-700' :
                          'bg-purple-100 text-purple-700'
                        }`}>
                          Serves {barber.serves_gender}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          barber.is_active ? 'bg-green-100 text-green-700' : 'bg-stone-100 text-stone-600'
                        }`}>
                          {barber.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <div className="mt-4 flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1 rounded-lg">
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Memberships */}
          <TabsContent value="memberships">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Memberships</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-stone-200">
                        <th className="text-left py-3 px-4 text-sm font-medium text-stone-500">Member</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-stone-500">Plan</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-stone-500">Add-ons</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-stone-500">Monthly</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-stone-500">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {memberships.map(membership => (
                        <tr key={membership.id} className="border-b border-stone-100">
                          <td className="py-3 px-4">{membership.user_email}</td>
                          <td className="py-3 px-4 capitalize">{membership.plan}</td>
                          <td className="py-3 px-4 text-sm">
                            {membership.addons?.length > 0 ? membership.addons.join(', ') : '-'}
                          </td>
                          <td className="py-3 px-4 font-medium">${membership.price_monthly}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              membership.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-stone-100 text-stone-700'
                            }`}>
                              {membership.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Gift Cards */}
          <TabsContent value="giftcards">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Gift Cards</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-stone-200">
                        <th className="text-left py-3 px-4 text-sm font-medium text-stone-500">Code</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-stone-500">Recipient</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-stone-500">Amount</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-stone-500">Balance</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-stone-500">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {giftCards.map(card => (
                        <tr key={card.id} className="border-b border-stone-100">
                          <td className="py-3 px-4 font-mono text-sm">{card.code}</td>
                          <td className="py-3 px-4">
                            <p className="font-medium">{card.recipient_name}</p>
                            <p className="text-xs text-stone-500">{card.recipient_email}</p>
                          </td>
                          <td className="py-3 px-4 font-medium">${card.amount}</td>
                          <td className="py-3 px-4">${card.balance}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              card.status === 'active' ? 'bg-green-100 text-green-700' :
                              card.status === 'redeemed' ? 'bg-blue-100 text-blue-700' :
                              'bg-stone-100 text-stone-700'
                            }`}>
                              {card.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}