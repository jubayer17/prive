import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { createPageUrl } from '@/utils';
import { Gift, ArrowRight, Sparkles } from 'lucide-react';

export default function GiftCardSection() {
  return (
    <section className="py-32 px-6 bg-gradient-to-br from-amber-50 via-white to-stone-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-100/50 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-stone-100/50 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span className="text-amber-700 text-sm font-medium">The Perfect Present</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-light text-stone-900 mb-6 tracking-tight">
              Gift a Style
              <br />
              <span className="font-medium">Experience</span>
            </h2>

            <p className="text-lg text-stone-500 mb-8 leading-relaxed">
              Give the gift of luxury grooming. Our digital gift cards are delivered instantly 
              and can be used for any service or product at Hairy.
            </p>

            <Link to={createPageUrl('GiftCards')}>
              <Button 
                size="lg" 
                className="bg-stone-900 hover:bg-stone-800 text-white px-8 py-6 text-base rounded-full group"
              >
                <Gift className="w-5 h-5 mr-2" />
                Purchase Gift Card
                <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            {/* Gift card visual */}
            <motion.div
              whileHover={{ rotateY: 10, rotateX: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="relative"
              style={{ perspective: 1000 }}
            >
              <div className="relative bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 rounded-3xl p-8 shadow-2xl aspect-[1.6/1] max-w-md mx-auto overflow-hidden">
                {/* Card shine effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent" />
                
                {/* Gold accents */}
                <div className="absolute top-4 right-4 w-16 h-16">
                  <div className="w-full h-full border-2 border-amber-400/30 rounded-full" />
                  <div className="absolute inset-2 border border-amber-400/20 rounded-full" />
                </div>

                <div className="relative z-10 h-full flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center">
                        <Gift className="w-5 h-5 text-stone-900" />
                      </div>
                      <span className="text-white/80 text-sm font-light tracking-widest uppercase">Gift Card</span>
                    </div>
                    <h3 className="text-3xl font-light text-white">Hairy</h3>
                  </div>

                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-stone-400 text-xs mb-1">Value</p>
                      <p className="text-2xl font-light text-white">$100</p>
                    </div>
                    <div className="text-right">
                      <p className="text-stone-400 text-xs mb-1">For</p>
                      <p className="text-white font-light">Someone Special</p>
                    </div>
                  </div>
                </div>

                {/* Floating particles */}
                <motion.div
                  animate={{ y: [-5, 5, -5], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute top-1/2 left-1/2 w-2 h-2 bg-amber-400/50 rounded-full"
                />
                <motion.div
                  animate={{ y: [5, -5, 5], opacity: [0.2, 0.5, 0.2] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                  className="absolute top-1/3 left-1/4 w-1 h-1 bg-amber-400/50 rounded-full"
                />
              </div>

              {/* Shadow card behind */}
              <div className="absolute -bottom-4 -right-4 w-full h-full bg-stone-200 rounded-3xl -z-10" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}