import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Crown, Check, User, ArrowRight, Calendar, DollarSign } from 'lucide-react';
import { format } from 'date-fns';

export default function MyMembership() {
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

  if (!user) {
    return (
      <div className="min-h-screen bg-stone-50 pt-32 px-6 flex items-center justify-center">
        <Card className="max-w-md w-full border-0 shadow-lg">
          <CardContent className="p-12 text-center">
            <User className="w-16 h-16 text-stone-300 mx-auto mb-4" />
            <h2 className="text-2xl font-medium text-stone-900 mb-2">Sign In Required</h2>
            <p className="text-stone-500 mb-6">Please sign in to view your membership</p>
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

  if (!membership) {
    return (
      <div className="min-h-screen bg-stone-50 pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Crown className="w-10 h-10 text-stone-900" />
            </div>
            <h1 className="text-3xl font-light text-stone-900 mb-4">My Membership</h1>
          </div>

          <Card className="border-0 shadow-lg">
            <CardContent className="text-center py-16">
              <Crown className="w-16 h-16 text-stone-200 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-stone-900 mb-2">No Active Membership</h3>
              <p className="text-stone-500 mb-6">
                Join our membership program for exclusive benefits and savings
              </p>
              <Link to={createPageUrl('Memberships')}>
                <Button className="bg-amber-500 hover:bg-amber-400 text-stone-900 rounded-full px-8">
                  View Membership Plans
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const benefits = {
    essential: ['2 Haircuts/month', 'Basic styling', '10% off products', 'Priority booking'],
    premium: ['4 Haircuts/month', 'Beard grooming', '20% off products', 'Priority booking', 'Free consultation'],
    elite: ['Unlimited haircuts', 'All treatments', '30% off products', 'VIP booking', 'Monthly spa', 'Member events']
  };

  return (
    <div className="min-h-screen bg-stone-50 pt-32 pb-16 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Crown className="w-10 h-10 text-stone-900" />
          </div>
          <h1 className="text-3xl font-light text-stone-900 mb-4">My Membership</h1>
          <p className="text-stone-500">
            Manage your membership and benefits
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-0 shadow-lg bg-gradient-to-br from-stone-900 to-stone-800 text-white mb-8">
            <CardContent className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Crown className="w-6 h-6 text-amber-400" />
                    <span className="text-amber-400 text-sm font-medium uppercase tracking-wider">
                      {membership.plan} Member
                    </span>
                  </div>
                  <h2 className="text-2xl font-light">{user.full_name || 'Member'}</h2>
                </div>
                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">
                  Active
                </span>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <div>
                  <p className="text-stone-400 text-sm mb-1">Monthly Price</p>
                  <p className="text-2xl font-light">
                    ${membership.price_monthly}
                    <span className="text-sm text-stone-400">/month</span>
                  </p>
                </div>
                <div>
                  <p className="text-stone-400 text-sm mb-1">Started</p>
                  <p className="text-lg">
                    {membership.start_date && format(new Date(membership.start_date), 'MMM d, yyyy')}
                  </p>
                </div>
                <div>
                  <p className="text-stone-400 text-sm mb-1">Next Renewal</p>
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
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg mb-8">
            <CardContent className="p-8">
              <h3 className="text-lg font-medium text-stone-900 mb-6">Your Benefits</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {(benefits[membership.plan] || []).map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl"
                  >
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-stone-700">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Link to={createPageUrl('Memberships')} className="flex-1">
              <Button variant="outline" className="w-full rounded-xl py-6">
                Upgrade Plan
              </Button>
            </Link>
            <Button variant="outline" className="flex-1 rounded-xl py-6 text-red-500 border-red-200 hover:bg-red-50">
              Cancel Membership
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}