import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, ArrowRight, Search, User } from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

const categories = [
  { id: "all", name: "All Posts" },
  { id: "hair-care", name: "Hair Care" },
  { id: "styling-tips", name: "Styling Tips" },
  { id: "trends", name: "Trends" },
  { id: "wellness", name: "Wellness" },
  { id: "news", name: "News" },
];

export default function Blog() {
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["blogPosts"],
    queryFn: () =>
      base44.entities.BlogPost.filter(
        { is_published: true },
        "-published_date"
      ),
  });

  const filteredPosts = posts.filter((post) => {
    const categoryMatch = category === "all" || post.category === category;
    const searchMatch =
      !search ||
      post.title?.toLowerCase().includes(search.toLowerCase()) ||
      post.excerpt?.toLowerCase().includes(search.toLowerCase());
    return categoryMatch && searchMatch;
  });

  const featuredPost = filteredPosts[0];
  const otherPosts = filteredPosts.slice(1);

  return (
    <div className="min-h-screen bg-white pt-24">
      {/* Hero */}
      <section className="bg-stone-900 py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-5xl font-light text-white mb-4">
              The Hairy Journal
            </h1>
            <p className="text-stone-400 text-lg max-w-xl mx-auto">
              Style tips, trends, and grooming insights from our experts
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 px-6 border-b border-stone-100 sticky top-20 bg-white/80 backdrop-blur-xl z-30">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <Tabs value={category} onValueChange={setCategory}>
            <TabsList className="bg-stone-100 p-1 h-auto inline-flex overflow-x-auto">
              {categories.map((cat) => (
                <TabsTrigger
                  key={cat.id}
                  value={cat.id}
                  className="rounded-full px-4 py-2 text-sm whitespace-nowrap data-[state=active]:bg-stone-900 data-[state=active]:text-white"
                >
                  {cat.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <Input
              placeholder="Search articles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 w-48 md:w-64 h-10 rounded-full bg-stone-100 border-0"
            />
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="space-y-8">
              <Skeleton className="h-96 rounded-3xl" />
              <div className="grid md:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-72 rounded-2xl" />
                ))}
              </div>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-stone-500 text-lg">No articles found</p>
              <Button
                variant="outline"
                onClick={() => {
                  setCategory("all");
                  setSearch("");
                }}
                className="mt-4 rounded-full"
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <>
              {/* Featured Post */}
              {featuredPost && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-12"
                >
                  <Link
                    to={`${createPageUrl("BlogPost")}?id=${featuredPost.id}`}
                  >
                    <div className="relative rounded-3xl overflow-hidden group cursor-pointer">
                      <img
                        src={
                          featuredPost.cover_image ||
                          "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=1200"
                        }
                        alt={featuredPost.title}
                        className="w-full h-96 object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/40 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                        <span className="px-3 py-1 bg-amber-500 text-stone-900 text-xs font-semibold rounded-full capitalize mb-4 inline-block">
                          {featuredPost.category?.replace("-", " ")}
                        </span>
                        <h2 className="text-2xl md:text-4xl font-light text-white mb-4 group-hover:text-amber-200 transition-colors">
                          {featuredPost.title}
                        </h2>
                        <p className="text-stone-300 text-base mb-4 max-w-2xl line-clamp-2">
                          {featuredPost.excerpt}
                        </p>
                        <div className="flex items-center gap-6 text-sm text-stone-400">
                          <span className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            {featuredPost.author || "Hairy Team"}
                          </span>
                          <span className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {featuredPost.published_date &&
                              format(
                                new Date(featuredPost.published_date),
                                "MMM d, yyyy"
                              )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )}

              {/* Other Posts */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {otherPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link to={`${createPageUrl("BlogPost")}?id=${post.id}`}>
                      <div className="group cursor-pointer">
                        <div className="relative rounded-2xl overflow-hidden mb-4">
                          <img
                            src={
                              post.cover_image ||
                              "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=600"
                            }
                            alt={post.title}
                            className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute top-4 left-4">
                            <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-stone-800 text-xs font-medium rounded-full capitalize">
                              {post.category?.replace("-", " ")}
                            </span>
                          </div>
                        </div>
                        <h3 className="text-xl font-medium text-stone-900 mb-2 group-hover:text-amber-600 transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-stone-500 text-sm mb-4 line-clamp-2">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-stone-400">
                            {post.published_date &&
                              format(
                                new Date(post.published_date),
                                "MMM d, yyyy"
                              )}
                          </span>
                          <span className="text-amber-600 font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                            Read More
                            <ArrowRight className="w-4 h-4" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
