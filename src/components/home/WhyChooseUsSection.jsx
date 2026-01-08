import { motion } from "framer-motion";
import {
  Clock,
  Award,
  Sparkles,
  Shield,
  Wifi,
  Coffee,
  CreditCard,
  CalendarCheck,
} from "lucide-react";

const features = [
  {
    icon: CalendarCheck,
    title: "Easy Online Booking",
    description:
      "Book your appointment 24/7 with our smart booking system. Get instant confirmation and reminders.",
  },
  {
    icon: Award,
    title: "Master Stylists",
    description:
      "Our team of certified professionals has 50+ combined years of experience in premium grooming.",
  },
  {
    icon: Sparkles,
    title: "Premium Products",
    description:
      "We use only the finest grooming products from top brands to ensure the best results.",
  },
  {
    icon: Shield,
    title: "Hygiene First",
    description:
      "Hospital-grade sanitization protocols. Fresh tools for every client, guaranteed.",
  },
  {
    icon: Wifi,
    title: "Modern Amenities",
    description:
      "Complimentary WiFi, charging stations, and entertainment while you wait.",
  },
  {
    icon: Coffee,
    title: "Refreshments",
    description:
      "Enjoy complimentary beverages including espresso, craft beer, and whiskey for members.",
  },
  {
    icon: CreditCard,
    title: "Flexible Payments",
    description:
      "All major cards accepted. Buy now, pay later options available.",
  },
  {
    icon: Clock,
    title: "Always On Time",
    description:
      "Precise scheduling means minimal wait times. Your time is valuable to us.",
  },
];

export default function WhyChooseUsSection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-amber-600 text-sm font-medium uppercase tracking-wider">
            Why Glowé
          </span>
          <h2 className="text-4xl md:text-5xl font-light text-stone-900 mt-3 mb-4">
            The Glowé Difference
          </h2>
          <p className="text-stone-500 max-w-2xl mx-auto">
            We&apos;re not just a salon. We&apos;re a destination for those who
            appreciate the finer things in beauty.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05, duration: 0.5 }}
                whileHover={{ y: -5 }}
                className="group p-6 bg-stone-50 rounded-2xl hover:bg-stone-900 transition-all duration-500"
              >
                <div className="w-14 h-14 bg-amber-500/10 group-hover:bg-amber-500 rounded-xl flex items-center justify-center mb-4 transition-colors duration-500">
                  <Icon className="w-7 h-7 text-amber-600 group-hover:text-white transition-colors duration-500" />
                </div>
                <h3 className="font-medium text-stone-900 group-hover:text-white mb-2 transition-colors duration-500">
                  {feature.title}
                </h3>
                <p className="text-stone-500 group-hover:text-stone-400 text-sm leading-relaxed transition-colors duration-500">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
