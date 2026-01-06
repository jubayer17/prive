import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star, Quote, ThumbsUp, Award, TrendingUp, MessageSquare } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function Reviews() {
  const [filterRating, setFilterRating] = useState('all');

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ['reviews'],
    queryFn: () => base44.entities.Review.filter({ is_approved: true }, '-created_date')
  });

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '5.0';

  const ratingCounts = {
    5: reviews.filter(r => r.rating === 5).length,
    4: reviews.filter(r => r.rating === 4).length,
    3: reviews.filter(r => r.rating === 3).length,
    2: reviews.filter(r => r.rating === 2).length,
    1: reviews.filter(r => r.rating === 1).length
  };

  const filteredReviews = filterRating === 'all' 
    ? reviews 
    : reviews.filter(r => r.rating === parseInt(filterRating));

  return (
    <div className="min-h-screen bg-stone-50 pt-24">
      {/* Hero */}
      <section className="bg-stone-900 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-4xl md:text-5xl font-light text-white mb-4">Client Reviews</h1>
              <div className="flex items-center gap-4 mb-6">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-8 h-8 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <div>
                  <p className="text-4xl font-light text-white">{averageRating}</p>
                </div>
              </div>
              <p className="text-stone-400 text-lg">
                Based on {reviews.length} verified reviews
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-6"
            >
              <h3 className="text-white font-medium mb-4">Rating Breakdown</h3>
              <div className="space-y-3">
                {[5, 4, 3, 2, 1].map(rating => {
                  const count = ratingCounts[rating];
                  const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                  return (
                    <div key={rating} className="flex items-center gap-3">
                      <span className="text-white text-sm w-8">{rating} ★</span>
                      <div className="flex-1 h-2 bg-stone-700 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 1, delay: rating * 0.1 }}
                          className="h-full bg-amber-400"
                        />
                      </div>
                      <span className="text-stone-400 text-sm w-12 text-right">{count}</span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 px-6 bg-white border-b border-stone-100">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: ThumbsUp, value: '98%', label: 'Satisfaction Rate' },
              { icon: Star, value: averageRating, label: 'Average Rating' },
              { icon: Award, value: reviews.filter(r => r.rating === 5).length, label: '5-Star Reviews' },
              { icon: MessageSquare, value: reviews.length, label: 'Total Reviews' }
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center"
                >
                  <div className="w-12 h-12 bg-stone-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Icon className="w-6 h-6 text-stone-600" />
                  </div>
                  <p className="text-2xl font-light text-stone-900 mb-1">{stat.value}</p>
                  <p className="text-sm text-stone-500">{stat.label}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Filter */}
      <section className="py-8 px-6 bg-white border-b border-stone-100 sticky top-20 z-30 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto flex justify-center">
          <Tabs value={filterRating} onValueChange={setFilterRating}>
            <TabsList className="bg-stone-100 p-1">
              <TabsTrigger value="all" className="rounded-lg">All Reviews</TabsTrigger>
              <TabsTrigger value="5" className="rounded-lg">5 Stars</TabsTrigger>
              <TabsTrigger value="4" className="rounded-lg">4 Stars</TabsTrigger>
              <TabsTrigger value="3" className="rounded-lg">3 Stars</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          {isLoading ? (
            <div className="space-y-6">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-40 rounded-2xl" />
              ))}
            </div>
          ) : filteredReviews.length === 0 ? (
            <div className="text-center py-16">
              <Star className="w-16 h-16 text-stone-200 mx-auto mb-4" />
              <p className="text-stone-500">No reviews found for this rating</p>
              <Button 
                onClick={() => setFilterRating('all')}
                variant="outline"
                className="mt-4 rounded-full"
              >
                View All Reviews
              </Button>
            </div>
          ) : (
            <>
              <div className="space-y-6">
                {filteredReviews.map((review, index) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="border-0 shadow-sm hover:shadow-lg transition-all group">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <motion.div 
                          whileHover={{ scale: 1.1 }}
                          className="w-14 h-14 bg-gradient-to-br from-stone-800 to-stone-900 rounded-full flex items-center justify-center flex-shrink-0"
                        >
                          <span className="text-lg font-medium text-white">
                            {review.customer_name?.charAt(0) || 'A'}
                          </span>
                        </motion.div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="font-medium text-stone-900 mb-1">{review.customer_name}</h3>
                              <div className="flex items-center gap-2">
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
                                  {review.rating === 5 ? 'Excellent' : review.rating === 4 ? 'Great' : 'Good'}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="relative">
                            <Quote className="absolute -top-1 -left-1 w-6 h-6 text-amber-100" />
                            <p className="text-stone-600 leading-relaxed relative z-10 pl-4">
                              {review.comment}
                            </p>
                          </div>

                          {/* Helpful button */}
                          <div className="mt-4 flex items-center gap-2">
                            <button className="text-sm text-stone-400 hover:text-stone-600 transition-colors flex items-center gap-1">
                              <ThumbsUp className="w-4 h-4" />
                              Helpful
                            </button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
              </div>

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mt-12"
              >
                <Card className="border-0 shadow-lg bg-stone-900 text-white">
                  <CardContent className="p-8 text-center">
                    <MessageSquare className="w-12 h-12 text-amber-400 mx-auto mb-4" />
                    <h3 className="text-xl font-medium mb-3">Share Your Experience</h3>
                    <p className="text-stone-400 mb-6">
                      Had a great visit? We'd love to hear about it!
                    </p>
                    <Link to={createPageUrl('Contact')}>
                      <Button className="bg-amber-500 hover:bg-amber-400 text-stone-900 rounded-full px-8">
                        Leave a Review
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}