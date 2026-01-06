import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  Settings,
  Shield,
  Crown,
  BarChart3,
  Scissors,
  Gift,
  CreditCard,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';
import { format } from 'date-fns';

export default function SuperAdminDashboard() {
  const [user, setUser] = useState(null);

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
    queryKey: ['allBookings'],
    queryFn: () => base44.entities.Booking.list('-created_date', 100)
  });

  const { data: users = [] } = useQuery({
    queryKey: ['allUsers'],
    queryFn: () => base44.entities.User.list()
  });

  const { data: memberships = [] } = useQuery({
    queryKey: ['allMemberships'],
    queryFn: () => base44.entities.Membership.list()
  });

  const { data: services = [] } = useQuery({
    queryKey: ['allServices'],
    queryFn: () => base44.entities.Service.list()
  });

  const { data: barbers = [] } = useQuery({
    queryKey: ['allBarbers'],
    queryFn: () => base44.entities.Barber.list()
  });

  const { data: giftCards = [] } = useQuery({
    queryKey: ['allGiftCards'],
    queryFn: () => base44.entities.GiftCard.list()
  });

  const totalRevenue = bookings.reduce((sum, b) => sum + (b.price || 0), 0);
  const membershipRevenue = memberships.filter(m => m.status === 'active')
    .reduce((sum, m) => sum + (m.price_monthly || 0), 0);
  const giftCardRevenue = giftCards.reduce((sum, g) => sum + (g.amount || 0), 0);

  const stats = [
    { title: 'Total Revenue', value: `$${totalRevenue.toFixed(0)}`, icon: DollarSign, color: 'bg-green-500', trend: '+12%' },
    { title: 'Total Bookings', value: bookings.length, icon: Calendar, color: 'bg-blue-500', trend: '+8%' },
    { title: 'Active Members', value: memberships.filter(m => m.status === 'active').length, icon: Crown, color: 'bg-amber-500', trend: '+15%' },
    { title: 'Team Members', value: barbers.length, icon: Users, color: 'bg-purple-500', trend: '' }
  ];

  if (!user) return null;

  // Check admin role
  if (user.admin_role !== 'super_admin' && user.role !== 'admin') {
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
            <span className="px-3 py-1 bg-red-500 rounded-full text-xs font-semibold">Super Admin</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to={createPageUrl('AdminDashboard')}>
              <Button variant="ghost" size="sm" className="text-stone-300 hover:text-white">
                Admin View
              </Button>
            </Link>
            <span className="text-stone-400 text-sm">{user.email}</span>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-stone-500 text-sm mb-1">{stat.title}</p>
                        <p className="text-3xl font-light text-stone-900">{stat.value}</p>
                        {stat.trend && (
                          <p className="text-green-600 text-sm mt-2 flex items-center gap-1">
                            <TrendingUp className="w-4 h-4" />
                            {stat.trend} this month
                          </p>
                        )}
                      </div>
                      <div className={`p-3 ${stat.color} rounded-xl`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview">
          <TabsList className="bg-white p-1 rounded-xl shadow-sm mb-6">
            <TabsTrigger value="overview" className="rounded-lg">Overview</TabsTrigger>
            <TabsTrigger value="users" className="rounded-lg">Users</TabsTrigger>
            <TabsTrigger value="bookings" className="rounded-lg">Bookings</TabsTrigger>
            <TabsTrigger value="services" className="rounded-lg">Services</TabsTrigger>
            <TabsTrigger value="team" className="rounded-lg">Team</TabsTrigger>
            <TabsTrigger value="settings" className="rounded-lg">Settings</TabsTrigger>
          </TabsList>

          {/* Overview */}
          <TabsContent value="overview">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Revenue Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-stone-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                          <Scissors className="w-5 h-5 text-blue-600" />
                        </div>
                        <span className="font-medium">Bookings</span>
                      </div>
                      <span className="text-lg font-medium">${totalRevenue.toFixed(0)}</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-stone-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                          <Crown className="w-5 h-5 text-amber-600" />
                        </div>
                        <span className="font-medium">Memberships</span>
                      </div>
                      <span className="text-lg font-medium">${membershipRevenue.toFixed(0)}/mo</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-stone-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-pink-100 rounded-xl flex items-center justify-center">
                          <Gift className="w-5 h-5 text-pink-600" />
                        </div>
                        <span className="font-medium">Gift Cards</span>
                      </div>
                      <span className="text-lg font-medium">${giftCardRevenue.toFixed(0)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Recent Bookings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {bookings.slice(0, 5).map(booking => (
                      <div key={booking.id} className="flex items-center justify-between py-3 border-b border-stone-100 last:border-0">
                        <div>
                          <p className="font-medium text-sm">{booking.customer_name}</p>
                          <p className="text-stone-500 text-xs">{booking.service_name}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm">{booking.date && format(new Date(booking.date), 'MMM d')}</p>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                            booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-stone-100 text-stone-700'
                          }`}>
                            {booking.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Users */}
          <TabsContent value="users">
            <Card className="border-0 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">User Management</CardTitle>
                <div className="flex gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                    <Input placeholder="Search users..." className="pl-10 w-64" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-stone-200">
                        <th className="text-left py-3 px-4 text-sm font-medium text-stone-500">User</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-stone-500">Role</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-stone-500">Admin Role</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-stone-500">Joined</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-stone-500">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(u => (
                        <tr key={u.id} className="border-b border-stone-100 hover:bg-stone-50">
                          <td className="py-3 px-4">
                            <div>
                              <p className="font-medium text-sm">{u.full_name || 'N/A'}</p>
                              <p className="text-stone-500 text-xs">{u.email}</p>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              u.role === 'admin' ? 'bg-red-100 text-red-700' : 'bg-stone-100 text-stone-700'
                            }`}>
                              {u.role || 'user'}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <Select defaultValue={u.admin_role || 'none'}>
                              <SelectTrigger className="w-32 h-8 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="none">None</SelectItem>
                                <SelectItem value="editor">Editor</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                                <SelectItem value="super_admin">Super Admin</SelectItem>
                              </SelectContent>
                            </Select>
                          </td>
                          <td className="py-3 px-4 text-sm text-stone-500">
                            {u.created_date && format(new Date(u.created_date), 'MMM d, yyyy')}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Edit className="w-4 h-4" />
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

          {/* Bookings */}
          <TabsContent value="bookings">
            <Card className="border-0 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">All Bookings</CardTitle>
                <div className="flex gap-3">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-stone-200">
                        <th className="text-left py-3 px-4 text-sm font-medium text-stone-500">Customer</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-stone-500">Service</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-stone-500">Stylist</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-stone-500">Date</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-stone-500">Status</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-stone-500">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.slice(0, 20).map(booking => (
                        <tr key={booking.id} className="border-b border-stone-100 hover:bg-stone-50">
                          <td className="py-3 px-4">
                            <p className="font-medium text-sm">{booking.customer_name}</p>
                            <p className="text-stone-500 text-xs">{booking.customer_email}</p>
                          </td>
                          <td className="py-3 px-4 text-sm">{booking.service_name}</td>
                          <td className="py-3 px-4 text-sm">{booking.barber_name}</td>
                          <td className="py-3 px-4 text-sm">
                            {booking.date && format(new Date(booking.date), 'MMM d')} • {booking.time}
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                              booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                              booking.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                              'bg-stone-100 text-stone-700'
                            }`}>
                              {booking.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-sm font-medium">${booking.price || 0}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {services.map(service => (
                    <div key={service.id} className="p-4 bg-stone-50 rounded-xl">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-medium">{service.name}</h4>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            service.gender === 'male' ? 'bg-blue-100 text-blue-700' :
                            service.gender === 'female' ? 'bg-pink-100 text-pink-700' :
                            'bg-purple-100 text-purple-700'
                          }`}>
                            {service.gender}
                          </span>
                        </div>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-stone-500 mb-3 line-clamp-2">{service.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">${service.price_usd}</span>
                        <span className="text-stone-500 text-sm">{service.duration} min</span>
                      </div>
                    </div>
                  ))}
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
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {barbers.map(barber => (
                    <div key={barber.id} className="text-center p-6 bg-stone-50 rounded-xl">
                      <img
                        src={barber.photo_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200'}
                        alt={barber.name}
                        className="w-20 h-20 rounded-full object-cover mx-auto mb-4"
                      />
                      <h4 className="font-medium mb-1">{barber.name}</h4>
                      <p className="text-stone-500 text-sm mb-3">
                        {barber.experience_years || 0}+ years • Serves {barber.serves_gender}
                      </p>
                      <div className="flex justify-center gap-2">
                        <Button variant="outline" size="sm" className="rounded-lg">
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

          {/* Settings */}
          <TabsContent value="settings">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Global Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm text-stone-600 mb-2 block">Default Currency</label>
                    <Select defaultValue="USD">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD - US Dollar</SelectItem>
                        <SelectItem value="EUR">EUR - Euro</SelectItem>
                        <SelectItem value="GBP">GBP - British Pound</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm text-stone-600 mb-2 block">Booking Lead Time (hours)</label>
                    <Input type="number" defaultValue="24" />
                  </div>
                  <Button className="w-full rounded-lg">Save Settings</Button>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Payment Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-stone-50 rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                      <CreditCard className="w-5 h-5 text-stone-600" />
                      <span className="font-medium">Payment Provider</span>
                    </div>
                    <p className="text-sm text-stone-500">Configure your payment gateway</p>
                  </div>
                  <Button variant="outline" className="w-full rounded-lg">
                    <Settings className="w-4 h-4 mr-2" />
                    Configure Payments
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}