import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Star, ArrowRight, Award } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function TeamPreviewSection() {
  const { data: barbers = [], isLoading } = useQuery({
    queryKey: ["barbersPreview"],
    queryFn: () => base44.entities.Barber.filter({ is_active: true }),
  });

  const featuredBarbers = barbers.slice(0, 4);

  return (
    <section className="py-24 bg-stone-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end md:justify-between mb-12"
        >
          <div>
            <span className="text-amber-600 text-sm font-medium uppercase tracking-wider">
              Our Team
            </span>
            <h2 className="text-4xl md:text-5xl font-light text-stone-900 mt-3 mb-4">
              Meet Our Stylists
            </h2>
            <p className="text-stone-500 max-w-xl">
              Skilled artisans dedicated to perfecting your look with precision
              and passion.
            </p>
          </div>
          <Link to={createPageUrl("Barbers")} className="mt-6 md:mt-0">
            <Button variant="outline" className="rounded-full border-stone-300">
              View All Stylists
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </motion.div>

        {/* Team Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {isLoading
            ? [...Array(4)].map((_, i) => (
                <div key={i} className="text-center">
                  <Skeleton className="w-full aspect-square rounded-2xl mb-4" />
                  <Skeleton className="h-6 w-32 mx-auto mb-2" />
                  <Skeleton className="h-4 w-24 mx-auto" />
                </div>
              ))
            : featuredBarbers.map((barber, index) => (
                <motion.div
                  key={barber.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group"
                >
                  <Link
                    to={`${createPageUrl("BarberProfile")}?id=${barber.id}`}
                  >
                    <div className="relative overflow-hidden rounded-2xl mb-4">
                      <motion.img
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.6 }}
                        src={barber.photo_url || barber.image}
                        alt={barber.name}
                        className="w-full aspect-square object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      {/* Hover overlay content */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <div className="flex flex-wrap gap-1">
                          {(Array.isArray(barber.specialty)
                            ? barber.specialty
                            : [barber.specialty]
                          )
                            .slice(0, 2)
                            .map((spec, i) => (
                              <span
                                key={i}
                                className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs text-white"
                              >
                                {spec}
                              </span>
                            ))}
                        </div>
                      </div>

                      {/* Rating badge */}
                      <div className="absolute top-4 right-4">
                        <div className="flex items-center gap-1 px-2 py-1 bg-white rounded-full shadow-lg">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span className="font-medium text-xs">
                            {barber.rating?.toFixed(1) || "5.0"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-center">
                      <h3 className="font-medium text-stone-900 text-lg group-hover:text-amber-600 transition-colors">
                        {barber.name}
                      </h3>
                      <div className="flex items-center justify-center gap-1 text-stone-500 text-sm mt-1">
                        <Award className="w-3.5 h-3.5" />
                        <span>{barber.experience_years || 5}+ years</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
        </div>
      </div>
    </section>
  );
}
