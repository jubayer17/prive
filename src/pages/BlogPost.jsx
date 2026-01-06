import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Calendar, User, ArrowRight, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import ReactMarkdown from 'react-markdown';

export default function BlogPost() {
  const navigate = useNavigate();
  const params = new URLSearchParams(window.location.search);
  const postId = params.get('id');

  const { data: post, isLoading } = useQuery({
    queryKey: ['blogPost', postId],
    queryFn: async () => {
      const posts = await base44.entities.BlogPost.filter({ id: postId });
      return posts[0] || null;
    },
    enabled: !!postId
  });

  const { data: allPosts = [] } = useQuery({
    queryKey: ['blogPosts'],
    queryFn: () => base44.entities.BlogPost.filter({ is_published: true }, '-published_date')
  });

  // Get related posts (same category, exclude current)
  const relatedPosts = allPosts
    .filter(p => p.id !== postId && p.category === post?.category)
    .slice(0, 3);

  const otherPosts = allPosts
    .filter(p => p.id !== postId)
    .slice(0, 4);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-50 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <Skeleton className="h-96 rounded-3xl mb-8" />
              <Skeleton className="h-12 mb-4" />
              <Skeleton className="h-64" />
            </div>
            <div>
              <Skeleton className="h-64 rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-stone-50 pt-32 px-6 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-medium text-stone-900 mb-2">Post Not Found</h2>
          <p className="text-stone-500 mb-6">The article you're looking for doesn't exist</p>
          <Link to={createPageUrl('Blog')}>
            <Button className="bg-stone-900 hover:bg-stone-800 text-white rounded-full">
              Back to Blog
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Get current post index
  const currentIndex = allPosts.findIndex(p => p.id === postId);
  const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

  return (
    <div className="min-h-screen bg-stone-50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Back Button */}
        <div className="mb-8">
          <Link to={createPageUrl('Blog')}>
            <Button variant="ghost" className="rounded-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {/* Cover Image */}
              <div className="rounded-3xl overflow-hidden mb-8">
                <img
                  src={post.cover_image || 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=1200'}
                  alt={post.title}
                  className="w-full h-96 object-cover"
                />
              </div>

              {/* Meta */}
              <div className="flex items-center gap-6 mb-6 text-stone-500 text-sm">
                <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium capitalize">
                  {post.category?.replace('-', ' ')}
                </span>
                <span className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {post.author || 'Hairy Team'}
                </span>
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {post.published_date && format(new Date(post.published_date), 'MMMM d, yyyy')}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-5xl font-light text-stone-900 mb-6 leading-tight">
                {post.title}
              </h1>

              {/* Excerpt */}
              {post.excerpt && (
                <p className="text-xl text-stone-600 leading-relaxed mb-8 pb-8 border-b border-stone-200">
                  {post.excerpt}
                </p>
              )}

              {/* Content */}
              <div className="prose prose-lg prose-stone max-w-none">
                <ReactMarkdown>{post.content}</ReactMarkdown>
              </div>

              {/* Navigation */}
              <div className="mt-16 pt-8 border-t border-stone-200">
                <div className="flex items-center justify-between gap-4">
                  {prevPost ? (
                    <Link to={`${createPageUrl('BlogPost')}?id=${prevPost.id}`} className="flex-1">
                      <Button variant="outline" className="w-full rounded-xl group">
                        <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
                        <div className="text-left">
                          <p className="text-xs text-stone-500">Previous</p>
                          <p className="font-medium line-clamp-1">{prevPost.title}</p>
                        </div>
                      </Button>
                    </Link>
                  ) : (
                    <div className="flex-1" />
                  )}

                  {nextPost && (
                    <Link to={`${createPageUrl('BlogPost')}?id=${nextPost.id}`} className="flex-1">
                      <Button variant="outline" className="w-full rounded-xl group">
                        <div className="text-right flex-1">
                          <p className="text-xs text-stone-500">Next</p>
                          <p className="font-medium line-clamp-1">{nextPost.title}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </motion.article>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Related Posts */}
            {(relatedPosts.length > 0 ? relatedPosts : otherPosts).length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h3 className="text-lg font-medium text-stone-900 mb-4">
                  {relatedPosts.length > 0 ? 'Related Articles' : 'More From Our Blog'}
                </h3>
                <div className="space-y-4">
                  {(relatedPosts.length > 0 ? relatedPosts : otherPosts).map((p, index) => (
                    <Link key={p.id} to={`${createPageUrl('BlogPost')}?id=${p.id}`}>
                      <Card className="border-0 shadow-sm hover:shadow-md transition-shadow group cursor-pointer">
                        <CardContent className="p-4">
                          <div className="flex gap-4">
                            <img
                              src={p.cover_image || 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=200'}
                              alt={p.title}
                              className="w-20 h-20 rounded-lg object-cover"
                            />
                            <div className="flex-1">
                              <h4 className="font-medium text-stone-900 mb-1 line-clamp-2 group-hover:text-amber-600 transition-colors">
                                {p.title}
                              </h4>
                              <p className="text-xs text-stone-500 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {p.published_date && format(new Date(p.published_date), 'MMM d')}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}

            {/* CTA */}
            <Card className="border-0 shadow-lg bg-stone-900 text-white">
              <CardContent className="p-6">
                <h3 className="font-medium mb-3">Ready to Transform Your Look?</h3>
                <p className="text-stone-400 text-sm mb-6">
                  Book an appointment with our expert stylists
                </p>
                <Link to={createPageUrl('Booking')}>
                  <Button className="w-full bg-amber-500 hover:bg-amber-400 text-stone-900 rounded-xl">
                    Book Now
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Newsletter */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <h3 className="font-medium text-stone-900 mb-3">Stay Updated</h3>
                <p className="text-stone-500 text-sm mb-4">
                  Get the latest style tips and trends
                </p>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Your email"
                    className="flex-1 px-4 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-stone-900"
                  />
                  <Button size="sm" className="bg-stone-900 hover:bg-stone-800">
                    Subscribe
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}