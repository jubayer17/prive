import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";

const testimonials = [
  {
    id: 1,
    name: "Alexander Mitchell",
    role: "Executive",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
    rating: 5,
    text: "Glowé has completely transformed my beauty experience. The attention to detail and personalized service is unmatched. I've been a member for over a year now and wouldn't go anywhere else.",
  },
  {
    id: 2,
    name: "Marcus Johnson",
    role: "Entrepreneur",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200",
    rating: 5,
    text: "The ambiance, the service, the expertise - everything about Glowé screams premium. My stylist understands exactly what I need before I even explain. That's the mark of true professionals.",
  },
  {
    id: 3,
    name: "David Chen",
    role: "Tech Lead",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200",
    rating: 5,
    text: "Best investment I've made for my personal grooming. The membership pays for itself, and the VIP treatment makes every visit special. Highly recommend the hot towel shave!",
  },
  {
    id: 4,
    name: "James Williams",
    role: "Lawyer",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200",
    rating: 5,
    text: "Professional, punctual, and perfection every time. The online booking system is seamless, and the reminders ensure I never miss an appointment. This is how modern grooming should be.",
  },
];

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((prev) => (prev + 1) % testimonials.length);
  const prev = () =>
    setCurrent(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );

  return (
    <section className="py-24 bg-stone-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-amber-600 text-sm font-medium uppercase tracking-wider">
            Testimonials
          </span>
          <h2 className="text-4xl md:text-5xl font-light text-stone-900 mt-3 mb-4">
            What Our Clients Say
          </h2>
          <p className="text-stone-500 max-w-2xl mx-auto">
            Don&apos;t just take our word for it. Here&apos;s what our valued
            clients have to say about their Glowé experience.
          </p>
        </motion.div>

        {/* Testimonial Carousel */}
        <div className="relative max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-3xl p-8 md:p-12 shadow-xl relative"
            >
              {/* Quote icon */}
              <Quote className="absolute top-8 right-8 w-12 h-12 text-amber-100" />

              <div className="flex flex-col md:flex-row gap-8 items-center">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div className="relative">
                    <img
                      src={testimonials[current].image}
                      alt={testimonials[current].name}
                      className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover"
                    />
                    <div className="absolute -bottom-2 -right-2 bg-amber-500 rounded-full p-2">
                      <Star className="w-4 h-4 text-white fill-white" />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 text-center md:text-left">
                  {/* Stars */}
                  <div className="flex justify-center md:justify-start gap-1 mb-4">
                    {[...Array(testimonials[current].rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>

                  {/* Text */}
                  <p className="text-stone-600 text-lg leading-relaxed mb-6 italic">
                    &ldquo;{testimonials[current].text}&rdquo;
                  </p>

                  {/* Author */}
                  <div>
                    <h4 className="font-medium text-stone-900 text-lg">
                      {testimonials[current].name}
                    </h4>
                    <p className="text-stone-500 text-sm">
                      {testimonials[current].role}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-center items-center gap-4 mt-8">
            <Button
              variant="outline"
              size="icon"
              onClick={prev}
              className="rounded-full border-stone-300 hover:bg-stone-900 hover:text-white hover:border-stone-900"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>

            {/* Dots */}
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrent(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    index === current
                      ? "bg-amber-500 w-8"
                      : "bg-stone-300 hover:bg-stone-400"
                  }`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={next}
              className="rounded-full border-stone-300 hover:bg-stone-900 hover:text-white hover:border-stone-900"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
