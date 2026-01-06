import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Scissors, Award, Users, Heart, ArrowRight } from 'lucide-react';

const values = [
  {
    icon: Scissors,
    title: 'Craftsmanship',
    description: 'Every cut is an art form. We combine traditional techniques with modern innovation.'
  },
  {
    icon: Award,
    title: 'Excellence',
    description: 'We hold ourselves to the highest standards in everything we do.'
  },
  {
    icon: Users,
    title: 'Community',
    description: 'Building lasting relationships with our clients is at the heart of who we are.'
  },
  {
    icon: Heart,
    title: 'Passion',
    description: 'Our love for the craft drives us to constantly improve and innovate.'
  }
];

const milestones = [
  { year: '2020', event: 'Hairy Opens Its Doors' },
  { year: '2021', event: 'Expanded to Premium Services' },
  { year: '2022', event: 'Launched Membership Program' },
  { year: '2023', event: '10,000+ Happy Clients Served' },
  { year: '2024', event: 'Award-Winning Team Assembled' }
];

export default function About() {
  return (
    <div className="min-h-screen bg-white pt-24">
      {/* Hero */}
      <section className="relative py-32 px-6 bg-stone-900 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/30 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-stone-500/30 rounded-full blur-3xl" />
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-6xl font-light text-white mb-6">
              Where Precision
              <br />
              <span className="font-medium bg-gradient-to-r from-amber-200 to-amber-400 bg-clip-text text-transparent">
                Meets Luxury
              </span>
            </h1>
            <p className="text-stone-400 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
              Founded in 2020, Hairy has redefined the grooming experience. 
              We believe that every visit should be a moment of transformation and relaxation.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-light text-stone-900 mb-6">Our Story</h2>
              <div className="space-y-5 text-stone-600 leading-relaxed text-lg">
                <p>
                  Hairy was born from a simple belief: that everyone deserves to feel confident 
                  and look their best. Our founder, inspired by the world's finest salons and 
                  barbershops in Paris, Milan, and Tokyo, set out to create a space where 
                  traditional craftsmanship meets modern luxury.
                </p>
                <p>
                  What started as a single-chair barbershop has grown into a full-service 
                  grooming destination. Our team of master stylists brings together expertise 
                  from around the globe, united by a passion for their craft and commitment 
                  to excellence.
                </p>
                <p>
                  Today, we're proud to serve thousands of discerning clients who trust us 
                  with their most important asset – their confidence. Every visit is crafted 
                  to be an experience, not just an appointment.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-6 mt-12">
                {[
                  { value: '10K+', label: 'Happy Clients' },
                  { value: '15+', label: 'Expert Stylists' },
                  { value: '25+', label: 'Premium Services' }
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="text-center"
                  >
                    <p className="text-3xl font-light text-amber-600 mb-1">{stat.value}</p>
                    <p className="text-sm text-stone-500">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="grid grid-cols-2 gap-4">
                <motion.img
                  whileHover={{ scale: 1.02 }}
                  src="https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=800"
                  alt="Hairy Salon Interior"
                  className="rounded-2xl shadow-xl h-64 w-full object-cover"
                />
                <motion.img
                  whileHover={{ scale: 1.02 }}
                  src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800"
                  alt="Styling"
                  className="rounded-2xl shadow-xl h-64 w-full object-cover"
                />
                <motion.img
                  whileHover={{ scale: 1.02 }}
                  src="https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=800"
                  alt="Grooming"
                  className="rounded-2xl shadow-xl h-64 w-full object-cover col-span-2"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-6 shadow-2xl">
                <p className="text-4xl font-light text-stone-900">4.9★</p>
                <p className="text-stone-800 text-sm font-medium">Client Rating</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 px-6 bg-stone-50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-light text-stone-900 mb-4">Our Values</h2>
            <p className="text-stone-500 text-lg">The principles that guide everything we do</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-stone-900 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Icon className="w-8 h-8 text-amber-400" />
                  </div>
                  <h3 className="text-xl font-medium text-stone-900 mb-3">{value.title}</h3>
                  <p className="text-stone-500">{value.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-light text-stone-900 mb-4">Our Journey</h2>
            <p className="text-stone-500 text-lg">Key milestones in our story</p>
          </motion.div>

          <div className="relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-stone-200 -translate-x-1/2" />
            {milestones.map((milestone, index) => (
              <motion.div
                key={milestone.year}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center gap-8 mb-8 ${
                  index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                }`}
              >
                <div className={`flex-1 ${index % 2 === 0 ? 'text-right' : 'text-left'}`}>
                  <span className="text-sm text-amber-600 font-medium">{milestone.year}</span>
                  <p className="text-lg text-stone-900">{milestone.event}</p>
                </div>
                <div className="w-4 h-4 bg-amber-500 rounded-full relative z-10" />
                <div className="flex-1" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-stone-900">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-light text-white mb-6">
              Ready to Experience the Difference?
            </h2>
            <p className="text-stone-400 text-lg mb-8">
              Book your appointment today and discover why thousands trust Hairy with their look.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to={createPageUrl('Booking')}>
                <Button className="bg-amber-500 hover:bg-amber-400 text-stone-900 px-8 py-6 text-base rounded-full">
                  Book Appointment
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to={createPageUrl('Barbers')}>
                <Button variant="outline" className="border-white/20 text-black bg-white hover:bg-white/90 px-8 py-6 text-base rounded-full">
                  Meet Our Team
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}